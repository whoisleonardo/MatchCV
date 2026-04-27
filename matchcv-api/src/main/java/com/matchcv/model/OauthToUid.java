package com.matchcv.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.cassandra.core.mapping.Column;
import org.springframework.data.cassandra.core.mapping.PrimaryKey;
import org.springframework.data.cassandra.core.mapping.Table;

import java.util.UUID;

@Table("oauth_to_uid")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OauthToUid {

    /** Format: "google:<sub>" or "github:<id>" — stored in column "oauthkey" */
    @PrimaryKey
    private String oauthKey;

    @Column("user_id")
    private UUID userId;
}
