package com.matchcv.model;

import org.springframework.data.cassandra.core.mapping.Column;
import org.springframework.data.cassandra.core.mapping.PrimaryKey;
import org.springframework.data.cassandra.core.mapping.Table;

import java.time.Instant;

@Table("processed_webhooks")
public class ProcessedWebhook {

    @PrimaryKey
    @Column("event_id")
    private String eventId;

    @Column("processed_at")
    private Instant processedAt;

    public ProcessedWebhook() {}

    public ProcessedWebhook(String eventId, Instant processedAt) {
        this.eventId = eventId;
        this.processedAt = processedAt;
    }

    public String getEventId()       { return eventId; }
    public Instant getProcessedAt()  { return processedAt; }
}
