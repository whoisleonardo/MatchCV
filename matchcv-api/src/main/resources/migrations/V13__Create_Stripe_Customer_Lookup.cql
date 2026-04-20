USE matchcv_ks;

CREATE TABLE IF NOT EXISTS stripe_customer_to_uid (
    customer_id TEXT PRIMARY KEY,
    user_id     UUID
);
