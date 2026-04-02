import { CLIENT_COLORS, CLIENT_ICON_URL } from '../constants/clients'

function ClientLogo({ client, size = 'sm' }) {
  const src = CLIENT_ICON_URL[client]
  const color = CLIENT_COLORS[client] ?? '#64748b'
  const wh = size === 'sm' ? 'h-6 w-6' : 'h-7 w-7'
  if (!src) {
    return (
      <span className={`flex ${wh} shrink-0 items-center justify-center rounded-full border border-white text-[10px] font-bold text-white`} style={{ backgroundColor: color }}>
        {client?.[0] ?? '?'}
      </span>
    )
  }
  return (
    <span className={`flex ${wh} shrink-0 overflow-hidden rounded-full border-2 border-white`} style={{ backgroundColor: color }}>
      <img src={src} alt="" className="h-full w-full object-cover" />
    </span>
  )
}

export function RiderRequirementSidebar({ cityName, total, byClient }) {
  if (!cityName) return null
  return (
    <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Rider requirement</p>
      <p className="mt-1 text-xs text-slate-500">{cityName}</p>
      <p className="mt-2 text-2xl font-black text-slate-900">{total.toLocaleString()}</p>
      <p className="text-[11px] font-medium text-slate-500">Total required (all clients)</p>
      {byClient.length > 0 && (
        <ul className="mt-3 space-y-2 border-t border-slate-200/80 pt-3">
          {byClient.map(({ client, req }) => (
            <li key={client} className="flex items-center justify-between gap-2 text-sm">
              <span className="flex min-w-0 items-center gap-2">
                <ClientLogo client={client} />
                <span className="truncate font-semibold text-slate-800">{client}</span>
              </span>
              <span className="shrink-0 font-mono text-sm font-bold text-primary">{req.toLocaleString()}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function RiderRequirementLegend({ cityName, total, byClient }) {
  if (!cityName) return null
  return (
    <div className="mt-3 border-t border-slate-100 pt-3">
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Rider req · {cityName}</p>
      <p className="mt-1 text-lg font-black text-slate-900">{total.toLocaleString()}</p>
      {byClient.length > 0 && (
        <ul className="mt-2 space-y-1.5">
          {byClient.map(({ client, req }) => (
            <li key={client} className="flex items-center justify-between gap-2 text-[11px] font-medium text-slate-700">
              <span className="flex min-w-0 items-center gap-1.5">
                <ClientLogo client={client} size="sm" />
                <span className="truncate">{client}</span>
              </span>
              <span className="font-mono font-bold text-primary">{req.toLocaleString()}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
