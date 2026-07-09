#!/bin/sh

set -e

echo "Waiting for PostgreSQL to be ready..."
RETRIES=30
until node -e "
const { Client } = require('pg');
const client = new Client({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});
client.connect().then(() => { client.end(); process.exit(0); }).catch(() => process.exit(1));
" 2>/dev/null; do
  RETRIES=$((RETRIES - 1))
  if [ "$RETRIES" -le 0 ]; then
    echo "PostgreSQL not reachable after multiple retries. Exiting."
    exit 1
  fi
  echo "PostgreSQL not ready, retrying in 2s... ($RETRIES retries left)"
  sleep 2
done

echo "PostgreSQL is ready! Running migrations..."
node ./node_modules/typeorm/cli.js migration:run -d dist/data-source.js

echo "Migrations complete. Starting application..."
exec node dist/main