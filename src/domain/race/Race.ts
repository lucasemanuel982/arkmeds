export interface Race {
  id?: string;
  passengerId: string;
  requestId: string;
  from: { lat: number; lng: number };
  to: { lat: number; lng: number };
  price: number;
  distanceKm: number;
  acceptedAt: Date;
}

export interface AcceptRaceInput {
  userId: string;
  requestId: string;
  from: { lat: number; lng: number };
  to: { lat: number; lng: number };
  price: number;
  distanceKm: number;
  datetime: string;
}
