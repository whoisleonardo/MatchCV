-- Maps "provider:provider_user_id" -> user_id for OAuth logins
CREATE TABLE IF NOT EXISTS matchcv_ks.oauth_to_uid (
    oauthkey text PRIMARY KEY,
    user_id  uuid
);

ALTER TABLE matchcv_ks.user_profiles ADD oauth_provider text;
ALTER TABLE matchcv_ks.user_profiles ADD oauth_sub      text;
