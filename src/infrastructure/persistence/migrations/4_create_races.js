/**
 * Migration: create_races
 * Tabela de corridas aceitas: id, passenger_id, request_id, from_lat, from_lng, to_lat, to_lng,
 * price, distance_km, accepted_at.
 */

exports.up = (pgm) => {
  pgm.createTable("races", {
    id: { type: "uuid", primaryKey: true, default: pgm.func("gen_random_uuid()") },
    passenger_id: { type: "uuid", notNull: true, references: "passengers(id)" },
    request_id: { type: "varchar(255)", notNull: true },
    from_lat: { type: "decimal(14,10)", notNull: true },
    from_lng: { type: "decimal(14,10)", notNull: true },
    to_lat: { type: "decimal(14,10)", notNull: true },
    to_lng: { type: "decimal(14,10)", notNull: true },
    price: { type: "decimal(10,2)", notNull: true },
    distance_km: { type: "decimal(12,6)", notNull: true },
    accepted_at: { type: "timestamptz", notNull: true },
  });
  pgm.createIndex("races", "passenger_id", { name: "races_passenger_id_idx" });
  pgm.createIndex("races", "accepted_at", { name: "races_accepted_at_idx" });
};

exports.down = (pgm) => {
  pgm.dropTable("races");
};
