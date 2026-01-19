/**
 * Testes de integração da API /race.
 * Requer: PostgreSQL rodando, DATABASE_URL (ou DB_*) configurado, migrations aplicadas (npm run migrate:up).
 * Rodar com: npm run test:all
 */
import request from "supertest";
import fs from "fs/promises";
import path from "path";
import os from "os";
import { createApp } from "../app";

const receiptBase = process.env.RECEIPT_BASE_PATH ?? os.tmpdir();

const passengerBody = {
  nome: "Passageiro Race",
  cpf: "111.444.777-35",
  dataNascimento: "1992-08-20",
  sexo: "F",
  endereco: { rua: "Rua A", numero: "1", bairro: "B", cidade: "C", cep: "01234-567" },
};

async function waitForFile(filePath: string, maxMs = 3000): Promise<boolean> {
  const step = 80;
  for (let elapsed = 0; elapsed < maxMs; elapsed += step) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      await new Promise((r) => setTimeout(r, step));
    }
  }
  return false;
}

describe("Race API", () => {
  const app = createApp();
  let passengerId: string;

  beforeAll(async () => {
    let res = await request(app).post("/passenger").send(passengerBody);
    if (res.status === 409) {
      const list = await request(app).get("/passenger");
      const p = list.body.find((x: { cpf?: string }) => (x.cpf || "").replace(/\D/g, "") === "11144477735");
      if (p?.id) passengerId = p.id;
    } else if (res.body?.id) {
      passengerId = res.body.id;
    }
  });

  afterAll(async () => {
    if (passengerId) await request(app).delete(`/passenger/${passengerId}`);
  });

  describe("POST /race", () => {
    it("retorna 202 Accepted com payload de confirmação sem aguardar o recibo", async () => {
      const raceBody = {
        userId: passengerId,
        requestId: "req-integration-1",
        from: { lat: -23.55, lng: -46.63 },
        to: { lat: -22.9, lng: -47.06 },
        price: 250.5,
        distanceKm: 100.2,
        datetime: "2025-01-20T10:00:00-03:00",
      };

      const res = await request(app).post("/race").send(raceBody).expect(202);

      expect(res.body).toMatchObject({
        passengerId: passengerId,
        requestId: "req-integration-1",
        status: "accepted",
      });
      expect(res.body.id).toBeDefined();
    });

    it("gera recibo em {basePath}/{userId}/{yyyy-mm-dd}.txt com JSON válido (polling)", async () => {
      const date = "2025-01-21";
      const raceBody = {
        userId: passengerId,
        requestId: "req-receipt-1",
        from: { lat: -23.55, lng: -46.63 },
        to: { lat: -22.9, lng: -47.06 },
        price: 100,
        distanceKm: 50,
        datetime: `${date}T14:00:00-03:00`,
      };

      const res = await request(app).post("/race").send(raceBody).expect(202);
      const filePath = path.join(receiptBase, passengerId, `${date}.txt`);

      const exists = await waitForFile(filePath);
      expect(exists).toBe(true);

      const content = await fs.readFile(filePath, "utf-8");
      const json = JSON.parse(content);
      expect(json.requestId).toBe("req-receipt-1");
      expect(json.passengerId).toBe(passengerId);
      expect(json.price).toBe(100);
      expect(json.distanceKm).toBe(50);
      expect(json.from).toEqual({ lat: -23.55, lng: -46.63 });
      expect(json.to).toEqual({ lat: -22.9, lng: -47.06 });
      expect(json.acceptedAt).toBeDefined();
    }, 10000);

    it("retorna 400 quando userId está vazio", async () => {
      await request(app)
        .post("/race")
        .send({
          userId: "",
          requestId: "x",
          from: { lat: 0, lng: 0 },
          to: { lat: 1, lng: 1 },
          price: 10,
          distanceKm: 5,
          datetime: "2025-01-15T08:00:00-03:00",
        })
        .expect(400);
    });

    it("retorna 404 quando userId (passageiro) não existe", async () => {
      await request(app)
        .post("/race")
        .send({
          userId: "00000000-0000-0000-0000-000000000000",
          requestId: "x",
          from: { lat: 0, lng: 0 },
          to: { lat: 1, lng: 1 },
          price: 10,
          distanceKm: 5,
          datetime: "2025-01-15T08:00:00-03:00",
        })
        .expect(404);
    });
  });
});
