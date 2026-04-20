USE matchcv_ks;

CREATE TABLE IF NOT EXISTS user_experiences (
                                                user_id     UUID,
                                                exp_id      TIMEUUID,
                                                company     TEXT,
                                                role        TEXT,
                                                description TEXT,
                                                start_date  DATE,
                                                end_date    DATE,
                                                is_current  BOOLEAN,
                                                PRIMARY KEY (user_id, exp_id)
) WITH CLUSTERING ORDER BY (exp_id DESC);