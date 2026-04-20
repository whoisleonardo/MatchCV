package com.matchcv.repository;

import com.matchcv.model.StripeCustomerToUid;
import org.springframework.data.cassandra.repository.CassandraRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StripeCustomerToUidRepository extends CassandraRepository<StripeCustomerToUid, String> {
}
