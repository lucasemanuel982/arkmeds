import request from "supertest";
import { createApp } from "../app";

const body = {
  nome: "Passenger Teste",
  cpf: "111.444.777-35",
  dataNascimento: "1992-08-20",
  sexo: "F",
  endereco: { rua: "Rua X", numero: "10", bairro: "Bairro Y", cidade: "Cidade Z", cep: "01234-567" },
};

describe("Passenger API", () => {
  const app = createApp();
  let createdId: string;

  afterAll(async () => {
    if (createdId) await request(app).delete(`/passenger/${createdId}`);
  });

  describe("POST /passenger", () => {
    it("deve criar passenger e retornar 201", async () => {
      const res = await request(app).post("/passenger").send(body).expect(201);
      expect(res.body).toMatchObject({ nome: body.nome, cpf: "11144477735", sexo: body.sexo });
      expect(res.body.id).toBeDefined();
      expect(res.body.endereco).toEqual(body.endereco);
      createdId = res.body.id;
    });

    it("deve retornar 400 para CPF inválido (111.444.777-05)", async () => {
      const res = await request(app).post("/passenger").send({ ...body, cpf: "111.444.777-05" }).expect(400);
      expect(res.body.error).toMatch(/CPF|inválido/i);
    });

    it("deve retornar 400 para data de nascimento inválida", async () => {
      const res = await request(app).post("/passenger").send({ ...body, dataNascimento: "2030-01-01" }).expect(400);
      expect(res.body.error).toMatch(/data|nascimento|inválida/i);
    });

    it("deve retornar 409 para CPF duplicado", async () => {
      const res = await request(app).post("/passenger").send(body).expect(409);
      expect(res.body.error).toMatch(/CPF|já|cadastrado/i);
    });
  });

  describe("GET /passenger", () => {
    it("deve listar passengers e retornar 200", async () => {
      const res = await request(app).get("/passenger").expect(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe("GET /passenger/:id", () => {
    it("deve retornar 200 e o passenger quando id existe", async () => {
      const res = await request(app).get(`/passenger/${createdId}`).expect(200);
      expect(res.body.id).toBe(createdId);
      expect(res.body.nome).toBe(body.nome);
    });

    it("deve retornar 404 para id inexistente", async () => {
      await request(app).get("/passenger/00000000-0000-0000-0000-000000000000").expect(404);
    });
  });

  describe("PUT /passenger/:id", () => {
    it("deve atualizar e retornar 200", async () => {
      const res = await request(app)
        .put(`/passenger/${createdId}`)
        .send({ nome: "Passenger Atualizado" })
        .expect(200);
      expect(res.body.nome).toBe("Passenger Atualizado");
    });

    it("deve retornar 404 para id inexistente", async () => {
      await request(app)
        .put("/passenger/00000000-0000-0000-0000-000000000000")
        .send({ nome: "X" })
        .expect(404);
    });
  });

  describe("DELETE /passenger/:id", () => {
    it("deve remover e retornar 204", async () => {
      await request(app).delete(`/passenger/${createdId}`).expect(204);
      await request(app).get(`/passenger/${createdId}`).expect(404);
    });

    it("deve retornar 404 para id inexistente", async () => {
      await request(app).delete("/passenger/00000000-0000-0000-0000-000000000000").expect(404);
    });
  });
});
