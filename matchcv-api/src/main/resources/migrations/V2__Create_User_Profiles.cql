USE matchcv_ks;

CREATE TABLE IF NOT EXISTS user_profiles (
                                             id          UUID PRIMARY KEY,
                                             full_name   TEXT,
                                             username    TEXT,
                                             location    TEXT,
                                             linkedin    TEXT,
                                             summary     TEXT,
                                             skills      LIST<TEXT>,
                                             created_at  TIMESTAMP,
                                             updated_at  TIMESTAMP
);