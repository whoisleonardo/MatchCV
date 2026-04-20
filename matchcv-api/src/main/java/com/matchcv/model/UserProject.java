package com.matchcv.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.cassandra.core.mapping.Column;
import org.springframework.data.cassandra.core.mapping.PrimaryKey;
import org.springframework.data.cassandra.core.mapping.Table;

import java.time.LocalDate;

@Table("user_projects")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProject {

    @PrimaryKey
    private UserProjectKey key;

    @Column("name")
    private String name;

    @Column("role")
    private String role;

    @Column("description")
    private String description;

    @Column("url")
    private String url;

    @Column("date")
    private LocalDate date;
}
