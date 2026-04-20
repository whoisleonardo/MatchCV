package com.matchcv.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.cassandra.core.mapping.Column;
import org.springframework.data.cassandra.core.mapping.PrimaryKey;
import org.springframework.data.cassandra.core.mapping.Table;

import java.util.UUID;

@Table("username_to_uid")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UsernameToUid {

    @PrimaryKey
    private String username;

    @Column("user_id")
    private UUID userId;
}
