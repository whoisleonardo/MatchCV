package com.matchcv.dto.api;

import java.util.List;

public record OptimizedCvResponse(
        List<String> optimized_bullets,
        int faang_ready_score,
        List<String> improvements
) {}
