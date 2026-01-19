import { query } from "../database";
import { IRaceRepository } from "../../../application/race/IRaceRepository";
import { Race } from "../../../domain/race/Race";

export type RaceRow = {
  id: string;
  passenger_id: string;
  request_id: string;
  from_lat: string | number;
  from_lng: string | number;
  to_lat: string | number;
  to_lng: string | number;
  price: string | number;
  distance_km: string | number;
  accepted_at: Date | string;
};

function rowToRace(row: RaceRow): Race {
  return {
    id: row.id,
    passengerId: row.passenger_id,
    requestId: row.request_id,
    from: { lat: Number(row.from_lat), lng: Number(row.from_lng) },
    to: { lat: Number(row.to_lat), lng: Number(row.to_lng) },
    price: Number(row.price),
    distanceKm: Number(row.distance_km),
    acceptedAt: row.accepted_at instanceof Date ? row.accepted_at : new Date(row.accepted_at),
  };
}

export class RaceRepository implements IRaceRepository {
  async save(race: Race): Promise<Race> {
    const acceptedAt = race.acceptedAt instanceof Date ? race.acceptedAt : new Date(race.acceptedAt);
    const result = await query(
      `INSERT INTO races (passenger_id, request_id, from_lat, from_lng, to_lat, to_lng, price, distance_km, accepted_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id, passenger_id, request_id, from_lat, from_lng, to_lat, to_lng, price, distance_km, accepted_at`,
      [
        race.passengerId,
        race.requestId,
        race.from.lat,
        race.from.lng,
        race.to.lat,
        race.to.lng,
        race.price,
        race.distanceKm,
        acceptedAt,
      ]
    );
    return rowToRace(result.rows[0]);
  }

  async findById(id: string): Promise<Race | null> {
    const result = await query(
      `SELECT id, passenger_id, request_id, from_lat, from_lng, to_lat, to_lng, price, distance_km, accepted_at
       FROM races WHERE id = $1`,
      [id]
    );
    return result.rows[0] ? rowToRace(result.rows[0]) : null;
  }
}
