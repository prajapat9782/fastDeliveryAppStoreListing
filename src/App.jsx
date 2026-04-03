import { useMemo, useState, useEffect, useCallback } from 'react'
import { useStoreData } from './hooks/useStoreData'
import TopNav from './components/TopNav'
import Filters from './components/Filters'
import MapView from './components/MapView'
import MapLegend from './components/MapLegend'
import ActiveSelectionCard from './components/ActiveSelectionCard'
import NearbyList from './components/NearbyList'
import NearbyAllDialog from './components/NearbyAllDialog'
import MobileSelectionSheet from './components/MobileSelectionSheet'
import MobileFiltersSheet from './components/MobileFiltersSheet'
import { findNearbyStores, haversineKm } from './utils/haversine'
import { computeRiderRequirementStats } from './utils/riderRequirementStats'
import { normalizeZoneLabel } from './utils/zone'

export default function App() {
  const { stores, loading, usedMock, invalidRows } = useStoreData()
  const [zone, setZone] = useState('')
  const [city, setCity] = useState('')
  const [client, setClient] = useState('')
  const [storeId, setStoreId] = useState('')
  const [distanceKm, setDistanceKm] = useState(20)
  const [selectedFromMap, setSelectedFromMap] = useState(null)
  const [nearbyExpanded, setNearbyExpanded] = useState(false)
  const [nearbyAllOpen, setNearbyAllOpen] = useState(false)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [invalidOpen, setInvalidOpen] = useState(false)
  /** Nearby brand tabs (All / Blinkit / …) — filters map markers inside the circle */
  const [nearbyBrandFilter, setNearbyBrandFilter] = useState('All')

  useEffect(() => {
    setStoreId('')
  }, [city, client])

  useEffect(() => {
    setCity('')
    setStoreId('')
    setSelectedFromMap(null)
  }, [zone])

  useEffect(() => {
    setSelectedFromMap(null)
  }, [city, client, storeId])

  useEffect(() => {
    setNearbyBrandFilter('All')
  }, [selectedFromMap?.id, storeId])

  // Close dialogs / reset tile size when the selection changes.
  useEffect(() => {
    setNearbyAllOpen(false)
    setNearbyExpanded(false)
  }, [selectedFromMap])

  /** Stores after zone filter (sheet column name contains "zone") */
  const storesInZone = useMemo(() => {
    if (!zone) return stores
    return stores.filter((s) => {
      const z = normalizeZoneLabel(s.zone)
      return z === zone
    })
  }, [stores, zone])

  const cities = useMemo(() => {
    const u = new Set(storesInZone.map((s) => s.city).filter(Boolean))
    return Array.from(u).sort()
  }, [storesInZone])

  const filteredForMap = useMemo(() => {
    let list = storesInZone
    if (city) list = list.filter((s) => s.city === city)
    if (client) list = list.filter((s) => s.client === client)

    const center =
      selectedFromMap ?? (storeId ? storesInZone.find((s) => s.id === storeId) : null)
    if (!center || !Number.isFinite(center.lat) || !Number.isFinite(center.lng)) {
      return list
    }

    let pool = list.filter((s) => haversineKm(center.lat, center.lng, s.lat, s.lng) <= distanceKm)

    if (nearbyBrandFilter && nearbyBrandFilter !== 'All') {
      pool = pool.filter((s) => s.client === nearbyBrandFilter)
      if (!pool.some((s) => s.id === center.id)) {
        pool = [center, ...pool]
      }
    }

    return pool
  }, [storesInZone, city, client, selectedFromMap, storeId, distanceKm, nearbyBrandFilter])

  const storeOptions = useMemo(() => {
    let list = storesInZone
    if (city) list = list.filter((s) => s.city === city)
    if (client) list = list.filter((s) => s.client === client)
    return [...list].sort((a, b) => a.store_name.localeCompare(b.store_name))
  }, [storesInZone, city, client])

  const storesInSelectedCity = useMemo(() => {
    if (!city) return []
    return storesInZone.filter((s) => s.city === city)
  }, [storesInZone, city])

  const riderStats = useMemo(() => computeRiderRequirementStats(storesInSelectedCity), [storesInSelectedCity])

  /** Full dataset — used by map legend only (ignores zone/city/client/map filters) */
  const riderStatsOverall = useMemo(() => computeRiderRequirementStats(stores), [stores])

  const flyToPoint = useMemo(() => {
    if (!storeId) return null
    return storesInZone.find((s) => s.id === storeId) ?? null
  }, [storesInZone, storeId])

  /** Circle + marker highlight: map tap selection wins over dropdown-only selection */
  const mapCircleStore = selectedFromMap ?? flyToPoint

  const useFitBounds = !mapCircleStore

  /** Stores within radius of selection — scoped to current zone filter + circle distance. */
  const nearby = useMemo(() => {
    if (!selectedFromMap) return []
    return findNearbyStores(selectedFromMap, storesInZone, distanceKm)
  }, [selectedFromMap, storesInZone, distanceKm])

  const handleReset = useCallback(() => {
    setZone('')
    setCity('')
    setClient('')
    setStoreId('')
    setDistanceKm(20)
    setSelectedFromMap(null)
    setNearbyBrandFilter('All')
  }, [])

  /** Hide Active selection + Nearby when user uses the store search / dropdown */
  const clearMapSelection = useCallback(() => {
    setSelectedFromMap(null)
    setNearbyAllOpen(false)
  }, [])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm font-medium text-slate-600">Loading stores…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-surface">
      <TopNav
        onOpenFilters={() => setMobileFiltersOpen(true)}
        city={city}
        riderTotal={riderStats.total}
        riderByClient={riderStats.byClient}
      />

      {usedMock && (
        <div className="shrink-0 border-b border-amber-200/80 bg-amber-50 px-4 py-3 text-center text-xs font-medium leading-relaxed text-amber-900 md:py-2">
          Using offline mock data — sheet unreachable or produced no valid rows.
        </div>
      )}

      {invalidRows.length > 0 && (
        <div className="shrink-0 border-b border-blue-200/80 bg-blue-50 px-4 py-3 text-center text-xs font-medium leading-relaxed text-blue-900 md:py-2">
          <span>Skipped {invalidRows.length} invalid row(s) from sheet.</span>{' '}
          <button
            type="button"
            onClick={() => setInvalidOpen(true)}
            className="inline-flex items-center gap-1 rounded-md bg-white/70 px-2 py-0.5 font-semibold text-blue-800 hover:bg-white"
          >
            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-blue-300 text-[10px] leading-none">
              i
            </span>
            Details
          </button>
        </div>
      )}

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <aside className="hidden lg:flex max-h-[45vh] shrink-0 flex-col border-slate-200 bg-white px-5 py-6 shadow-card lg:max-h-none lg:h-full lg:w-[340px] lg:border-r lg:px-6">
          <Filters
            zone={zone}
            setZone={setZone}
            cities={cities}
            city={city}
            setCity={setCity}
            client={client}
            setClient={setClient}
            storeId={storeId}
            setStoreId={setStoreId}
            storeOptions={storeOptions}
            distanceKm={distanceKm}
            setDistanceKm={setDistanceKm}
            onReset={handleReset}
            onClearMapSelection={clearMapSelection}
          />
        </aside>

        <div className="relative min-h-0 min-w-0 flex-1 p-0 md:p-4 lg:p-5">
          {stores.length === 0 ? (
            <div className="flex h-full min-h-[240px] items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white text-slate-500">
              No store data available.
            </div>
          ) : (
            <>
              <div className="relative h-full min-h-[280px] overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card lg:min-h-0">
                <MapView
                  stores={filteredForMap}
                  flyToPoint={mapCircleStore}
                  selectedStore={mapCircleStore}
                  distanceKm={distanceKm}
                  onMarkerClick={setSelectedFromMap}
                  useFitBounds={useFitBounds}
                />

                <div className="pointer-events-none absolute left-3 top-3 z-[1000] hidden md:block md:left-4 md:top-4">
                  <MapLegend
                    riderTotal={riderStatsOverall.total}
                    riderByClient={riderStatsOverall.byClient}
                  />
                </div>

                {selectedFromMap && (
                  <div className="pointer-events-none absolute bottom-3 right-3 top-3 z-[1000] hidden max-w-[calc(100%-1.5rem)] md:right-4 md:top-4 md:bottom-4 md:flex md:max-w-[280px] md:flex-col md:gap-0">
                    <div className="pointer-events-auto flex h-full min-h-0 w-full max-w-[280px] flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-float">
                      <ActiveSelectionCard store={selectedFromMap} compact />
                      <NearbyList
                        origin={selectedFromMap}
                        items={nearby}
                        distanceKm={distanceKm}
                        nearbyBrandFilter={nearbyBrandFilter}
                        onNearbyBrandFilterChange={setNearbyBrandFilter}
                        expanded={nearbyExpanded}
                        onToggleExpanded={() => setNearbyExpanded((v) => !v)}
                        onViewAll={() => setNearbyAllOpen(true)}
                        stacked
                      />
                    </div>
                  </div>
                )}

                {selectedFromMap && (
                  <NearbyAllDialog
                    open={nearbyAllOpen}
                    origin={selectedFromMap}
                    items={nearby}
                    distanceKm={distanceKm}
                    onClose={() => setNearbyAllOpen(false)}
                    onPickStore={(s) => {
                      setSelectedFromMap(s)
                      setNearbyAllOpen(false)
                    }}
                  />
                )}

                {/* Mobile bottom sheet */}
                {selectedFromMap && (
                  <MobileSelectionSheet
                    store={selectedFromMap}
                    nearbyItems={nearby}
                    distanceKm={distanceKm}
                    nearbyBrandFilter={nearbyBrandFilter}
                    onNearbyBrandFilterChange={setNearbyBrandFilter}
                    onClose={() => setSelectedFromMap(null)}
                    onOpenAll={() => setNearbyAllOpen(true)}
                    onPickStore={(s) => setSelectedFromMap(s)}
                  />
                )}

                {filteredForMap.length === 0 && (
                  <div className="pointer-events-none absolute inset-0 z-[500] flex items-center justify-center rounded-2xl bg-white/75 backdrop-blur-[2px]">
                    <p className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-float">
                      No stores match these filters.
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <MobileFiltersSheet
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        cities={cities}
        zone={zone}
        city={city}
        client={client}
        storeId={storeId}
        storeOptions={storeOptions}
        distanceKm={distanceKm}
        onReset={handleReset}
        onClearMapSelection={clearMapSelection}
        onApply={({ zone: nextZone, city: nextCity, client: nextClient, storeId: nextStoreId, distanceKm: nextDistanceKm }) => {
          setZone(nextZone ?? '')
          setCity(nextCity ?? '')
          setClient(nextClient ?? '')
          setStoreId(nextStoreId ?? '')
          if (typeof nextDistanceKm === 'number' && Number.isFinite(nextDistanceKm)) {
            setDistanceKm(nextDistanceKm)
          }
        }}
      />

      {invalidOpen && (
        <div
          className="fixed inset-0 z-[3200] flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-[1px]"
          role="dialog"
          aria-modal="true"
          aria-label="Invalid rows details"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setInvalidOpen(false)
          }}
        >
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <h2 className="text-sm font-bold text-slate-900">
                Invalid rows ({invalidRows.length})
              </h2>
              <button
                type="button"
                onClick={() => setInvalidOpen(false)}
                className="rounded-xl bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                Close
              </button>
            </div>
            <div className="max-h-[65vh] overflow-y-auto px-4 py-3">
              <ul className="space-y-2">
                {invalidRows.map((item, idx) => (
                  <li key={`${item.row}-${item.store_name}-${idx}`} className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
                    <p className="text-sm font-semibold text-slate-900">
                      Row {item.row}: {item.store_name}
                    </p>
                    <p className="text-xs text-slate-600">{item.reason}</p>
                    {Array.isArray(item.missing_keys) && item.missing_keys.length > 0 && (
                      <p className="mt-1 text-[11px] font-medium text-slate-500">
                        Missing keys: {item.missing_keys.join(', ')}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
