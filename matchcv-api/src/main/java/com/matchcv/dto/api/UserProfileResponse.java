package com.matchcv.dto.api;

import com.matchcv.model.Plan;
import com.matchcv.model.UserProfile;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record UserProfileResponse(
        UUID id,
        String email,
        String fullName,
        String username,
        String title,
        String location,
        String phone,
        String linkedin,
        String summary,
        List<String> skills,
        Plan plan,
        Instant createdAt
) {
    public static UserProfileResponse from(UserProfile p) {
        return new UserProfileResponse(
                p.getId(),
                p.getEmail(),
                p.getFullName(),
                p.getUsername(),
                p.getTitle(),
                p.getLocation(),
                p.getPhone(),
                p.getLinkedin(),
                p.getSummary(),
                p.getSkills(),
                p.getPlan(),
                p.getCreatedAt()
        );
    }
}
