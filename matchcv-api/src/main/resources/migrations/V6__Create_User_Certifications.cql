USE matchcv_ks;

CREATE TABLE IF NOT EXISTS user_certifications (
                                                   user_id     UUID,
                                                   cert_id     TIMEUUID,
                                                   name        TEXT,
                                                   issuer      TEXT,
                                                   issued_date DATE,
                                                   expires_at  DATE,
                                                   url         TEXT,
                                                   PRIMARY KEY (user_id, cert_id)
) WITH CLUSTERING ORDER BY (cert_id DESC);