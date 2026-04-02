import { useMemo } from 'react'
import { CLIENT_COLORS, CLIENT_ICON_URL } from '../constants/clients'

/** Floating card on map — brand logos, names, and rider req per vendor (when a city is selected) */
export default function MapLegend({ riderByClient = [], citySelected = false }) {
  const reqByClient = useMemo(() => {
    const m = new Map()
    for (const row of riderByClient) {
      if (row?.client != null) m.set(row.client, row.req)
    }
    return m
  }, [riderByClient])

  return (
    <div className="pointer-events-auto w-[220px] rounded-2xl border border-slate-100 bg-white p-4 shadow-float md:w-[220px]">
      <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Map legend</p>
      <ul className="space-y-2.5">
        {Object.keys(CLIENT_COLORS).map((name) => {
          const hex = CLIENT_COLORS[name]
          const src = CLIENT_ICON_URL[name]
          const req = reqByClient.get(name)
          const n = req != null ? Number(req) : 0
          const hasReq = citySelected && n > 0

          return (
            <li key={name} className="flex items-center justify-between gap-2 text-xs font-medium text-slate-700">
              <span className="flex min-w-0 items-center gap-2.5">
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white"
                  style={{ backgroundColor: hex }}
                >
                  {src ? (
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  ) : null}
                </span>
                <span className="truncate">{name}</span>
              </span>
              <span
                className={`shrink-0 font-mono text-[11px] font-bold tabular-nums ${
                  !citySelected ? 'text-slate-300' : hasReq ? 'text-primary' : 'text-slate-400'
                }`}
                title={citySelected ? `Rider req · ${name}` : 'Select a city in filters'}
              >
                {citySelected ? n.toLocaleString() : '—'}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
