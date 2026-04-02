import { useEffect, useState } from 'react'
import Filters from './Filters'

export default function MobileFiltersSheet({
  open,
  onClose,
  cities,
  zone,
  city,
  client,
  storeId,
  storeOptions,
  distanceKm,
  onReset,
  onApply,
  onClearMapSelection,
}) {
  if (!open) return null

  const [draftZone, setDraftZone] = useState(zone)
  const [draftCity, setDraftCity] = useState(city)
  const [draftClient, setDraftClient] = useState(client)
  const [draftStoreId, setDraftStoreId] = useState(storeId)
  const [draftDistanceKm, setDraftDistanceKm] = useState(distanceKm)

  useEffect(() => {
    if (!open) return
    setDraftZone(zone)
    setDraftCity(city)
    setDraftClient(client)
    setDraftStoreId(storeId)
    setDraftDistanceKm(distanceKm)
  }, [open, zone, city, client, storeId, distanceKm])

  return (
    <div
      className="fixed inset-0 z-[2600] flex items-end justify-center bg-black/25 p-2.5 pt-16 backdrop-blur-[2px] md:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Filters"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white p-2.5 shadow-card">
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white px-3 py-2.5">
          <h2 className="text-sm font-bold text-slate-900">Filters</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
            aria-label="Close filters"
          >
            ✕
          </button>
        </div>

        <div className="mt-2.5 h-[68vh] min-h-0 overflow-hidden rounded-2xl border border-slate-100 bg-white">
          <Filters
            zone={draftZone}
            setZone={setDraftZone}
            cities={cities}
            city={draftCity}
            setCity={setDraftCity}
            client={draftClient}
            setClient={setDraftClient}
            storeId={draftStoreId}
            setStoreId={setDraftStoreId}
            storeOptions={storeOptions}
            distanceKm={draftDistanceKm}
            setDistanceKm={setDraftDistanceKm}
            onReset={() => {
              onReset?.()
              onClose?.()
            }}
            onClearMapSelection={onClearMapSelection}
          />
        </div>

        <div className="mt-2.5 flex items-center gap-3 rounded-2xl border border-slate-100 bg-white px-3 py-2.5">
          <button
            type="button"
            className="flex-1 rounded-2xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
            onClick={() => {
              setDraftZone(zone)
              setDraftCity(city)
              setDraftClient(client)
              setDraftStoreId(storeId)
              setDraftDistanceKm(distanceKm)
              onClose?.()
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            className="flex-1 rounded-2xl bg-primary py-3 text-sm font-extrabold text-white shadow-sm hover:bg-primary-dark"
            onClick={() => {
              onApply?.({
                zone: draftZone,
                city: draftCity,
                client: draftClient,
                storeId: draftStoreId,
                distanceKm: draftDistanceKm,
              })
              onClose?.()
            }}
          >
            Apply filters
          </button>
        </div>
      </div>
    </div>
  )
}

