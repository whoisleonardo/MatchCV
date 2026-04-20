package com.matchcv.dto.api;

import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;

public record CertificationRequest(
        @NotBlank String name,
        @NotBlank String issuer,
        LocalDate issuedDate,
        LocalDate expiresAt,
        String url
) {}
