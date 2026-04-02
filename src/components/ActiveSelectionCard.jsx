import { CLIENT_COLORS } from '../constants/clients'
import { formatAddressLine, ordersTodayFromId } from '../utils/selectionMeta'

/** Top-right floating card when a store is selected on the map */
export default function ActiveSelectionCard({ store }) {
  if (!store) return null

  const color = CLIENT_COLORS[store.client] ?? '#6D28D9'
  const orders =
    store.orders == null ? ordersTodayFromId(store.id) : Number(store.orders)
  const totalRaider = Number(store.totalRaider ?? 0)
  const totalRaiderReq = Number(store.totalRaiderReq ?? 0)
  const cpoCount = Number(store.cpo ?? 0)
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${store.lat},${store.lng}`

  return (
    <div className="relative pointer-events-auto w-[min(100%,320px)] rounded-2xl border border-slate-100 bg-white p-4 pr-14 shadow-float">
      <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Active selection</p>
      <h3 className="mt-1 text-lg font-bold leading-tight text-slate-900">{store.store_name}</h3>
      <p className="mt-1 text-sm text-slate-500">{formatAddressLine(store)}</p>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-slate-50 px-3 py-2">
          <p className="text-[10px] font-semibold uppercase text-slate-400">Orders</p>
          <p className="mt-0.5 text-sm font-semibold text-slate-800">{orders.toLocaleString()} today</p>
        </div>
        <div className="rounded-xl bg-slate-50 px-3 py-2">
          <p className="text-[10px] font-semibold uppercase text-slate-400">TotalRaider</p>
          <p className="mt-0.5 text-sm font-semibold text-slate-800">{totalRaider.toLocaleString()}</p>
        </div>
        <div className="rounded-xl bg-slate-50 px-3 py-2">
          <p className="text-[10px] font-semibold uppercase text-slate-400">Total Raider required</p>
          <p className="mt-0.5 text-sm font-semibold text-slate-800">{totalRaiderReq.toLocaleString()}</p>
        </div>
        <div className="rounded-xl bg-slate-50 px-3 py-2">
          <p className="text-[10px] font-semibold uppercase text-slate-400">CPO count</p>
          <p className="mt-0.5 text-sm font-semibold text-slate-800">{cpoCount.toLocaleString()}</p>
        </div>
      </div>

      <button
        type="button"
        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-xl text-primary transition hover:bg-primary-light"
        style={{ color }}
        aria-label="Open in Maps"
        onClick={() => {
          window.open(mapsUrl, '_blank', 'noopener,noreferrer')
        }}
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
