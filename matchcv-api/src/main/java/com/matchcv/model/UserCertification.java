package com.matchcv.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.cassandra.core.mapping.Column;
import org.springframework.data.cassandra.core.mapping.PrimaryKey;
import org.springframework.data.cassandra.core.mapping.Table;

import java.time.LocalDate;

@Table("user_certifications")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserCertification {

    @PrimaryKey
    private UserCertificationKey key;

    @Column("name")
    private String name;

    @Column("issuer")
    private String issuer;

    @Column("issued_date")
    private LocalDate issuedDate;

    @Column("expires_at")
    private LocalDate expiresAt;

    @Column("url")
    private String url;
}
