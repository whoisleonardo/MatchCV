package com.matchcv.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.cassandra.core.mapping.Column;
import org.springframework.data.cassandra.core.mapping.PrimaryKey;
import org.springframework.data.cassandra.core.mapping.Table;

import java.time.LocalDate;

@Table("user_education")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserEducation {

    @PrimaryKey
    private UserEducationKey key;

    @Column("institution")
    private String institution;

    @Column("degree")
    private String degree;

    @Column("field")
    private String field;

    @Column("start_date")
    private LocalDate startDate;

    @Column("end_date")
    private LocalDate endDate;
}
