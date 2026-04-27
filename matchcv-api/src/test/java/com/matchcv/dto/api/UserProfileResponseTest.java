package com.matchcv.dto.api;

import com.matchcv.model.Plan;
import com.matchcv.model.UserProfile;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class UserProfileResponseTest {

    @Test
    void from_mapsAllSafeFields() {
        UUID id = UUID.randomUUID();
        Instant now = Instant.now();

        UserProfile profile = UserProfile.builder()
                .id(id)
                .email("user@example.com")
                .fullName("Ada Lovelace")
                .username("ada")
                .title("Engineer")
                .location("London")
                .phone("+44 20 0000 0000")
                .linkedin("https://linkedin.com/in/ada")
                .summary("Pioneer")
                .skills(List.of("Java", "Maths"))
                .plan(Plan.PRO)
                .createdAt(now)
                .passwordHash("secret-hash")
                .stripeCustomerId("cus_abc")
                .stripeSubscriptionId("sub_abc")
                .oauthSub("google|123")
                .oauthProvider("google")
                .build();

        UserProfileResponse dto = UserProfileResponse.from(profile);

        assertEquals(id,                            dto.id());
        assertEquals("user@example.com",            dto.email());
        assertEquals("Ada Lovelace",                dto.fullName());
        assertEquals("ada",                         dto.username());
        assertEquals("Engineer",                    dto.title());
        assertEquals("London",                      dto.location());
        assertEquals("+44 20 0000 0000",            dto.phone());
        assertEquals("https://linkedin.com/in/ada", dto.linkedin());
        assertEquals("Pioneer",                     dto.summary());
        assertEquals(List.of("Java", "Maths"),      dto.skills());
        assertEquals(Plan.PRO,                      dto.plan());
        assertEquals(now,                           dto.createdAt());
    }

    @Test
    void from_handlesNullOptionalFields() {
        UserProfile profile = UserProfile.builder()
                .id(UUID.randomUUID())
                .email("min@example.com")
                .plan(Plan.FREE)
                .createdAt(Instant.now())
                .build();

        UserProfileResponse dto = UserProfileResponse.from(profile);

        assertNull(dto.fullName());
        assertNull(dto.username());
        assertNull(dto.skills());
    }
}
