import { haversineDistanceKm } from "./distance";

describe("haversineDistanceKm", () => {
  it("distância 0 entre o mesmo ponto", () => {
    expect(haversineDistanceKm({ lat: -23.5, lng: -46.6 }, { lat: -23.5, lng: -46.6 })).toBe(0);
  });

  it("calcula distância aproximada São Paulo–Campinas", () => {
    const d = haversineDistanceKm(
      { lat: -23.5505, lng: -46.6333 },
      { lat: -22.9099, lng: -47.0626 }
    );
    expect(d).toBeGreaterThan(80);
    expect(d).toBeLessThan(120);
  });

  it("distância simétrica", () => {
    const from = { lat: 10, lng: 20 };
    const to = { lat: -5, lng: 15 };
    expect(haversineDistanceKm(from, to)).toBe(haversineDistanceKm(to, from));
  });

  it("1 grau de latitude ≈ 111 km (aproximado)", () => {
    const d = haversineDistanceKm({ lat: 0, lng: 0 }, { lat: 1, lng: 0 });
    expect(d).toBeGreaterThan(100);
    expect(d).toBeLessThan(120);
  });
});
