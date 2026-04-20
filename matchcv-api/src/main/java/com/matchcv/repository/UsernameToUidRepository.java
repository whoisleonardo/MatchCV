package com.matchcv.repository;

import com.matchcv.model.UsernameToUid;
import org.springframework.data.cassandra.repository.CassandraRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsernameToUidRepository extends CassandraRepository<UsernameToUid, String> {
}
