# Stripe Billing & Plan Enforcement — Design Spec
_Date: 2026-04-27_

## Status

The core billing implementation (Stripe Checkout, webhook handling, plan enforcement, idempotency) is **already complete** in the codebase. This spec documents the two remaining gaps and the exact changes required to close them.

---

## What Exists (do not modify)

| File | Purpose |
|---|---|
| `model/Plan.java` | FREE / PRO / LIFETIME enum with limits + watermark |
| `model/PlanType.java` | PRO_MONTHLY / PRO_YEARLY / LIFETIME enum |
| `model/UserProfile.java` | Cassandra entity with all billing fields |
| `model/ProcessedWebhook.java` | Idempotency table entity |
| `model/StripeCustomerToUid.java` | Customer-to-user lookup entity |
| `service/PlanService.java` | validateProfileLimit, validateMonthlyUsage, incrementUsage, checkWatermark |
| `service/StripeService.java` | createCheckoutSession + processWebhook (3 events) |
| `controller/BillingController.java` | POST /api/billing/checkout, POST /api/billing/webhook |
| `config/StripeConfig.java` | Initializes Stripe.apiKey from env |
| `security/SecurityConfig.java` | Webhook is permitAll; all other /api/** requires JWT |
| `dto/billing/CheckoutRequest.java` | record { PlanType planType } |
| `dto/billing/CheckoutResponse.java` | record { String checkoutUrl } |
| migrations V10–V13 | Billing fields, usage tracking, webhooks, customer lookup |
| `application.properties` | All Stripe env vars mapped |

---

## Gaps to Fix

### Gap 1 — `UserProfile` leaks OAuth fields

**Problem:** `oauthSub` and `oauthProvider` have no `@JsonIgnore`. They appear in any response that returns the entity directly.

**Fix:** Add `@JsonIgnore` to both fields in `UserProfile.java`.

**Fields affected:**
```java
@JsonIgnore
@Column("oauth_sub")
private String oauthSub;

@JsonIgnore
@Column("oauth_provider")
private String oauthProvider;
```

---

### Gap 2 — `ProfileController` returns entity instead of DTO

**Problem:** `getMe()` and `updateMe()` return `UserProfile` directly. Even with `@JsonIgnore` annotations, the security constraint says "use DTOs for responses."

**Fix:** Introduce `UserProfileResponse` record and update both methods.

#### New file: `dto/api/UserProfileResponse.java`

A `record` with a static `from(UserProfile)` factory. Exposed fields:

| Field | Type |
|---|---|
| id | UUID |
| email | String |
| fullName | String |
| username | String |
| title | String |
| location | String |
| phone | String |
| linkedin | String |
| summary | String |
| skills | List<String> |
| plan | Plan |
| createdAt | Instant |

Excluded (never exposed): `passwordHash`, `stripeCustomerId`, `stripeSubscriptionId`, `oauthSub`, `oauthProvider`, `updatedAt`.

#### Updated: `controller/ProfileController.java`

- `getMe()` return type → `UserProfileResponse`
- `updateMe()` return type → `UserProfileResponse`
- Both call `UserProfileResponse.from(...)` on the result

---

## Constraints

- Keep Lombok in all existing files — do not refactor
- New DTO must be a `record`, no Lombok
- No other files change
- No new tests required (changes are additive/cosmetic)
