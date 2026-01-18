import "dotenv/config";

export const env = {
  port: Number(process.env.PORT) || 3000,
  database: {
    url:
      process.env.DATABASE_URL ??
      `postgresql://${process.env.DB_USER ?? "postgres"}:${process.env.DB_PASSWORD ?? "postgres"}@${process.env.DB_HOST ?? "localhost"}:${process.env.DB_PORT ?? "5432"}/${process.env.DB_NAME ?? "arkmeds"}`,
  },
};
