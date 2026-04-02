import { resolveCanonicalClient } from '../constants/clients'
import { extractZoneFromRow } from './zone'

/**
 * Normalize one Google Sheet row into a store record.
 * Accepts both the new schema (city, client, store_name, latitude, longitude)
 * and the legacy reference sheet (City, Client, lat, lng, etc.).
 */
export function normalizeRow(row, index) {
  const { record } = normalizeRowWithIssue(row, index)
  return record
}

export function normalizeRowWithIssue(row, index) {
  const isEmpty = (v) => v == null || String(v).trim() === ''
  const pick = (...vals) => vals.find((v) => !isEmpty(v))

  const latRaw = pick(row?.latitude, row?.lat, row?.Latitude)
  const lngRaw = pick(row?.longitude, row?.lng, row?.Longitude)
  const clientRawCandidate = pick(row?.client, row?.Client)
  const cityRawCandidate = pick(row?.city, row?.City)
  const storeNameCandidate = (
    row?.['Store Name'] ??
    row?.store_name ??
    row?.storeName ??
    row?.['store name'] ??
    row?.Store ??
    row?.Name ??
    ''
  )
    .toString()
    .trim()

  const missingKeys = []
  if (isEmpty(clientRawCandidate)) missingKeys.push('client')
  if (isEmpty(latRaw)) missingKeys.push('latitude')
  if (isEmpty(lngRaw)) missingKeys.push('longitude')
  if (isEmpty(cityRawCandidate)) missingKeys.push('city')
  if (!storeNameCandidate) missingKeys.push('Store Name')

  const lat = parseFloat(latRaw)
  const lng = parseFloat(lngRaw)

  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return {
      record: null,
      issue: {
        row: index + 1,
        store_name: storeNameCandidate || `Row ${index + 1}`,
        reason: 'Missing/invalid latitude or longitude',
        missing_keys: missingKeys,
      },
    }
  }

  const cityRaw = (row.city ?? row.City ?? '').toString().trim()

  const clientRaw = (row.client ?? row.Client ?? '').toString().trim()
  const client = resolveCanonicalClient(clientRaw)
  if (!client) {
    return {
      record: null,
      issue: {
        row: index + 1,
        store_name: storeNameCandidate || `Row ${index + 1}`,
        reason: 'Missing/invalid client',
        missing_keys: missingKeys,
      },
    }
  }

  let storeName = (
    row['Store Name'] ??
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

  // These columns exist in your reference HTML sheet parsing (names include a couple typos).
  const totalRaiderRaw =
    row.TotalRaider ??
    row.totalRaider ??
    row['Tota rider'] ??
    row['Total rider'] ??
    row['total rider'] ??
    row.total_rider

  const totalRaiderReqRaw =
    row.TotalRaiderReq ??
    row.totalRaiderReq ??
    row['Total rider req'] ??
    row['Total rider required'] ??
    row['total rider req'] ??
    row.total_rider_req

  const cpoCountRaw = row.CPO ?? row.cpo ?? 0

  // Additional metrics (new columns)
  const earningPerHourRaw =
    row['Earning/hours'] ??
    row['Earning per hour'] ??
    row['Earning/hour'] ??
    row.earningPerHour ??
    row.earning_per_hour ??
    row.earning

  const joiningBonusRaw =
    row['Joining Bonous'] ??
    row['Joining Bonus'] ??
    row['Joining bonous'] ??
    row['Joining bonus'] ??
    row.joiningBonus ??
    row.joining_bonus ??
    row.bonus

  // Sheet field in the reference: "TEAM leader" (values like Yes/Y/1 or 0)
  const teamLeaderRaw =
    row['TEAM leader'] ??
    row['Team leader'] ??
    row.teamLeader ??
    row.team_leader ??
    0

  const teamLeaderHas = (() => {
    const v = teamLeaderRaw == null ? '' : String(teamLeaderRaw).trim().toLowerCase()
    return v === '1' || v === 'yes' || v === 'y' || v === 'true'
  })()

  const teamLeaderNameRaw =
    row['Team leader NAME'] ??
    row['Team leader Name'] ??
    row.teamLeaderName ??
    row.team_leader_name ??
    ''

  const teamLeaderName = teamLeaderNameRaw.toString().trim()

  // Track orders from the sheet: any column header that contains "orders".
  const ordersFromSheet = (() => {
    for (const [k, v] of Object.entries(row || {})) {
      if (!k) continue
      if (!k.toString().toLowerCase().includes('orders')) continue
      const num = Number(String(v).replace(/,/g, '').trim())
      if (!Number.isNaN(num)) return num
    }
    return null
  })()

  const zone = extractZoneFromRow(row)

  return {
    record: {
    id: `store-${index}-${lat.toFixed(4)}-${lng.toFixed(4)}`,
    city: cityRaw,
    client,
    store_name: storeName,
    zone,
    lat,
    lng,
    totalRaider: Number(totalRaiderRaw) || 0,
    totalRaiderReq: Number(totalRaiderReqRaw) || 0,
    cpo: Number(cpoCountRaw) || 0,
    teamLeaderHas,
    teamLeaderName,
    orders: ordersFromSheet,
    earningPerHour: earningPerHourRaw == null || String(earningPerHourRaw).trim() === '' ? null : earningPerHourRaw,
    joiningBonus: joiningBonusRaw == null || String(joiningBonusRaw).trim() === '' ? null : joiningBonusRaw,
    },
    issue: null,
  }
}

export function normalizeSheetRows(rows) {
  if (!Array.isArray(rows)) return []
  return rows.map((row, i) => normalizeRowWithIssue(row, i).record).filter(Boolean)
}

export function normalizeSheetRowsWithIssues(rows) {
  if (!Array.isArray(rows)) return { records: [], issues: [] }
  const records = []
  const issues = []
  rows.forEach((row, i) => {
    const { record, issue } = normalizeRowWithIssue(row, i)
    if (record) records.push(record)
    if (issue) issues.push(issue)
  })
  return { records, issues }
}
