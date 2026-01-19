import { Queue } from "bullmq";
import { IRaceAcceptedNotifier } from "../../application/race/IRaceAcceptedNotifier";
import { Race } from "../../domain/race/Race";
import { RACE_ACCEPTED_QUEUE_NAME } from "../queue/constants";
import { redisUrlToConnection } from "../queue/redisConnection";

/** Payload serializável para a fila (acceptedAt como ISO string). */
export interface RaceAcceptedJobData {
  id?: string;
  passengerId: string;
  requestId: string;
  from: { lat: number; lng: number };
  to: { lat: number; lng: number };
  price: number;
  distanceKm: number;
  acceptedAt: string;
}

function toJobData(race: Race): RaceAcceptedJobData {
  return {
    ...race,
    acceptedAt: race.acceptedAt instanceof Date ? race.acceptedAt.toISOString() : String(race.acceptedAt),
  };
}

export class BullMQRaceAcceptedNotifier implements IRaceAcceptedNotifier {
  private readonly queue: Queue;

  constructor(redisUrl: string) {
    this.queue = new Queue(RACE_ACCEPTED_QUEUE_NAME, { connection: redisUrlToConnection(redisUrl) });
  }

  async publish(race: Race): Promise<void> {
    await this.queue.add("generate-receipt", toJobData(race), {
      attempts: 3,
      backoff: { type: "exponential", delay: 1000 },
      removeOnComplete: { age: 3600, count: 1000 },
    });
  }
}
