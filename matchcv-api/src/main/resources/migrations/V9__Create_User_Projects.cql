USE matchcv_ks;

CREATE TABLE IF NOT EXISTS user_projects (
    user_id     UUID,
    project_id  TIMEUUID,
    name        TEXT,
    role        TEXT,
    description TEXT,
    url         TEXT,
    date        DATE,
    PRIMARY KEY (user_id, project_id)
) WITH CLUSTERING ORDER BY (project_id DESC);
