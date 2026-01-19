import request from "supertest";
import { createApp } from "../app";

const tz = "-03:00";
const validFrom = { lat: -23.5505, lng: -46.6333 };
const validTo = { lat: -22.9099, lng: -47.0626 };

describe("POST /fare", () => {
  const app = createApp();

  describe("coordenadas válidas", () => {
    it("dia útil 08:00 → strategy day", async () => {
      const res = await request(app)
        .post("/fare")
        .send({ from: validFrom, to: validTo, datetime: `2025-01-15T08:00:00${tz}` })
        .expect(200);
      expect(res.body).toMatchObject({ strategy: "day" });
      expect(typeof res.body.fare).toBe("number");
      expect(typeof res.body.distanceKm).toBe("number");
    });

    it("dia útil 17:00 → strategy day", async () => {
      const res = await request(app)
        .post("/fare")
        .send({ from: validFrom, to: validTo, datetime: `2025-01-15T17:00:00${tz}` })
        .expect(200);
      expect(res.body.strategy).toBe("day");
    });

    it("dia útil 20:00 → strategy day", async () => {
      const res = await request(app)
        .post("/fare")
        .send({ from: validFrom, to: validTo, datetime: `2025-01-15T20:00:00${tz}` })
        .expect(200);
      expect(res.body.strategy).toBe("day");
    });

    it("dia útil 23:00 → strategy night", async () => {
      const res = await request(app)
        .post("/fare")
        .send({ from: validFrom, to: validTo, datetime: `2025-01-15T23:00:00${tz}` })
        .expect(200);
      expect(res.body.strategy).toBe("night");
    });

    it("dia útil 02:00 → strategy night", async () => {
      const res = await request(app)
        .post("/fare")
        .send({ from: validFrom, to: validTo, datetime: `2025-01-16T02:00:00${tz}` })
        .expect(200);
      expect(res.body.strategy).toBe("night");
    });

    it("fim de semana sábado 08:00 → weekend_day", async () => {
      const res = await request(app)
        .post("/fare")
        .send({ from: validFrom, to: validTo, datetime: `2025-01-18T08:00:00${tz}` })
        .expect(200);
      expect(res.body.strategy).toBe("weekend_day");
    });

    it("fim de semana sábado 17:00 → weekend_day", async () => {
      const res = await request(app)
        .post("/fare")
        .send({ from: validFrom, to: validTo, datetime: `2025-01-18T17:00:00${tz}` })
        .expect(200);
      expect(res.body.strategy).toBe("weekend_day");
    });

    it("fim de semana sábado 20:00 → weekend_day", async () => {
      const res = await request(app)
        .post("/fare")
        .send({ from: validFrom, to: validTo, datetime: `2025-01-18T20:00:00${tz}` })
        .expect(200);
      expect(res.body.strategy).toBe("weekend_day");
    });

    it("fim de semana sábado 23:00 → weekend_night", async () => {
      const res = await request(app)
        .post("/fare")
        .send({ from: validFrom, to: validTo, datetime: `2025-01-18T23:00:00${tz}` })
        .expect(200);
      expect(res.body.strategy).toBe("weekend_night");
    });

    it("fim de semana domingo 02:00 → weekend_night", async () => {
      const res = await request(app)
        .post("/fare")
        .send({ from: validFrom, to: validTo, datetime: `2025-01-19T02:00:00${tz}` })
        .expect(200);
      expect(res.body.strategy).toBe("weekend_night");
    });
  });

  describe("coordenadas inválidas", () => {
    it("400 quando from.lat > 90", async () => {
      const res = await request(app)
        .post("/fare")
        .send({ from: { lat: 91, lng: 0 }, to: validTo, datetime: `2025-01-15T08:00:00${tz}` })
        .expect(400);
      expect(res.body.error).toMatch(/coordenada|lat|inválid/i);
    });

    it("400 quando from.lat < -90", async () => {
      const res = await request(app)
        .post("/fare")
        .send({ from: { lat: -91, lng: 0 }, to: validTo, datetime: `2025-01-15T08:00:00${tz}` })
        .expect(400);
      expect(res.body.error).toMatch(/coordenada|lat|inválid/i);
    });

    it("400 quando to.lng > 180", async () => {
      const res = await request(app)
        .post("/fare")
        .send({ from: validFrom, to: { lat: 0, lng: 181 }, datetime: `2025-01-15T08:00:00${tz}` })
        .expect(400);
      expect(res.body.error).toMatch(/coordenada|longitude|lng|inválid|entre/i);
    });

    it("400 quando from não tem lat", async () => {
      const res = await request(app)
        .post("/fare")
        .send({ from: { lng: 0 }, to: validTo, datetime: `2025-01-15T08:00:00${tz}` })
        .expect(400);
      expect(res.body.error).toMatch(/from|lat|lng/i);
    });

    it("400 quando datetime é inválido", async () => {
      const res = await request(app)
        .post("/fare")
        .send({ from: validFrom, to: validTo, datetime: "data-invalida" })
        .expect(400);
      expect(res.body.error).toMatch(/datetime|data|inválid/i);
    });
  });

  describe("validação de body", () => {
    it("400 quando datetime está vazio", async () => {
      await request(app)
        .post("/fare")
        .send({ from: validFrom, to: validTo, datetime: "" })
        .expect(400);
    });

    it("400 quando body está vazio", async () => {
      await request(app).post("/fare").send({}).expect(400);
    });
  });
});
