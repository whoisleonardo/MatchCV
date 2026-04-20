package com.matchcv.repository;

import com.matchcv.model.UserEducation;
import com.matchcv.model.UserEducationKey;
import org.springframework.data.cassandra.repository.CassandraRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface UserEducationRepository extends CassandraRepository<UserEducation, UserEducationKey> {

    List<UserEducation> findByKeyUserId(UUID userId);
}
