#!/usr/bin/env sh
set -e

# Apply any pending migrations
npx prisma migrate deploy --schema=./prisma/schema.prisma

# Launch the app
exec npm start
