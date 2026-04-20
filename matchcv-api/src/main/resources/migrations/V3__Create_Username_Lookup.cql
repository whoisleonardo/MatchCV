USE matchcv_ks;

CREATE TABLE IF NOT EXISTS username_to_uid (
                                               username    TEXT PRIMARY KEY,
                                               user_id     UUID
);