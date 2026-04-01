/**
 * Haversine distance between two WGS84 points in kilometers.
 */
export function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

/**
 * Other stores within radiusKm of origin, sorted by nearest first.
 * Pass the full catalog (not map-filtered list) so every client/brand in range is included.
 */
export function findNearbyStores(origin, allStores, radiusKm) {
  return allStores
    .filter((s) => s.id !== origin.id)
    .map((s) => ({
      ...s,
      distanceKm: haversineKm(origin.lat, origin.lng, s.lat, s.lng),
    }))
    .filter((s) => s.distanceKm <= radiusKm)
    .sort((a, b) => a.distanceKm - b.distanceKm)
}
