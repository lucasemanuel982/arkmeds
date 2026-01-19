import "dotenv/config";
import { Worker } from "bullmq";
import { Race } from "./domain/race/Race";
import { GenerateReceipt } from "./application/race/use-cases/GenerateReceipt";
import { PostgresReceiptWriter } from "./infrastructure/race/PostgresReceiptWriter";
import { RACE_ACCEPTED_QUEUE_NAME } from "./infrastructure/queue/constants";
import { redisUrlToConnection } from "./infrastructure/queue/redisConnection";
import type { RaceAcceptedJobData } from "./infrastructure/race/BullMQRaceAcceptedNotifier";
import { env } from "./infrastructure/config/env";
import { logger } from "./shared/logger";

function jobDataToRace(d: RaceAcceptedJobData): Race {
  return {
    ...d,
    acceptedAt: new Date(d.acceptedAt),
  };
}

async function main(): Promise<void> {
  const redisUrl = env.redis.url ?? process.env.REDIS_URL ?? "redis://localhost:6379";
  const connection = redisUrlToConnection(redisUrl);

  const receiptWriter = new PostgresReceiptWriter();
  const generateReceipt = new GenerateReceipt(receiptWriter);

  const worker = new Worker(
    RACE_ACCEPTED_QUEUE_NAME,
    async (job) => {
      const race = jobDataToRace(job.data as RaceAcceptedJobData);
      await generateReceipt.execute(race);
    },
    {
      connection,
      concurrency: 5,
    }
  );

  worker.on("completed", (job) => {
    logger.info({ raceId: job.data.id ?? job.data.requestId }, "Recibo gerado");
  });

  worker.on("failed", (job, err) => {
    logger.error({ jobId: job?.id, err }, "Falha ao gerar recibo");
  });

  const shutdown = async (): Promise<void> => {
    await worker.close();
    process.exit(0);
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);

  logger.info("Worker de recibo iniciado. Aguardando jobs...");
}

main().catch((err) => {
  logger.error({ err }, "Erro ao iniciar worker");
  process.exit(1);
});
