package com.matchcv.dto.billing;

import com.matchcv.model.PlanType;
import jakarta.validation.constraints.NotNull;

public record CheckoutRequest(@NotNull PlanType planType) {}
