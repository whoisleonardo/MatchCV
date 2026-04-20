package com.matchcv.repository;

import com.matchcv.model.ProcessedWebhook;
import org.springframework.data.cassandra.repository.CassandraRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProcessedWebhookRepository extends CassandraRepository<ProcessedWebhook, String> {
}
