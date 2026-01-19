import { AcceptRace } from "./AcceptRace";
import { PassengerNotFoundError } from "../../../shared/errors/AppError";
import { IRaceRepository } from "../IRaceRepository";
import { IRaceAcceptedNotifier } from "../IRaceAcceptedNotifier";
import { IPassengerRepository } from "../../passenger/IPassengerRepository";
import { Race } from "../../../domain/race/Race";

const input = {
  userId: "user-1",
  requestId: "req-1",
  from: { lat: -23.55, lng: -46.63 },
  to: { lat: -22.9, lng: -47.06 },
  price: 250.5,
  distanceKm: 100.2,
  datetime: "2025-01-15T08:00:00-03:00",
};

const savedRace: Race = {
  id: "race-1",
  passengerId: input.userId,
  requestId: input.requestId,
  from: input.from,
  to: input.to,
  price: input.price,
  distanceKm: input.distanceKm,
  acceptedAt: new Date("2025-01-15T11:00:00.000Z"),
};

function makeRaceRepo(overrides: Partial<IRaceRepository> = {}): IRaceRepository {
  return {
    save: jest.fn().mockResolvedValue(savedRace),
    findById: jest.fn().mockResolvedValue(null),
    ...overrides,
  };
}

function makeNotifier(overrides: Partial<IRaceAcceptedNotifier> = {}): IRaceAcceptedNotifier {
  return {
    publish: jest.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

function makePassengerRepo(overrides: Partial<IPassengerRepository> = {}): IPassengerRepository {
  return {
    findById: jest.fn().mockResolvedValue({ id: "user-1", nome: "Maria" }),
    save: jest.fn(),
    findAll: jest.fn(),
    findByCpf: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    ...overrides,
  };
}

describe("AcceptRace", () => {
  it("persiste Race e chama notifier.publish com a corrida salva", async () => {
    const raceRepo = makeRaceRepo();
    const notifier = makeNotifier();
    const passengerRepo = makePassengerRepo();

    const uc = new AcceptRace(raceRepo, passengerRepo, notifier);
    const out = await uc.execute(input);

    expect(passengerRepo.findById).toHaveBeenCalledWith(input.userId);
    expect(raceRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({
        passengerId: input.userId,
        requestId: input.requestId,
        from: input.from,
        to: input.to,
        price: input.price,
        distanceKm: input.distanceKm,
      })
    );
    expect(notifier.publish).toHaveBeenCalledWith(out);
    expect(out.id).toBe("race-1");
  });

  it("lança PassengerNotFoundError quando userId (passenger) não existe", async () => {
    const passengerRepo = makePassengerRepo({ findById: jest.fn().mockResolvedValue(null) });
    const raceRepo = makeRaceRepo();
    const notifier = makeNotifier();

    const uc = new AcceptRace(raceRepo, passengerRepo, notifier);

    await expect(uc.execute(input)).rejects.toThrow(PassengerNotFoundError);
    expect(raceRepo.save).not.toHaveBeenCalled();
    expect(notifier.publish).not.toHaveBeenCalled();
  });

  it("retorna imediatamente sem aguardar a geração do recibo (publish não bloqueia)", async () => {
    const notifier = makeNotifier({
      publish: jest.fn().mockReturnValue(new Promise(() => {})),
    });
    const raceRepo = makeRaceRepo();
    const passengerRepo = makePassengerRepo();

    const uc = new AcceptRace(raceRepo, passengerRepo, notifier);
    const out = await uc.execute(input);

    expect(out.id).toBeDefined();
    expect(notifier.publish).toHaveBeenCalled();
  });
});
