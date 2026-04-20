package com.matchcv.repository;

import com.matchcv.model.UserCertification;
import com.matchcv.model.UserCertificationKey;
import org.springframework.data.cassandra.repository.CassandraRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface UserCertificationRepository extends CassandraRepository<UserCertification, UserCertificationKey> {

    List<UserCertification> findByKeyUserId(UUID userId);
}
