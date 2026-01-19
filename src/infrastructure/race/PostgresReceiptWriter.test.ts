import { PostgresReceiptWriter } from "./PostgresReceiptWriter";
import { query } from "../persistence/database";

jest.mock("../persistence/database", () => ({
  query: jest.fn().mockResolvedValue({ rows: [] }),
}));

const mockQuery = query as jest.MockedFunction<typeof query>;

describe("PostgresReceiptWriter", () => {
  let writer: PostgresReceiptWriter;

  beforeEach(() => {
    jest.clearAllMocks();
    writer = new PostgresReceiptWriter();
  });

  it("insere recibo na tabela receipts com race_id extraído do JSON", async () => {
    const content = JSON.stringify({
      id: "race-uuid-1",
      requestId: "req-1",
      passengerId: "user-123",
      from: { lat: -23.55, lng: -46.63 },
      to: { lat: -22.9, lng: -47.06 },
      price: 250.5,
      distanceKm: 100.234,
      acceptedAt: "2025-01-15T11:00:00.000Z",
    });

    await writer.write("user-123", "2025-01-15", content);

    expect(mockQuery).toHaveBeenCalledTimes(1);
    expect(mockQuery).toHaveBeenCalledWith(
      `INSERT INTO receipts (race_id, passenger_id, date_yyyy_mm_dd, content)
       VALUES ($1, $2, $3, $4)`,
      ["race-uuid-1", "user-123", "2025-01-15", content]
    );
  });

  it("lança se content não for JSON válido", async () => {
    await expect(writer.write("user-1", "2025-01-15", "não é json")).rejects.toThrow(
      "PostgresReceiptWriter: content must be valid JSON with an 'id' field"
    );
    expect(mockQuery).not.toHaveBeenCalled();
  });

  it("lança se content não tiver campo id", async () => {
    await expect(writer.write("user-1", "2025-01-15", '{"price": 100}')).rejects.toThrow(
      "PostgresReceiptWriter: content must contain a string 'id' (race id)"
    );
    expect(mockQuery).not.toHaveBeenCalled();
  });

  it("lança se id for vazio ou não for string", async () => {
    await expect(writer.write("user-1", "2025-01-15", '{"id": ""}')).rejects.toThrow(
      "PostgresReceiptWriter: content must contain a string 'id' (race id)"
    );
    await expect(writer.write("user-1", "2025-01-15", '{"id": 123}')).rejects.toThrow(
      "PostgresReceiptWriter: content must contain a string 'id' (race id)"
    );
    expect(mockQuery).not.toHaveBeenCalled();
  });
});
