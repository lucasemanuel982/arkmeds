#!/bin/sh
set -e

echo "Aguardando PostgreSQL..."
node scripts/wait-for-db.cjs

echo "Aguardando Redis..."
node scripts/wait-for-redis.cjs

echo "Iniciando worker de recibo (PM2, múltiplas instâncias)..."
exec npx pm2-runtime start ecosystem.config.cjs --only worker
