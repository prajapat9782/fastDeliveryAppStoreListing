/** Deterministic fake “orders today” from id so UI looks populated without sheet columns. */
export function ordersTodayFromId(id) {
  let h = 2166136261
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return 600 + (Math.abs(h) % 3400)
}

/** Subline under title — city + generic locality feel */
export function formatAddressLine(store) {
  if (!store) return ''
  const city = store.city || 'India'
  return `${city} · main corridor`
}
