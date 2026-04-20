package com.matchcv.dto.api;

import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;

public record ProjectRequest(
        @NotBlank String name,
        String role,
        String description,
        String url,
        LocalDate date
) {}
