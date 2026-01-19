/**
 * Migration: create_receipts
 * Tabela de recibos: id, race_id (FK races), passenger_id, date_yyyy_mm_dd, content.
 * Um recibo por corrida; content armazena o JSON do recibo.
 */

exports.up = (pgm) => {
  pgm.createTable("receipts", {
    id: { type: "uuid", primaryKey: true, default: pgm.func("gen_random_uuid()") },
    race_id: {
      type: "uuid",
      notNull: true,
      unique: true,
      references: "races(id)",
      onDelete: "CASCADE",
    },
    passenger_id: { type: "uuid", notNull: true, references: "passengers(id)" },
    date_yyyy_mm_dd: { type: "varchar(10)", notNull: true },
    content: { type: "text", notNull: true },
    created_at: { type: "timestamptz", notNull: true, default: pgm.func("current_timestamp") },
  });
  pgm.createIndex("receipts", "passenger_id", { name: "receipts_passenger_id_idx" });
  pgm.createIndex("receipts", "date_yyyy_mm_dd", { name: "receipts_date_yyyy_mm_dd_idx" });
};

exports.down = (pgm) => {
  pgm.dropTable("receipts");
};
