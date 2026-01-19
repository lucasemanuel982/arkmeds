#!/bin/sh
set -e

echo "Aguardando PostgreSQL..."
node scripts/wait-for-db.cjs

echo "Aguardando Redis..."
node scripts/wait-for-redis.cjs

echo "Iniciando worker de recibo..."
exec node dist/receipt-worker.js
