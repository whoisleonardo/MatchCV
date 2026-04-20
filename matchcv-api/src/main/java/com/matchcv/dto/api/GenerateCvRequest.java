package com.matchcv.dto.api;

import jakarta.validation.constraints.NotBlank;

public record GenerateCvRequest(
        @NotBlank String jobDescription,
        @NotBlank String language
) {}
