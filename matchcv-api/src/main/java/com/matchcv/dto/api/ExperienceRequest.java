package com.matchcv.dto.api;

import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;

public record ExperienceRequest(
        @NotBlank String company,
        @NotBlank String role,
        String description,
        LocalDate startDate,
        LocalDate endDate,
        boolean isCurrent
) {}
