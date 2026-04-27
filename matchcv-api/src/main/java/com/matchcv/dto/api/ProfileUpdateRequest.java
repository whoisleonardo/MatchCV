package com.matchcv.dto.api;

import java.util.List;

public record ProfileUpdateRequest(
        String fullName,
        String title,
        String phone,
        String location,
        String linkedin,
        String summary,
        List<String> skills
) {}
