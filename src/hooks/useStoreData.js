import { useEffect, useState } from 'react'
import { normalizeSheetRows } from '../utils/normalizeSheetRow'
import mockStores from '../data/mockStores.json'

const SHEET_URL =
  import.meta.env.VITE_SHEET_URL ??
  'https://opensheet.elk.sh/17koi2ni636YGC9ZheBGzxK8UWDvoCKfVMf75N7o1HH4/Sheet1'

/**
 * Fetches public Google Sheet JSON (opensheet.elk.sh), normalizes rows to store objects.
 * On failure, loads bundled mockStores (bonus fallback for local dev / offline).
 */
export function useStoreData() {
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(true)
  const [usedMock, setUsedMock] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setUsedMock(false)
      try {
        const res = await fetch(SHEET_URL)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const rows = await res.json()
        const normalized = normalizeSheetRows(rows)
        if (!cancelled) {
          if (normalized.length === 0) {
            setStores(normalizeSheetRows(mockStores))
            setUsedMock(true)
          } else {
            setStores(normalized)
          }
        }
      } catch (e) {
        console.warn('Sheet fetch failed, using mock data:', e)
        if (!cancelled) {
          setStores(normalizeSheetRows(mockStores))
          setUsedMock(true)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return { stores, loading, usedMock, sheetUrl: SHEET_URL }
}
