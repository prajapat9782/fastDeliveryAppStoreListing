import { CLIENT_OPTIONS } from '../constants/clients'

/** Sum totalRaiderReq for stores in a city; per-client breakdown (canonical clients first, then any others). */
export function computeRiderRequirementStats(storesInCity) {
  const list = Array.isArray(storesInCity) ? storesInCity : []
  let total = 0
  const byClient = new Map()
  for (const s of list) {
    const n = Number(s?.totalRaiderReq ?? 0) || 0
    total += n
    const c = s?.client ?? 'Unknown'
    byClient.set(c, (byClient.get(c) ?? 0) + n)
  }
  const rows = []
  for (const name of CLIENT_OPTIONS) {
    const v = byClient.get(name)
    if (v != null && v > 0) rows.push({ client: name, req: v })
  }
  for (const [name, v] of byClient.entries()) {
    if (!CLIENT_OPTIONS.includes(name) && v > 0) rows.push({ client: name, req: v })
  }
  rows.sort((a, b) => b.req - a.req)
  return { total, byClient: rows }
}
