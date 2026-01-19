const Redis = require("ioredis");

const url = process.env.REDIS_URL || "redis://localhost:6379";

async function run() {
  for (let i = 0; i < 30; i++) {
    try {
      const r = new Redis(url);
      await r.ping();
      await r.quit();
      console.log("Redis pronto.");
      process.exit(0);
    } catch {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
  console.error("Timeout aguardando Redis.");
  process.exit(1);
}

run();
