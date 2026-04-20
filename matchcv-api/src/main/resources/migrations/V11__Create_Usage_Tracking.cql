USE matchcv_ks;

CREATE TABLE IF NOT EXISTS user_monthly_usage (
    user_id    UUID,
    year_month TEXT,
    cv_count   COUNTER,
    PRIMARY KEY (user_id, year_month)
);
