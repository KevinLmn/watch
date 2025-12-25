#!/bin/sh
set -e

echo "Running database migrations..."
npx prisma migrate deploy

echo "Running database seed..."
node prisma/seed.js

echo "Starting application..."
exec node server.js
