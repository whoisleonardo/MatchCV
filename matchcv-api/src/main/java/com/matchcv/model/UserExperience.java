package com.matchcv.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.cassandra.core.mapping.Column;
import org.springframework.data.cassandra.core.mapping.PrimaryKey;
import org.springframework.data.cassandra.core.mapping.Table;

import java.time.LocalDate;

@Table("user_experiences")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserExperience {

    @PrimaryKey
    private UserExperienceKey key;

    @Column("company")
    private String company;

    @Column("role")
    private String role;

    @Column("description")
    private String description;

    @Column("start_date")
    private LocalDate startDate;

    @Column("end_date")
    private LocalDate endDate;

    @Column("is_current")
    private Boolean isCurrent;
}
