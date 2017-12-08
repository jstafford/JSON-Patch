
CREATE OR REPLACE FUNCTION json_patch( data json, patch json) RETURNS json AS
$$
  return jsonpatch.apply( data, patch );
$$
LANGUAGE plv8;

CREATE OR REPLACE FUNCTION jsonb_patch ( data jsonb, patch json ) RETURNS jsonb AS
'
  SELECT json_patch( $1::json, $2)::jsonb;
'
LANGUAGE sql;
