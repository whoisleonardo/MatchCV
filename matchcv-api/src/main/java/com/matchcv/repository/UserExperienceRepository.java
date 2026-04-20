package com.matchcv.repository;

import com.matchcv.model.UserExperience;
import com.matchcv.model.UserExperienceKey;
import org.springframework.data.cassandra.repository.CassandraRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface UserExperienceRepository extends CassandraRepository<UserExperience, UserExperienceKey> {

    List<UserExperience> findByKeyUserId(UUID userId);
}
