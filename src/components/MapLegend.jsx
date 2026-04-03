import { useMemo } from 'react'
import { CLIENT_COLORS, CLIENT_ICON_URL } from '../constants/clients'

/** Floating card on map — overall rider req per vendor (full dataset; ignores sidebar/map filters) */
export default function MapLegend({ riderTotal = 0, riderByClient = [] }) {
  const reqByClient = useMemo(() => {
    const m = new Map()
    for (const row of riderByClient) {
      if (row?.client != null) m.set(row.client, row.req)
    }
    return m
  }, [riderByClient])

  return (
    <div className="pointer-events-auto w-[220px] rounded-2xl border border-slate-100 bg-white p-4 shadow-float md:w-[228px]">
      <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">Map legend</p>
      <p className="mb-2 text-[11px] leading-snug text-slate-500">Overall rider requirement (all stores)</p>
      <p className="mb-3 font-mono text-xl font-black tabular-nums text-slate-900">{Number(riderTotal).toLocaleString()}</p>

      <ul className="space-y-2.5 border-t border-slate-100 pt-3">
        {Object.keys(CLIENT_COLORS).map((name) => {
          const hex = CLIENT_COLORS[name]
          const src = CLIENT_ICON_URL[name]
          const req = reqByClient.get(name)
          const n = req != null ? Number(req) : 0
          const hasReq = n > 0

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
                  hasReq ? 'text-primary' : 'text-slate-400'
                }`}
                title={`Overall rider req · ${name}`}
              >
                {n.toLocaleString()}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
