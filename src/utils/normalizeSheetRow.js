import { resolveCanonicalClient } from '../constants/clients'

/**
 * Normalize one Google Sheet row into a store record.
 * Accepts both the new schema (city, client, store_name, latitude, longitude)
 * and the legacy reference sheet (City, Client, lat, lng, etc.).
 */
export function normalizeRow(row, index) {
  const lat = parseFloat(row.latitude ?? row.lat ?? row.Latitude)
  const lng = parseFloat(row.longitude ?? row.lng ?? row.Longitude)

  if (Number.isNaN(lat) || Number.isNaN(lng)) return null

  const cityRaw = (row.city ?? row.City ?? '').toString().trim()

  const clientRaw = (row.client ?? row.Client ?? '').toString().trim()
  const client = resolveCanonicalClient(clientRaw)
  if (!client) return null

  let storeName = (
    row.store_name ??
    row.storeName ??
    row['store name'] ??
    row.Store ??
    row.Name ??
    ''
  )
    .toString()
    .trim()

  if (!storeName) {
    storeName = [cityRaw, client, 'Hub'].filter(Boolean).join(' ').trim() || `Store ${index + 1}`
  }

  return {
    id: `store-${index}-${lat.toFixed(4)}-${lng.toFixed(4)}`,
    city: cityRaw,
    client,
    store_name: storeName,
    lat,
    lng,
  }
}

export function normalizeSheetRows(rows) {
  if (!Array.isArray(rows)) return []
  return rows.map((row, i) => normalizeRow(row, i)).filter(Boolean)
}
