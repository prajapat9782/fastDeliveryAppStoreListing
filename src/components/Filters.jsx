import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { CLIENT_OPTIONS } from '../constants/clients'
import { ZONE_OPTIONS } from '../utils/zone'

function formatStoreLabel(s) {
  return `${s.store_name} — ${s.client}`
}

/**
 * Searchable store list — filters options as the user types.
 */
function StoreSearchCombobox({ storeId, setStoreId, storeOptions, onClearMapSelection }) {
  const listId = useId()
  const blurTimer = useRef(null)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  const selected = useMemo(() => storeOptions.find((s) => s.id === storeId) ?? null, [storeOptions, storeId])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return storeOptions
    return storeOptions.filter((s) => {
      const hay = `${s.store_name} ${s.client} ${s.id}`.toLowerCase()
      return hay.includes(q)
    })
  }, [storeOptions, query])

  const inputValue = open ? query : selected ? formatStoreLabel(selected) : ''

  useEffect(() => {
    if (!open) setQuery('')
  }, [storeId, open])

  useEffect(() => {
    return () => {
      if (blurTimer.current) clearTimeout(blurTimer.current)
    }
  }, [])

  const bumpClearMap = () => onClearMapSelection?.()

  return (
    <div className="relative">
      <input
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        placeholder={storeOptions.length ? 'Search store…' : 'No stores for filters'}
        autoComplete="off"
        disabled={storeOptions.length === 0}
        value={inputValue}
        onChange={(e) => {
          bumpClearMap()
          setQuery(e.target.value)
          if (!open) setOpen(true)
        }}
        onFocus={() => {
          bumpClearMap()
          setOpen(true)
          setQuery('')
        }}
        onBlur={() => {
          blurTimer.current = setTimeout(() => setOpen(false), 120)
        }}
        className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-4 pr-10 text-sm font-medium text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-slate-50"
      />
      {selectChevron}
      {open && storeOptions.length > 0 && (
        <ul
          id={listId}
          role="listbox"
          className="absolute left-0 right-0 top-full z-50 mt-1 max-h-52 overflow-y-auto rounded-2xl border border-slate-200 bg-white py-1 shadow-float"
        >
          <li>
            <button
              type="button"
              role="option"
              className="w-full px-4 py-2.5 text-left text-sm text-slate-500 hover:bg-slate-50"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                bumpClearMap()
                setStoreId('')
                setOpen(false)
              }}
            >
              Clear selection
            </button>
          </li>
          {filtered.length === 0 ? (
            <li className="px-4 py-3 text-sm text-slate-500">No matches</li>
          ) : (
            filtered.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={storeId === s.id}
                  className={`w-full px-4 py-2.5 text-left text-sm font-medium hover:bg-slate-50 ${
                    storeId === s.id ? 'bg-primary/10 text-primary' : 'text-slate-800'
                  }`}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    bumpClearMap()
                    setStoreId(s.id)
                    setOpen(false)
                  }}
                >
                  {formatStoreLabel(s)}
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}

const selectChevron = (
  <svg className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
)

/**
 * Left sidebar — filters, distance, reset.
 */
export default function Filters({
  zone,
  setZone,
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
  onClearMapSelection,
}) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto pr-1">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-slate-900">Store Locator</h2>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            Filter by zone, city, client, and distance.
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Zone</label>
          <div className="relative">
            <select
              value={zone}
              onChange={(e) => setZone(e.target.value)}
              className="w-full appearance-none rounded-2xl border border-slate-200 bg-white py-3 pl-4 pr-10 text-sm font-medium text-slate-800 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="">All zones</option>
              {ZONE_OPTIONS.map((z) => (
                <option key={z} value={z}>
                  {z}
                </option>
              ))}
            </select>
            {selectChevron}
          </div>
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
          <StoreSearchCombobox
            storeId={storeId}
            setStoreId={setStoreId}
            storeOptions={storeOptions}
            onClearMapSelection={onClearMapSelection}
          />
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
