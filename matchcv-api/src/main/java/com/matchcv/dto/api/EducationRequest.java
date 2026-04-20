package com.matchcv.dto.api;

import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;

public record EducationRequest(
        @NotBlank String institution,
        String degree,
        String field,
        LocalDate startDate,
        LocalDate endDate
) {}
