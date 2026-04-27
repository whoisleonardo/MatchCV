package com.matchcv.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.cassandra.core.mapping.Column;
import org.springframework.data.cassandra.core.mapping.PrimaryKey;
import org.springframework.data.cassandra.core.mapping.Table;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Table("user_profiles")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfile {

    @PrimaryKey
    private UUID id;

    @Column("full_name")
    private String fullName;

    @Column("username")
    private String username;

    @Column("location")
    private String location;

    @Column("linkedin")
    private String linkedin;

    @Column("summary")
    private String summary;

    @Column("title")
    private String title;

    @Column("email")
    private String email;

    @Column("phone")
    private String phone;

    @Column("plan")
    private Plan plan;

    @JsonIgnore
    @Column("stripe_customer_id")
    private String stripeCustomerId;

    @JsonIgnore
    @Column("stripe_subscription_id")
    private String stripeSubscriptionId;

    @Column("skills")
    private List<String> skills;

    @JsonIgnore
    @Column("password_hash")
    private String passwordHash;

    @JsonIgnore
    @Column("oauth_provider")
    private String oauthProvider;

    @JsonIgnore
    @Column("oauth_sub")
    private String oauthSub;

    @Column("created_at")
    private Instant createdAt;

    @Column("updated_at")
    private Instant updatedAt;
}
