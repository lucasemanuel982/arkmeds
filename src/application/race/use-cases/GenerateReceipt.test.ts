import { GenerateReceipt } from "./GenerateReceipt";
import { IReceiptFileWriter } from "../IReceiptFileWriter";
import { Race } from "../../../domain/race/Race";

const race: Race = {
  id: "race-1",
  passengerId: "user-123",
  requestId: "req-456",
  from: { lat: -23.55, lng: -46.63 },
  to: { lat: -22.9, lng: -47.06 },
  price: 250.5,
  distanceKm: 100.234,
  acceptedAt: new Date("2025-01-15T11:00:00.000Z"),
};

function makeFileWriter(overrides: Partial<IReceiptFileWriter> = {}): IReceiptFileWriter {
  return {
    write: jest.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

describe("GenerateReceipt", () => {
  it("grava JSON com valor, data, quilometragem, requestId, from, to no caminho userId/yyyy-mm-dd.txt", async () => {
    const fileWriter = makeFileWriter();
    const uc = new GenerateReceipt(fileWriter);

    await uc.execute(race);

    expect(fileWriter.write).toHaveBeenCalledTimes(1);
    const [userId, date, content] = (fileWriter.write as jest.Mock).mock.calls[0];
    expect(userId).toBe("user-123");
    expect(date).toBe("2025-01-15");

    const json = JSON.parse(content);
    expect(json.requestId).toBe("req-456");
    expect(json.from).toEqual({ lat: -23.55, lng: -46.63 });
    expect(json.to).toEqual({ lat: -22.9, lng: -47.06 });
    expect(json.price).toBe(250.5);
    expect(json.distanceKm).toBe(100.234);
    expect(json.passengerId).toBe("user-123");
    expect(json.acceptedAt).toBeDefined();
    expect(json.id).toBe("race-1");
  });

  it("formata acceptedAt como ISO no JSON", async () => {
    const fileWriter = makeFileWriter();
    const uc = new GenerateReceipt(fileWriter);

    await uc.execute(race);

    const [, , content] = (fileWriter.write as jest.Mock).mock.calls[0];
    const json = JSON.parse(content);
    expect(json.acceptedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/);
  });
});
