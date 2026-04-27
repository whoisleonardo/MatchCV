package com.matchcv.repository;

import com.matchcv.model.OauthToUid;
import org.springframework.data.cassandra.repository.CassandraRepository;

public interface OauthToUidRepository extends CassandraRepository<OauthToUid, String> {
}
