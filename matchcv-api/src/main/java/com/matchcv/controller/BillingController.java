package com.matchcv.controller;

import com.matchcv.dto.billing.CheckoutRequest;
import com.matchcv.dto.billing.CheckoutResponse;
import com.matchcv.model.UserProfile;
import com.matchcv.repository.UserProfileRepository;
import com.matchcv.service.StripeService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.UUID;

@RestController
@RequestMapping("/api/billing")
public class BillingController {

    private final StripeService stripeService;
    private final UserProfileRepository userProfileRepository;

    public BillingController(StripeService stripeService,
                             UserProfileRepository userProfileRepository) {
        this.stripeService = stripeService;
        this.userProfileRepository = userProfileRepository;
    }

    @PostMapping("/checkout")
    public CheckoutResponse checkout(@Valid @RequestBody CheckoutRequest request,
                                     Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getName());
        UserProfile user = userProfileRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        String url = stripeService.createCheckoutSession(user, request.planType());
        return new CheckoutResponse(url);
    }

    @PostMapping("/webhook")
    public ResponseEntity<Void> webhook(HttpServletRequest request,
                                        @RequestHeader("Stripe-Signature") String stripeSignature)
            throws IOException {

        String payload = new String(request.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
        stripeService.processWebhook(payload, stripeSignature);
        return ResponseEntity.ok().build();
    }
}
