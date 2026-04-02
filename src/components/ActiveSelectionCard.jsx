import { CLIENT_COLORS } from '../constants/clients'
import { formatAddressLine } from '../utils/selectionMeta'

/** Top-right floating card when a store is selected on the map */
export default function ActiveSelectionCard({ store, compact = false }) {
  if (!store) return null

  const color = CLIENT_COLORS[store.client] ?? '#6D28D9'
  const totalRaider = Number(store.totalRaider ?? 0)
  const totalRaiderReq = Number(store.totalRaiderReq ?? 0)
  const earningPerHour = store.earningPerHour
  const joiningBonus = store.joiningBonus
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${store.lat},${store.lng}`

  const formatLooseValue = (v) => {
    if (v == null) return '—'
    const s = String(v).trim()
    if (!s) return '—'
    const n = Number(s.replace(/,/g, ''))
    if (Number.isFinite(n)) return n.toLocaleString()
    return s
  }

  return (
    <div
      className={`relative pointer-events-auto border-slate-100 bg-white ${
        compact
          ? 'w-full max-w-none rounded-none border-0 border-b border-slate-100 p-3 pr-12 shadow-none'
          : 'w-[min(100%,320px)] rounded-2xl border p-4 pr-14 shadow-float'
      }`}
    >
      <p className={`font-bold uppercase tracking-widest text-primary ${compact ? 'text-[9px]' : 'text-[10px]'}`}>
        Active selection
      </p>
      <h3 className={`mt-0.5 font-bold leading-tight text-slate-900 ${compact ? 'text-sm' : 'text-lg'}`}>
        {store.store_name}
      </h3>
      <p className={`text-slate-500 ${compact ? 'mt-0.5 text-xs' : 'mt-1 text-sm'}`}>{formatAddressLine(store)}</p>

      <div className={`grid grid-cols-2 ${compact ? 'mt-2 gap-1.5' : 'mt-4 gap-2'}`}>
        <div className={`rounded-xl bg-slate-50 px-2 py-1.5 ${compact ? '' : 'px-3 py-2'}`}>
          <p className={`font-semibold uppercase text-slate-400 ${compact ? 'text-[9px]' : 'text-[10px]'}`}>Total Rider</p>
          <p className={`font-semibold text-slate-800 ${compact ? 'text-xs' : 'text-sm'}`}>{totalRaider.toLocaleString()}</p>
        </div>
        <div className={`rounded-xl bg-slate-50 px-2 py-1.5 ${compact ? '' : 'px-3 py-2'}`}>
          <p className={`font-semibold uppercase text-slate-400 ${compact ? 'text-[9px]' : 'text-[10px]'}`}>Total Rider Req</p>
          <p className={`font-semibold text-slate-800 ${compact ? 'text-xs' : 'text-sm'}`}>{totalRaiderReq.toLocaleString()}</p>
        </div>
        <div className={`rounded-xl bg-slate-50 px-2 py-1.5 ${compact ? '' : 'px-3 py-2'}`}>
          <p className={`font-semibold uppercase text-slate-400 ${compact ? 'text-[9px]' : 'text-[10px]'}`}>Earning per hour</p>
          <p className={`font-semibold text-slate-800 ${compact ? 'text-xs' : 'text-sm'}`}>{formatLooseValue(earningPerHour)}</p>
        </div>
        <div className={`rounded-xl bg-slate-50 px-2 py-1.5 ${compact ? '' : 'px-3 py-2'}`}>
          <p className={`font-semibold uppercase text-slate-400 ${compact ? 'text-[9px]' : 'text-[10px]'}`}>Joining bonus</p>
          <p className={`font-semibold text-slate-800 ${compact ? 'text-xs' : 'text-sm'}`}>{formatLooseValue(joiningBonus)}</p>
        </div>
      </div>

      <button
        type="button"
        className={`absolute flex items-center justify-center rounded-xl text-primary transition hover:bg-primary-light ${
          compact ? 'right-2 top-2 h-8 w-8' : 'right-3 top-3 h-9 w-9'
        }`}
        style={{ color }}
        aria-label="Open in Maps"
        onClick={() => {
          window.open(mapsUrl, '_blank', 'noopener,noreferrer')
        }}
      >
        <svg className={compact ? 'h-4 w-4' : 'h-5 w-5'} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
    </div>
  )
}
