package com.matchcv.model;

import org.springframework.data.cassandra.core.mapping.Column;
import org.springframework.data.cassandra.core.mapping.PrimaryKey;
import org.springframework.data.cassandra.core.mapping.Table;

import java.util.UUID;

@Table("stripe_customer_to_uid")
public class StripeCustomerToUid {

    @PrimaryKey
    @Column("customer_id")
    private String customerId;

    @Column("user_id")
    private UUID userId;

    public StripeCustomerToUid() {}

    public StripeCustomerToUid(String customerId, UUID userId) {
        this.customerId = customerId;
        this.userId = userId;
    }

    public String getCustomerId() { return customerId; }
    public UUID getUserId()       { return userId; }
}
