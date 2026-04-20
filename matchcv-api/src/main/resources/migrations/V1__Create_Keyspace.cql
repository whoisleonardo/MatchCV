CREATE KEYSPACE IF NOT EXISTS matchcv_ks
    WITH replication = {'class': 'NetworkTopologyStrategy', 'datacenter1': 1};