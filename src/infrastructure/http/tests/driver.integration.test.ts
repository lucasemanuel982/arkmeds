/**
 * Testes de integração da API /driver.
 * Requer: PostgreSQL rodando, DATABASE_URL (ou DB_*) configurado, migrations aplicadas (npm run migrate:up).
 * Rodar com: npm run test:all
 */
import request from "supertest";
import { createApp } from "../app";

const body = {
  nome: "Motorista Teste",
  cpf: "111.444.777-35",
  dataNascimento: "1990-05-15",
  sexo: "M",
  endereco: { rua: "Rua X", numero: "10", bairro: "Bairro Y", cidade: "Cidade Z", cep: "01234-567" },
};

describe("Driver API", () => {
  const app = createApp();
  let createdId: string;

  afterAll(async () => {
    if (createdId) await request(app).delete(`/driver/${createdId}`);
  });

  describe("POST /driver", () => {
    it("deve criar motorista e retornar 201", async () => {
      const res = await request(app).post("/driver").send(body).expect(201);
      expect(res.body).toMatchObject({ nome: body.nome, cpf: "11144477735", sexo: body.sexo });
      expect(res.body.id).toBeDefined();
      expect(res.body.endereco).toEqual(body.endereco);
      createdId = res.body.id;
    });

    it("deve retornar 400 para CPF inválido (111.444.777-05)", async () => {
      const res = await request(app).post("/driver").send({ ...body, cpf: "111.444.777-05" }).expect(400);
      expect(res.body.error).toMatch(/CPF|inválido/i);
    });

    it("deve retornar 400 para data de nascimento inválida", async () => {
      const res = await request(app).post("/driver").send({ ...body, dataNascimento: "2030-01-01" }).expect(400);
      expect(res.body.error).toMatch(/data|nascimento|inválida/i);
    });

    it("deve retornar 409 para CPF duplicado", async () => {
      const res = await request(app).post("/driver").send(body).expect(409);
      expect(res.body.error).toMatch(/CPF|já|cadastrado/i);
    });
  });

  describe("GET /driver", () => {
    it("deve listar motoristas e retornar 200", async () => {
      const res = await request(app).get("/driver").expect(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe("GET /driver/:id", () => {
    it("deve retornar 200 e o motorista quando id existe", async () => {
      const res = await request(app).get(`/driver/${createdId}`).expect(200);
      expect(res.body.id).toBe(createdId);
      expect(res.body.nome).toBe(body.nome);
    });

    it("deve retornar 404 para id inexistente", async () => {
      await request(app).get("/driver/00000000-0000-0000-0000-000000000000").expect(404);
    });
  });

  describe("PUT /driver/:id", () => {
    it("deve atualizar e retornar 200", async () => {
      const res = await request(app)
        .put(`/driver/${createdId}`)
        .send({ nome: "Motorista Atualizado" })
        .expect(200);
      expect(res.body.nome).toBe("Motorista Atualizado");
    });

    it("deve retornar 404 para id inexistente", async () => {
      await request(app)
        .put("/driver/00000000-0000-0000-0000-000000000000")
        .send({ nome: "X" })
        .expect(404);
    });
  });

  describe("DELETE /driver/:id", () => {
    it("deve remover e retornar 204", async () => {
      await request(app).delete(`/driver/${createdId}`).expect(204);
      await request(app).get(`/driver/${createdId}`).expect(404);
    });

    it("deve retornar 404 para id inexistente", async () => {
      await request(app).delete("/driver/00000000-0000-0000-0000-000000000000").expect(404);
    });
  });
});
