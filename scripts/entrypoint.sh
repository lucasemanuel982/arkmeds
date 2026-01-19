#!/bin/sh
set -e

echo "Aguardando PostgreSQL..."
node scripts/wait-for-db.cjs

echo "Executando migrations..."
npm run migrate:up

echo "Iniciando aplicação (PM2 cluster)..."
exec npx pm2-runtime start ecosystem.config.cjs --only app
