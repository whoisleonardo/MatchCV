USE matchcv_ks;

CREATE TABLE IF NOT EXISTS processed_webhooks (
    event_id     TEXT PRIMARY KEY,
    processed_at TIMESTAMP
);
