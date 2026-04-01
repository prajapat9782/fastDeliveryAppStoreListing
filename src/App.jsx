import { useMemo, useState, useEffect, useCallback } from 'react'
import { useStoreData } from './hooks/useStoreData'
import TopNav from './components/TopNav'
import Filters from './components/Filters'
import MapView from './components/MapView'
import MapLegend from './components/MapLegend'
import ActiveSelectionCard from './components/ActiveSelectionCard'
import NearbyList from './components/NearbyList'
import { findNearbyStores } from './utils/haversine'

export default function App() {
  const { stores, loading, usedMock } = useStoreData()
  const [city, setCity] = useState('')
  const [client, setClient] = useState('')
  const [storeId, setStoreId] = useState('')
  const [distanceKm, setDistanceKm] = useState(20)
  const [selectedFromMap, setSelectedFromMap] = useState(null)

  useEffect(() => {
    setStoreId('')
  }, [city, client])

  useEffect(() => {
    setSelectedFromMap(null)
  }, [city, client, storeId])

  const cities = useMemo(() => {
    const u = new Set(stores.map((s) => s.city).filter(Boolean))
    return Array.from(u).sort()
  }, [stores])

  const filteredForMap = useMemo(() => {
    let list = stores
    if (city) list = list.filter((s) => s.city === city)
    if (client) list = list.filter((s) => s.client === client)
    if (storeId) list = list.filter((s) => s.id === storeId)
    return list
  }, [stores, city, client, storeId])

  const storeOptions = useMemo(() => {
    let list = stores
    if (city) list = list.filter((s) => s.city === city)
    if (client) list = list.filter((s) => s.client === client)
    return [...list].sort((a, b) => a.store_name.localeCompare(b.store_name))
  }, [stores, city, client])

  const flyToPoint = useMemo(() => {
    if (!storeId) return null
    return stores.find((s) => s.id === storeId) ?? null
  }, [stores, storeId])

  const useFitBounds = !storeId

  /** Full dataset — ignores city/client/store filters so nearby shows every brand in radius. */
  const nearby = useMemo(() => {
    if (!selectedFromMap) return []
    return findNearbyStores(selectedFromMap, stores, distanceKm)
  }, [selectedFromMap, stores, distanceKm])

  const handleReset = useCallback(() => {
    setCity('')
    setClient('')
    setStoreId('')
    setDistanceKm(20)
    setSelectedFromMap(null)
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
      <TopNav />

      {usedMock && (
        <div className="shrink-0 border-b border-amber-200/80 bg-amber-50 px-4 py-2 text-center text-xs font-medium text-amber-900">
          Using offline mock data — sheet unreachable or produced no valid rows.
        </div>
      )}

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <aside className="flex max-h-[45vh] shrink-0 flex-col border-slate-200 bg-white px-5 py-6 shadow-card lg:max-h-none lg:h-full lg:w-[340px] lg:border-r lg:px-6">
          <Filters
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
          />
        </aside>

        <div className="relative min-h-0 min-w-0 flex-1 p-3 md:p-4 lg:p-5">
          {stores.length === 0 ? (
            <div className="flex h-full min-h-[240px] items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white text-slate-500">
              No store data available.
            </div>
          ) : (
            <>
              <div className="relative h-full min-h-[280px] overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card lg:min-h-0">
                <MapView
                  stores={filteredForMap}
                  flyToPoint={flyToPoint}
                  selectedStore={selectedFromMap}
                  distanceKm={distanceKm}
                  onMarkerClick={setSelectedFromMap}
                  useFitBounds={useFitBounds}
                />

                <div className="pointer-events-none absolute left-3 top-3 z-[1000] md:left-4 md:top-4">
                  <MapLegend />
                </div>

                <div className="pointer-events-none absolute right-3 top-3 z-[1000] max-w-[calc(100%-1rem)] md:right-4 md:top-4">
                  <div className="pointer-events-auto">
                    <ActiveSelectionCard store={selectedFromMap} />
                  </div>
                </div>

                <div className="pointer-events-none absolute bottom-3 right-3 z-[1000] max-w-[calc(100%-1.5rem)] md:bottom-4 md:right-4">
                  <div className="pointer-events-auto">
                    <NearbyList
                      origin={selectedFromMap}
                      items={nearby}
                      distanceKm={distanceKm}
                      onViewAll={() => {}}
                    />
                  </div>
                </div>

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
    </div>
  )
}
