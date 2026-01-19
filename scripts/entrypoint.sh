#!/bin/sh
set -e

echo "Aguardando PostgreSQL..."
node scripts/wait-for-db.cjs

echo "Executando migrations..."
npm run migrate:up

echo "Iniciando aplicação..."
exec node dist/server.js
