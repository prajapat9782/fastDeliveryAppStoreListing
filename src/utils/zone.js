/** Dropdown values — must match normalized labels from sheet */
export const ZONE_OPTIONS = ['East', 'West', 'North', 'South']

/** Normalize sheet cell text to one of East/West/North/South, or '' */
export function normalizeZoneLabel(raw) {
  if (raw == null || String(raw).trim() === '') return ''
  const s = String(raw).trim().toLowerCase()
  if (s === 'east' || s === 'e' || /\beast\b/.test(s)) return 'East'
  if (s === 'west' || s === 'w' || /\bwest\b/.test(s)) return 'West'
  if (s === 'north' || s === 'n' || /\bnorth\b/.test(s)) return 'North'
  if (s === 'south' || s === 's' || /\bsouth\b/.test(s)) return 'South'
  return ''
}

/** Read first column whose header contains "zone" (case-insensitive). */
export function extractZoneFromRow(row) {
  if (!row || typeof row !== 'object') return ''
  for (const [k, v] of Object.entries(row)) {
    if (k == null) continue
    if (!String(k).toLowerCase().includes('zone')) continue
    const z = normalizeZoneLabel(v)
    if (z) return z
  }
  return ''
}
