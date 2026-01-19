/**
 * PM2 — múltiplos cores: cluster (app) e várias instâncias (worker).
 *
 * Uso:
 *   App:   pm2-runtime start ecosystem.config.cjs --only app
 *   Worker: pm2-runtime start ecosystem.config.cjs --only worker
 *
 * Env: PM2_APP_INSTANCES ("max" ou número), PM2_WORKER_INSTANCES (número).
 */

module.exports = {
  apps: [
    {
      name: "app",
      script: "dist/server.js",
      instances: process.env.PM2_APP_INSTANCES || "max", // 1 por CPU, ou número fixo
      exec_mode: "cluster",
      env: { NODE_ENV: "production" },
      // Migrations devem rodar antes (ex.: no entrypoint) — o PM2 só inicia o server
    },
    {
      name: "worker",
      script: "dist/receipt-worker.js",
      instances: parseInt(process.env.PM2_WORKER_INSTANCES || "2", 10), // 2+ = mais consumers BullMQ
      exec_mode: "fork",
      env: { NODE_ENV: "production" },
    },
  ],
};
