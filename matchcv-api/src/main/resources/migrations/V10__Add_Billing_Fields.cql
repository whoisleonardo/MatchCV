USE matchcv_ks;

ALTER TABLE user_profiles ADD plan                   TEXT;
ALTER TABLE user_profiles ADD stripe_customer_id     TEXT;
ALTER TABLE user_profiles ADD stripe_subscription_id TEXT;
