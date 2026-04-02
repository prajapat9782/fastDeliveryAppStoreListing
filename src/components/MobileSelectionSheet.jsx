import { useMemo, useState } from 'react'
import { CLIENT_COLORS, CLIENT_EMOJI, CLIENT_ICON_URL } from '../constants/clients'
import { formatAddressLine } from '../utils/selectionMeta'

function BrandIcon({ client }) {
  const url = CLIENT_ICON_URL[client]
  const color = CLIENT_COLORS[client] ?? '#64748b'
  const emoji = CLIENT_EMOJI[client] ?? '📍'

  if (!url) {
    return (
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-white text-sm"
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
      className="h-10 w-10 shrink-0 rounded-xl border-2 border-white object-cover"
      onError={(e) => {
        e.currentTarget.style.display = 'none'
      }}
    />
  )
}

function formatCompactNumber(n) {
  const num = Number(n)
  if (!Number.isFinite(num)) return '0'
  if (num < 1000) return String(Math.round(num))
  const k = num / 1000
  const rounded = k >= 10 ? Math.round(k) : Math.round(k * 10) / 10
  // Convert 1.0K => 1K
  return `${String(rounded).replace(/\.0$/, '')}K`
}

function openSystemMaps({ lat, lng, label }) {
  const safeLabel = label ? String(label) : ''
  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

  try {
    if (isIOS) {
      // Prefer the system Maps app on iOS
      window.location.href = `maps://?q=${encodeURIComponent(safeLabel)}&ll=${lat},${lng}`
      return
    }
    // Android / others: geo: deep link
    window.location.href = `geo:${lat},${lng}?q=${lat},${lng}(${encodeURIComponent(safeLabel)})`
  } catch {
    // ignore
  }
}

function formatLooseValue(v) {
  if (v == null) return '—'
  const s = String(v).trim()
  if (!s) return '—'
  const n = Number(s.replace(/,/g, ''))
  if (Number.isFinite(n)) return n.toLocaleString()
  return s
}

export default function MobileSelectionSheet({
  store,
  nearbyItems,
  distanceKm,
  onClose,
  onOpenAll,
  onPickStore,
}) {
  if (!store) return null

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${store.lat},${store.lng}`
  const totalRaider = Number(store.totalRaider ?? 0)
  const totalRaiderReq = Number(store.totalRaiderReq ?? 0)
  const ridersRequiredPadded = String(Math.max(0, Math.round(totalRaiderReq))).padStart(2, '0')
  const earningPerHour = store.earningPerHour
  const joiningBonus = store.joiningBonus

  const tabs = useMemo(() => {
    const clients = Array.from(new Set((nearbyItems || []).map((s) => s.client).filter(Boolean)))
    clients.sort((a, b) => String(a).localeCompare(String(b)))
    return ['All', ...clients]
  }, [nearbyItems])

  const [activeTab, setActiveTab] = useState('All')

  const visibleNearby = useMemo(() => {
    if (activeTab === 'All') return nearbyItems
    return nearbyItems.filter((s) => s.client === activeTab)
  }, [nearbyItems, activeTab])

  return (
    <div className="fixed inset-0 z-[2800] flex items-end justify-center bg-black/10 p-4 pt-16 backdrop-blur-[2px] md:hidden">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-[0_20px_60px_-25px_rgba(2,6,23,0.65)]">
        <div className="border-b border-slate-100 px-4 py-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <BrandIcon client={store.client} />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary">{store.client}</p>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  <span className="text-[10px] font-bold text-slate-700">Open Now</span>
                </span>
              </div>

              <h3 className="mt-1 truncate text-[22px] font-extrabold text-slate-900">{store.store_name}</h3>
              <p className="mt-1 truncate text-sm text-slate-500">{formatAddressLine(store)}</p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  openSystemMaps({ lat: store.lat, lng: store.lng, label: store.store_name })
                  // Fallback for environments where deep links are blocked.
                  window.setTimeout(() => {
                    window.open(mapsUrl, '_blank', 'noopener,noreferrer')
                  }, 450)
                }}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary hover:bg-primary/15"
                aria-label="Open in maps"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-sm font-extrabold text-slate-700 hover:bg-slate-100"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        <div className="px-4 py-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-slate-50 px-3 py-3">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Total Rider</p>
              <p className="mt-2 text-2xl font-black text-slate-900">{formatCompactNumber(totalRaider)}</p>
              <p className="mt-1 text-[10px] font-bold text-slate-500">Active</p>
            </div>

            <div className="rounded-2xl bg-slate-50 px-3 py-3">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Total Rider Req</p>
              <p className="mt-2 text-2xl font-black text-slate-900">{ridersRequiredPadded}</p>
              <p className="mt-1 text-[10px] font-bold text-red-600">Urgent</p>
            </div>

            <div className="rounded-2xl bg-slate-50 px-3 py-3">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Earning per hour</p>
              <p className="mt-2 text-2xl font-black text-slate-900">{formatLooseValue(earningPerHour)}</p>
            </div>

            <div className="rounded-2xl bg-slate-50 px-3 py-3">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Joining bonus</p>
              <p className="mt-2 text-2xl font-black text-slate-900">{formatLooseValue(joiningBonus)}</p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm font-bold text-slate-900">Nearby Stores ({nearbyItems.length})</p>
            <button
              type="button"
              onClick={onOpenAll}
              className="text-[11px] font-bold text-primary hover:underline"
            >
              ALL STORES
            </button>
          </div>

          <div className="mt-3">
            {nearbyItems.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm font-semibold text-slate-500">
                No nearby stores in range
              </div>
            ) : (
              <>
                <div className="-mx-4 overflow-x-auto px-4 pb-2">
                  <div className="flex gap-2">
                    {tabs.map((t) => {
                      const active = t === activeTab
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setActiveTab(t)}
                          className={`shrink-0 rounded-xl px-3 py-1.5 text-[11px] font-extrabold transition ${
                            active ? 'bg-primary text-white' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {t}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="-mx-4 overflow-x-auto px-4 pb-2">
                  <div className="flex gap-2.5">
                    {visibleNearby.slice(0, 10).map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => onPickStore(s)}
                        className="w-[220px] shrink-0 rounded-2xl border border-slate-100 bg-white px-3 py-3 text-left shadow-[0_1px_0_rgba(15,23,42,0.06)] hover:bg-slate-50"
                      >
                        <div className="flex items-start gap-2">
                          <div className="mt-0.5">
                            <BrandIcon client={s.client} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-extrabold text-slate-900">{s.store_name}</p>
                            <p className="mt-1 truncate text-[10px] font-bold uppercase text-primary/70">{s.client}</p>
                            <p className="mt-1 text-[10px] font-bold text-slate-500">{s.distanceKm.toFixed(1)} km away</p>
                            <p className="mt-1 truncate text-[10px] font-semibold text-slate-400">{s.city}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Spacer so bottom of sheet feels comfortable */}
          <div className="h-2" />
        </div>
      </div>
    </div>
  )
}

