package com.matchcv.service;

import com.matchcv.model.*;
import com.matchcv.repository.StripeCustomerToUidRepository;
import com.matchcv.repository.UserProfileRepository;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.EventDataObjectDeserializer;
import com.stripe.model.Invoice;
import com.stripe.model.StripeObject;
import com.stripe.model.Subscription;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.cassandra.core.CassandraOperations;
import org.springframework.data.cassandra.core.InsertOptions;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class StripeService {

    private final UserProfileRepository userProfileRepository;
    private final StripeCustomerToUidRepository customerToUidRepository;
    private final CassandraOperations cassandraOperations;

    @Value("${stripe.webhook-secret}")
    private String webhookSecret;

    @Value("${stripe.price.pro-monthly}")
    private String priceProMonthly;

    @Value("${stripe.price.pro-yearly}")
    private String priceProYearly;

    @Value("${stripe.price.lifetime}")
    private String priceLifetime;

    @Value("${app.base-url}")
    private String baseUrl;

    public StripeService(UserProfileRepository userProfileRepository,
                         StripeCustomerToUidRepository customerToUidRepository,
                         CassandraOperations cassandraOperations) {
        this.userProfileRepository = userProfileRepository;
        this.customerToUidRepository = customerToUidRepository;
        this.cassandraOperations = cassandraOperations;
    }

    // ── Checkout ─────────────────────────────────────────────────────────────

    public String createCheckoutSession(UserProfile user, PlanType planType) {
        boolean isSubscription = planType != PlanType.LIFETIME;
        String priceId = resolvePriceId(planType);

        SessionCreateParams.Builder params = SessionCreateParams.builder()
                .setMode(isSubscription
                        ? SessionCreateParams.Mode.SUBSCRIPTION
                        : SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(baseUrl + "/billing/success")
                .setCancelUrl(baseUrl + "/billing/cancel")
                .addLineItem(SessionCreateParams.LineItem.builder()
                        .setPrice(priceId)
                        .setQuantity(1L)
                        .build())
                .putMetadata("userId", user.getId().toString())
                .putMetadata("planType", planType.name());

        if (hasText(user.getStripeCustomerId())) {
            params.setCustomer(user.getStripeCustomerId());
        } else if (hasText(user.getEmail())) {
            params.setCustomerEmail(user.getEmail());
            if (!isSubscription) {
                params.setCustomerCreation(SessionCreateParams.CustomerCreation.ALWAYS);
            }
        }

        try {
            Session session = Session.create(params.build());
            return session.getUrl();
        } catch (Exception e) {
            throw new RuntimeException("Failed to create Stripe checkout session", e);
        }
    }

    // ── Webhook ───────────────────────────────────────────────────────────────

    public void processWebhook(String payload, String sigHeader) {
        Event event = verifySignature(payload, sigHeader);

        ProcessedWebhook record = new ProcessedWebhook(event.getId(), Instant.now());
        boolean applied = cassandraOperations
                .insert(record, InsertOptions.builder().withIfNotExists().build())
                .wasApplied();

        if (!applied) return; // duplicate delivery — skip

        EventDataObjectDeserializer deserializer = event.getDataObjectDeserializer();
        Optional<StripeObject> objectOpt = deserializer.getObject();

        if (objectOpt.isEmpty()) {
            throw new RuntimeException("Cannot deserialize Stripe event object: " + event.getId());
        }

        StripeObject stripeObject = objectOpt.get();

        switch (event.getType()) {
            case "checkout.session.completed"    -> handleCheckoutCompleted((Session) stripeObject);
            case "invoice.paid"                  -> handleInvoicePaid((Invoice) stripeObject);
            case "customer.subscription.deleted" -> handleSubscriptionDeleted((Subscription) stripeObject);
            default                              -> {} // unknown event — ignore safely
        }
    }

    // ── Event handlers ────────────────────────────────────────────────────────

    private void handleCheckoutCompleted(Session session) {
        if (session.getMetadata() == null || !session.getMetadata().containsKey("userId")) {
            throw new RuntimeException("Missing userId in checkout session metadata");
        }

        UUID userId     = UUID.fromString(session.getMetadata().get("userId"));
        String planTypeRaw = session.getMetadata().get("planType");

        UserProfile user = userProfileRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        Plan newPlan = switch (PlanType.valueOf(planTypeRaw)) {
            case PRO_MONTHLY, PRO_YEARLY -> Plan.PRO;
            case LIFETIME                -> Plan.LIFETIME;
        };

        user.setPlan(newPlan);

        if (hasText(session.getCustomer())) {
            user.setStripeCustomerId(session.getCustomer());
            customerToUidRepository.save(new StripeCustomerToUid(session.getCustomer(), userId));
        }

        if (hasText(session.getSubscription())) {
            user.setStripeSubscriptionId(session.getSubscription());
        }

        userProfileRepository.save(user);
    }

    private void handleInvoicePaid(Invoice invoice) {
        if (!hasText(invoice.getCustomer())) return;

        UserProfile user = findByCustomerId(invoice.getCustomer());
        if (user == null) return;

        boolean changed = false;

        Plan current = user.getPlan() != null ? user.getPlan() : Plan.FREE;
        if (current == Plan.FREE) {
            user.setPlan(Plan.PRO);
            changed = true;
        }

        if (hasText(invoice.getSubscription())
                && !invoice.getSubscription().equals(user.getStripeSubscriptionId())) {
            user.setStripeSubscriptionId(invoice.getSubscription());
            changed = true;
        }

        if (changed) userProfileRepository.save(user);
    }

    private void handleSubscriptionDeleted(Subscription subscription) {
        if (!hasText(subscription.getCustomer())) return;

        UserProfile user = findByCustomerId(subscription.getCustomer());
        if (user == null) return;

        Plan current = user.getPlan() != null ? user.getPlan() : Plan.FREE;
        if (current == Plan.PRO) {
            user.setPlan(Plan.FREE);
            user.setStripeSubscriptionId(null);
            userProfileRepository.save(user);
        }
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private Event verifySignature(String payload, String sigHeader) {
        try {
            return Webhook.constructEvent(payload, sigHeader, webhookSecret);
        } catch (SignatureVerificationException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid Stripe signature");
        }
    }

    private UserProfile findByCustomerId(String customerId) {
        return customerToUidRepository.findById(customerId)
                .flatMap(mapping -> userProfileRepository.findById(mapping.getUserId()))
                .orElse(null);
    }

    private String resolvePriceId(PlanType planType) {
        return switch (planType) {
            case PRO_MONTHLY -> priceProMonthly;
            case PRO_YEARLY  -> priceProYearly;
            case LIFETIME    -> priceLifetime;
        };
    }

    private boolean hasText(String s) {
        return s != null && !s.isBlank();
    }
}
