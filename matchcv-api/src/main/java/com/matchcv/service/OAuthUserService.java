package com.matchcv.service;

import com.matchcv.model.OauthToUid;
import com.matchcv.model.Plan;
import com.matchcv.model.UserProfile;
import com.matchcv.model.UsernameToUid;
import com.matchcv.repository.OauthToUidRepository;
import com.matchcv.repository.UserProfileRepository;
import com.matchcv.repository.UsernameToUidRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OAuthUserService {

    private final OauthToUidRepository oauthToUidRepository;
    private final UserProfileRepository userProfileRepository;
    private final UsernameToUidRepository usernameToUidRepository;

    /**
     * Finds or creates the user for an OAuth2 login.
     *
     * @param provider "google" or "github"
     * @param oauth2User the authenticated OAuth2 user attributes
     * @return the existing or newly created UserProfile
     */
    public UserProfile findOrCreate(String provider, OAuth2User oauth2User) {
        Map<String, Object> attrs = oauth2User.getAttributes();

        String sub = extractSub(provider, attrs);
        String oauthKey = provider + ":" + sub;

        // Try existing mapping
        return oauthToUidRepository.findById(oauthKey)
                .flatMap(mapping -> userProfileRepository.findById(mapping.getUserId()))
                .orElseGet(() -> createOAuthUser(provider, sub, oauthKey, attrs));
    }

    private UserProfile createOAuthUser(String provider, String sub, String oauthKey,
                                        Map<String, Object> attrs) {
        String email = extractEmail(attrs);
        String fullName = extractName(attrs);
        String username = generateUsername(email, sub);

        Instant now = Instant.now();
        UserProfile profile = UserProfile.builder()
                .id(UUID.randomUUID())
                .fullName(fullName)
                .username(username)
                .email(email)
                .plan(Plan.FREE)
                .oauthProvider(provider)
                .oauthSub(sub)
                .createdAt(now)
                .updatedAt(now)
                .build();

        userProfileRepository.save(profile);
        usernameToUidRepository.save(new UsernameToUid(username, profile.getId()));
        oauthToUidRepository.save(new OauthToUid(oauthKey, profile.getId()));

        return profile;
    }

    // -------------------------------------------------------------------------

    private String extractSub(String provider, Map<String, Object> attrs) {
        if ("github".equals(provider)) {
            Object id = attrs.get("id");
            return id != null ? id.toString() : attrs.get("login").toString();
        }
        // Google uses "sub"; fall back to "id" if missing
        Object sub = attrs.get("sub");
        if (sub != null) return sub.toString();
        Object id = attrs.get("id");
        if (id != null) return id.toString();
        throw new IllegalStateException("Cannot determine OAuth2 sub for provider: " + provider);
    }

    private String extractEmail(Map<String, Object> attrs) {
        Object email = attrs.get("email");
        return email != null ? email.toString() : "";
    }

    private String extractName(Map<String, Object> attrs) {
        Object name = attrs.get("name");
        return name != null ? name.toString() : "";
    }

    /** Derives a unique username from the email local-part, appending a random suffix on collision. */
    private String generateUsername(String email, String fallback) {
        String base = email.contains("@")
                ? email.split("@")[0].replaceAll("[^a-zA-Z0-9_]", "").toLowerCase()
                : fallback.toLowerCase().replaceAll("[^a-zA-Z0-9_]", "");

        if (base.isBlank()) {
            base = "user";
        }

        String candidate = base;
        while (usernameToUidRepository.existsById(candidate)) {
            candidate = base + UUID.randomUUID().toString().substring(0, 6);
        }
        return candidate;
    }
}
