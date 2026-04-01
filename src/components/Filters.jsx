import { CLIENT_OPTIONS } from '../constants/clients'

const selectChevron = (
  <svg className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
)

/**
 * Left sidebar — filters, distance, reset.
 */
export default function Filters({
  cities,
  city,
  setCity,
  client,
  setClient,
  storeId,
  setStoreId,
  storeOptions,
  distanceKm,
  setDistanceKm,
  onReset,
}) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto pr-1">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-slate-900">Store Locator</h2>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            Filter stores by city, client, and distance.
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">City</label>
          <div className="relative">
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full appearance-none rounded-2xl border border-slate-200 bg-white py-3 pl-4 pr-10 text-sm font-medium text-slate-800 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Select city</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {selectChevron}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Client</label>
          <div className="relative">
            <select
              value={client}
              onChange={(e) => setClient(e.target.value)}
              className="w-full appearance-none rounded-2xl border border-slate-200 bg-white py-3 pl-4 pr-10 text-sm font-medium text-slate-800 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Select client</option>
              {CLIENT_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {selectChevron}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Store</label>
          <div className="relative">
            <select
              value={storeId}
              onChange={(e) => setStoreId(e.target.value)}
              className="w-full appearance-none rounded-2xl border border-slate-200 bg-white py-3 pl-4 pr-10 text-sm font-medium text-slate-800 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Select store</option>
              {storeOptions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.store_name} — {s.client}
                </option>
              ))}
            </select>
            {selectChevron}
          </div>
        </div>

        <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Distance (km)</span>
            <span className="font-mono text-sm font-semibold text-primary">{distanceKm} km</span>
          </div>
          <input
            type="range"
            min={1}
            max={100}
            value={distanceKm}
            onChange={(e) => setDistanceKm(Number(e.target.value))}
            className="slider-primary h-2 w-full cursor-pointer rounded-full"
          />
        </div>

        <button
          type="button"
          onClick={onReset}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <svg className="h-4 w-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Reset filters
        </button>
      </div>
    </div>
  )
}
