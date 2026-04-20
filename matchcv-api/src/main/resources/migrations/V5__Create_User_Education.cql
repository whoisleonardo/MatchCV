USE matchcv_ks;

CREATE TABLE IF NOT EXISTS user_education (
                                              user_id     UUID,
                                              edu_id      TIMEUUID,
                                              institution TEXT,
                                              degree      TEXT,
                                              field       TEXT,
                                              start_date  DATE,
                                              end_date    DATE,
                                              PRIMARY KEY (user_id, edu_id)
) WITH CLUSTERING ORDER BY (edu_id DESC);