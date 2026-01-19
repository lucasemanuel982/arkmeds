const { Client } = require("pg");

const url =
  process.env.DATABASE_URL ||
  `postgresql://${process.env.DB_USER || "postgres"}:${process.env.DB_PASSWORD || "postgres"}@${process.env.DB_HOST || "localhost"}:${process.env.DB_PORT || "5432"}/${process.env.DB_NAME || "arkmeds"}`;

async function run() {
  for (let i = 0; i < 30; i++) {
    try {
      const c = new Client({ connectionString: url });
      await c.connect();
      await c.end();
      console.log("PostgreSQL pronto.");
      process.exit(0);
    } catch {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
  console.error("Timeout aguardando PostgreSQL.");
  process.exit(1);
}

run();
