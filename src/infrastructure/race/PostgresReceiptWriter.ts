import { IReceiptFileWriter } from "../../application/race/IReceiptFileWriter";
import { query } from "../persistence/database";

export class PostgresReceiptWriter implements IReceiptFileWriter {
  async write(userId: string, dateYyyyMmDd: string, content: string): Promise<void> {
    let raceId: string | undefined;
    try {
      const obj = JSON.parse(content) as { id?: string };
      raceId = obj?.id;
    } catch {
      throw new Error("PostgresReceiptWriter: content must be valid JSON with an 'id' field");
    }
    if (!raceId || typeof raceId !== "string") {
      throw new Error("PostgresReceiptWriter: content must contain a string 'id' (race id)");
    }

    await query(
      `INSERT INTO receipts (race_id, passenger_id, date_yyyy_mm_dd, content)
       VALUES ($1, $2, $3, $4)`,
      [raceId, userId, dateYyyyMmDd, content]
    );
  }
}
