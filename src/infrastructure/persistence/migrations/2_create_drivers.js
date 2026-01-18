/**
 * Migration: create_drivers
 * Tabela de motoristas: id (UUID), nome, cpf, data_nascimento, sexo,
 * endereço (rua, número, bairro, cidade, cep), created_at, updated_at, deleted_at.
 * Índices: cpf (único, parcial deleted_at IS NULL), created_at, endereco_cidade,
 * composto (endereco_cidade, created_at).
 */

exports.up = (pgm) => {
  pgm.createTable("drivers", {
    id: { type: "uuid", primaryKey: true, default: pgm.func("gen_random_uuid()") },
    nome: { type: "varchar(255)", notNull: true },
    cpf: { type: "varchar(11)", notNull: true },
    data_nascimento: { type: "date", notNull: true },
    sexo: { type: "varchar(20)", notNull: true },
    endereco_rua: { type: "varchar(255)", notNull: true },
    endereco_numero: { type: "varchar(20)", notNull: true },
    endereco_bairro: { type: "varchar(100)", notNull: true },
    endereco_cidade: { type: "varchar(100)", notNull: true },
    endereco_cep: { type: "varchar(10)", notNull: true },
    created_at: { type: "timestamptz", notNull: true, default: pgm.func("current_timestamp") },
    updated_at: { type: "timestamptz", notNull: true, default: pgm.func("current_timestamp") },
    deleted_at: { type: "timestamptz", notNull: false },
  });
  pgm.createIndex("drivers", "cpf", {
    unique: true,
    where: "deleted_at IS NULL",
    name: "drivers_cpf_not_deleted_key",
  });
  pgm.createIndex("drivers", "created_at", { name: "drivers_created_at_idx" });
  pgm.createIndex("drivers", "endereco_cidade", { name: "drivers_endereco_cidade_idx" });
  pgm.createIndex("drivers", ["endereco_cidade", "created_at"], {
    name: "drivers_cidade_created_at_idx",
  });
};

exports.down = (pgm) => {
  pgm.dropTable("drivers");
};
