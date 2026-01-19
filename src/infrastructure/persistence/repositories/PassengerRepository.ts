import { query } from "../database";
import { IPassengerRepository } from "../../../application/passenger/IPassengerRepository";
import { Passenger } from "../../../domain/passenger/Passenger";

function rowToPassenger(row: {
  id: string;
  nome: string;
  cpf: string;
  data_nascimento: Date;
  sexo: string;
  endereco_rua: string;
  endereco_numero: string;
  endereco_bairro: string;
  endereco_cidade: string;
  endereco_cep: string;
  created_at: Date;
  updated_at: Date;
}): Passenger {
  return {
    id: row.id,
    nome: row.nome,
    cpf: row.cpf,
    dataNascimento: toDateString(row.data_nascimento),
    sexo: row.sexo,
    endereco: {
      rua: row.endereco_rua,
      numero: row.endereco_numero,
      bairro: row.endereco_bairro,
      cidade: row.endereco_cidade,
      cep: row.endereco_cep,
    },
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toDateString(d: Date): string {
  const x = d instanceof Date ? d : new Date(d);
  return x.toISOString().slice(0, 10);
}

export class PassengerRepository implements IPassengerRepository {
  async save(passenger: Passenger): Promise<Passenger> {
    const { endereco } = passenger;
    const result = await query(
      `INSERT INTO passengers (nome, cpf, data_nascimento, sexo, endereco_rua, endereco_numero, endereco_bairro, endereco_cidade, endereco_cep)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id, nome, cpf, data_nascimento, sexo, endereco_rua, endereco_numero, endereco_bairro, endereco_cidade, endereco_cep, created_at, updated_at`,
      [
        passenger.nome,
        passenger.cpf.replace(/\D/g, ""),
        passenger.dataNascimento,
        passenger.sexo,
        endereco.rua,
        endereco.numero,
        endereco.bairro,
        endereco.cidade,
        endereco.cep,
      ]
    );
    return rowToPassenger(result.rows[0]);
  }

  async findById(id: string): Promise<Passenger | null> {
    const result = await query(
      `SELECT id, nome, cpf, data_nascimento, sexo, endereco_rua, endereco_numero, endereco_bairro, endereco_cidade, endereco_cep, created_at, updated_at
       FROM passengers WHERE id = $1 AND deleted_at IS NULL`,
      [id]
    );
    return result.rows[0] ? rowToPassenger(result.rows[0]) : null;
  }

  async findAll(): Promise<Passenger[]> {
    const result = await query(
      `SELECT id, nome, cpf, data_nascimento, sexo, endereco_rua, endereco_numero, endereco_bairro, endereco_cidade, endereco_cep, created_at, updated_at
       FROM passengers WHERE deleted_at IS NULL ORDER BY nome`
    );
    return result.rows.map(rowToPassenger);
  }

  async findByCpf(cpf: string, excludeId?: string): Promise<Passenger | null> {
    const digits = cpf.replace(/\D/g, "");
    const q = excludeId
      ? `SELECT id, nome, cpf, data_nascimento, sexo, endereco_rua, endereco_numero, endereco_bairro, endereco_cidade, endereco_cep, created_at, updated_at
         FROM passengers WHERE cpf = $1 AND id != $2 AND deleted_at IS NULL`
      : `SELECT id, nome, cpf, data_nascimento, sexo, endereco_rua, endereco_numero, endereco_bairro, endereco_cidade, endereco_cep, created_at, updated_at
         FROM passengers WHERE cpf = $1 AND deleted_at IS NULL`;
    const params = excludeId ? [digits, excludeId] : [digits];
    const result = await query(q, params);
    return result.rows[0] ? rowToPassenger(result.rows[0]) : null;
  }

  async update(id: string, data: Partial<Passenger>): Promise<Passenger | null> {
    const updates: string[] = [];
    const values: unknown[] = [];
    let i = 1;

    if (data.nome !== undefined) {
      updates.push(`nome = $${i++}`);
      values.push(data.nome);
    }
    if (data.cpf !== undefined) {
      updates.push(`cpf = $${i++}`);
      values.push(data.cpf.replace(/\D/g, ""));
    }
    if (data.dataNascimento !== undefined) {
      updates.push(`data_nascimento = $${i++}`);
      values.push(data.dataNascimento);
    }
    if (data.sexo !== undefined) {
      updates.push(`sexo = $${i++}`);
      values.push(data.sexo);
    }
    if (data.endereco !== undefined) {
      updates.push(`endereco_rua = $${i++}`, `endereco_numero = $${i++}`, `endereco_bairro = $${i++}`, `endereco_cidade = $${i++}`, `endereco_cep = $${i++}`);
      values.push(data.endereco.rua, data.endereco.numero, data.endereco.bairro, data.endereco.cidade, data.endereco.cep);
    }

    if (updates.length === 0) return this.findById(id);

    updates.push(`updated_at = current_timestamp`);
    values.push(id);

    const result = await query(
      `UPDATE passengers SET ${updates.join(", ")} WHERE id = $${i} AND deleted_at IS NULL RETURNING id, nome, cpf, data_nascimento, sexo, endereco_rua, endereco_numero, endereco_bairro, endereco_cidade, endereco_cep, created_at, updated_at`,
      values
    );
    return result.rows[0] ? rowToPassenger(result.rows[0]) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await query(
      `UPDATE passengers SET deleted_at = current_timestamp, updated_at = current_timestamp WHERE id = $1 AND deleted_at IS NULL`,
      [id]
    );
    return (result.rowCount ?? 0) > 0;
  }
}
