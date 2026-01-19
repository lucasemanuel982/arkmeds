/**
 * Distância em km entre dois pontos (Haversine).
 * Entrada em graus (lat, lng).
 */
export function haversineDistanceKm(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number }
): number {
  const R = 6371; // raio da Terra em km
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(to.lat - from.lat);
  const dLng = toRad(to.lng - from.lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(from.lat)) * Math.cos(toRad(to.lat)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
