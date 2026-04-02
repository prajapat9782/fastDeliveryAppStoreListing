import { useState } from 'react'
import { CLIENT_COLORS, CLIENT_EMOJI, CLIENT_ICON_URL } from '../constants/clients'

function BrandIcon({ client }) {
  const [failed, setFailed] = useState(false)
  const url = CLIENT_ICON_URL[client]
  const color = CLIENT_COLORS[client] ?? '#64748b'
  const emoji = CLIENT_EMOJI[client] ?? '📍'
  if (failed || !url) {
    return (
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-white text-sm"
        style={{ backgroundColor: color }}
      >
        {emoji}
      </span>
    )
  }
  return (
    <img
      src={url}
      alt=""
      className="h-9 w-9 shrink-0 rounded-full border-2 border-white object-cover"
      onError={() => setFailed(true)}
    />
  )
}

/**
 * Floating “Nearby stores” card — logos from web, all brands within radius (full dataset).
 */
export default function NearbyList({
  origin,
  items,
  distanceKm,
  onViewAll,
  expanded,
  onToggleExpanded,
}) {
  const heightClass = expanded
    ? 'max-h-[min(68vh,520px)]'
    : 'max-h-[min(52vh,420px)]'

  return (
    <div
      className={`pointer-events-auto flex w-[min(100%,340px)] flex-col rounded-2xl border border-slate-100 bg-white shadow-float ${heightClass}`}
    >
      <div className="flex shrink-0 items-start justify-between gap-2 border-b border-slate-100 px-4 py-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Nearby stores {origin ? `(${items.length})` : ''}
          </h3>
          {origin && (
            <p className="text-[11px] text-slate-400">
              All clients within {distanceKm} km · sorted by distance
            </p>
          )}
        </div>
        {origin && items.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onViewAll}
              className="shrink-0 text-xs font-semibold text-primary hover:underline"
            >
              View all
            </button>
            <button
              type="button"
              onClick={onToggleExpanded}
              className="shrink-0 rounded-xl bg-slate-50 px-3 py-1.5 text-[11px] font-bold text-slate-700 hover:bg-slate-100"
              aria-label={expanded ? 'Collapse nearby tile' : 'Expand nearby tile'}
            >
              {expanded ? 'Collapse' : 'Expand'}
            </button>
          </div>
        )}
      </div>

      <div className="min-h-[140px] flex-1 overflow-y-auto">
        {!origin && (
          <div className="flex h-full min-h-[140px] flex-col items-center justify-center gap-2 px-6 py-8 text-center">
            <div className="rounded-full bg-slate-100 p-3 text-slate-400">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-600">Select a store on the map</p>
            <p className="text-xs text-slate-400">Nearby locations appear here with distance.</p>
          </div>
        )}

        {origin && items.length === 0 && (
          <div className="flex h-full min-h-[140px] flex-col items-center justify-center gap-1 px-6 py-8 text-center">
            <p className="text-sm font-medium text-slate-600">No other stores in range</p>
            <p className="text-xs text-slate-400">Increase distance or pick another pin.</p>
          </div>
        )}

        {origin && items.length > 0 && (
          <ul className="divide-y divide-slate-100 py-1">
            {items.map((s) => (
              <li key={s.id} className="flex items-start gap-3 px-4 py-3 transition hover:bg-slate-50/80">
                <BrandIcon client={s.client} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">{s.store_name}</p>
                  <p className="truncate text-xs font-medium text-primary/90">{s.client}</p>
                  <p className="truncate text-[11px] text-slate-400">{s.city}</p>
                </div>
                <span className="shrink-0 rounded-lg bg-primary-light px-2 py-1 font-mono text-xs font-bold text-primary">
                  {s.distanceKm.toFixed(1)} km
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
