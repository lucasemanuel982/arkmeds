import "dotenv/config";
import os from "os";

export const env = {
  port: Number(process.env.PORT) || 3000,
  database: {
    url:
      process.env.DATABASE_URL ??
      `postgresql://${process.env.DB_USER ?? "postgres"}:${process.env.DB_PASSWORD ?? "postgres"}@${process.env.DB_HOST ?? "localhost"}:${process.env.DB_PORT ?? "5432"}/${process.env.DB_NAME ?? "arkmeds"}`,
  },
  receipt: {
    basePath: process.env.RECEIPT_BASE_PATH ?? os.tmpdir(),
  },
  redis: {
    url: process.env.REDIS_URL ?? null as string | null,
  },
};
