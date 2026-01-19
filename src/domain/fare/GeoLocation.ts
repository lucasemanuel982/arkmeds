import { InvalidCoordinatesError } from "../../shared/errors/AppError";

export interface GeoLocationInput {
  lat: number;
  lng: number;
}

export class GeoLocation {
  readonly lat: number;
  readonly lng: number;

  constructor(input: GeoLocationInput) {
    const { lat, lng } = input;
    if (typeof lat !== "number" || typeof lng !== "number" || Number.isNaN(lat) || Number.isNaN(lng)) {
      throw new InvalidCoordinatesError("Latitude e longitude devem ser números");
    }
    if (lat < -90 || lat > 90) {
      throw new InvalidCoordinatesError("Latitude deve estar entre -90 e 90");
    }
    if (lng < -180 || lng > 180) {
      throw new InvalidCoordinatesError("Longitude deve estar entre -180 e 180");
    }
    this.lat = lat;
    this.lng = lng;
  }

  static fromObject(obj: unknown): GeoLocation {
    if (!obj || typeof obj !== "object" || !("lat" in obj) || !("lng" in obj)) {
      throw new InvalidCoordinatesError("Coordenadas devem ter lat e lng");
    }
    return new GeoLocation({ lat: Number((obj as { lat: unknown }).lat), lng: Number((obj as { lng: unknown }).lng) });
  }
}
