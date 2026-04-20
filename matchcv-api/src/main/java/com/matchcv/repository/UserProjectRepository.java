package com.matchcv.repository;

import com.matchcv.model.UserProject;
import com.matchcv.model.UserProjectKey;
import org.springframework.data.cassandra.repository.CassandraRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface UserProjectRepository extends CassandraRepository<UserProject, UserProjectKey> {

    List<UserProject> findByKeyUserId(UUID userId);
}
