EXTENSION = pg_fast_json_patch
DATA = pg_fast_json_patch--1.0.sql

PG_CONFIG = pg_config
PGXS := $(shell $(PG_CONFIG) --pgxs)
include $(PGXS)
