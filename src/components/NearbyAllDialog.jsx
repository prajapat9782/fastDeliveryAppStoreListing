import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { CLIENT_COLORS, CLIENT_EMOJI, CLIENT_ICON_URL } from '../constants/clients'

function BrandIcon({ client }) {
  const url = CLIENT_ICON_URL[client]
  const color = CLIENT_COLORS[client] ?? '#64748b'
  const emoji = CLIENT_EMOJI[client] ?? '📍'
  const [failed, setFailed] = useState(false)

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
      onError={(e) => {
        // If the image fails to load (hotlink/cors), keep the tile usable.
        setFailed(true)
      }}
    />
  )
}

export default function NearbyAllDialog({
  open,
  origin,
  items,
  distanceKm,
  onClose,
  onPickStore,
}) {
  useEffect(() => {
    if (!open) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  const title = origin
    ? `Nearby stores (${items.length})`
    : `Nearby stores`

  return createPortal(
    <div
      className="fixed inset-0 z-[3000] flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-[1px]"
      role="dialog"
      aria-modal="true"
      aria-label="Nearby stores dialog"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card">
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">{title}</h2>
            {origin && (
              <p className="mt-1 text-xs text-slate-400">
                From <span className="font-semibold text-slate-700">{origin.store_name}</span> · within{' '}
                {distanceKm} km · sorted by distance
              </p>
            )}
          </div>
          <button
            type="button"
            className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            onClick={onClose}
            aria-label="Close dialog"
          >
            Close
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto">
          {!origin ? (
            <div className="px-5 py-10 text-center text-sm text-slate-500">Select a store to see nearby results.</div>
          ) : items.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-slate-500">No nearby stores found in the selected radius.</div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {items.map((s) => (
                <li key={s.id} className="flex items-center gap-3 px-5 py-4 hover:bg-slate-50/70">
                  <BrandIcon client={s.client} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900">{s.store_name}</p>
                    <p className="truncate text-xs font-medium text-primary/90">{s.client}</p>
                    <p className="truncate text-[11px] text-slate-400">{s.city}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="rounded-lg bg-primary-light px-2 py-1 font-mono text-xs font-bold text-primary">
                      {s.distanceKm.toFixed(1)} km
                    </span>
                    <button
                      type="button"
                      className="rounded-xl bg-primary px-3 py-2 text-xs font-bold text-white hover:bg-primary-dark"
                      onClick={() => onPickStore(s)}
                    >
                      Select
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}

