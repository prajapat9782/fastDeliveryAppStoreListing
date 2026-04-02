import { CLIENT_ICON_URL } from '../constants/clients'

/**
 * Mobile: rider requirement (when city selected) + filter.
 * Desktop (md+): title + rider requirement + by-client chips when city selected.
 */
export default function TopNav({ onOpenFilters, city, riderTotal = 0, riderByClient = [] }) {
  const showRiderStrip = Boolean(city)
  const hasClientChips = showRiderStrip && riderByClient.length > 0

  return (
    <>
      <header className="shrink-0 border-b border-slate-200 bg-white md:hidden">
        <div className={`flex flex-col ${hasClientChips ? 'gap-0' : 'gap-2'} px-3 pb-3 pt-3`}>
          <div className="flex items-start gap-2.5">
            {showRiderStrip ? (
              <div className="flex min-w-0 flex-1 items-start gap-2.5">
                <div
                  className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15"
                  aria-hidden
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div className="min-w-0 flex-1 pt-0.5">
                  <p className="text-[10px] font-bold uppercase leading-none tracking-wide text-slate-500">
                    Rider requirement
                  </p>
                  <p className="mt-1.5 text-2xl font-black tabular-nums leading-none text-slate-900">
                    {Number(riderTotal).toLocaleString()}
                  </p>
                </div>
              </div>
            ) : (
              <div className="min-h-[2.5rem] min-w-0 flex-1" />
            )}

            <button
              type="button"
              onClick={onOpenFilters}
              className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm ring-1 ring-primary/15 hover:bg-primary/15"
              aria-label="Open filters"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4h18M6 10h12M10 16h4"
                />
              </svg>
            </button>
          </div>

          {hasClientChips && (
            <div className="border-t border-slate-100 pt-2.5">
              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wide text-slate-400">By client</p>
              <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {riderByClient.map(({ client, req }) => {
                  const src = CLIENT_ICON_URL[client]
                  return (
                    <span
                      key={client}
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[11px] font-semibold text-slate-800 shadow-sm"
                      title={`${client}: ${req}`}
                    >
                      {src ? (
                        <img src={src} alt="" className="h-5 w-5 shrink-0 rounded-full object-cover ring-1 ring-white" />
                      ) : null}
                      <span className="max-w-[88px] truncate">{client}</span>
                      <span className="font-mono text-sm font-bold text-primary tabular-nums">{req}</span>
                    </span>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </header>

      <header className="hidden shrink-0 border-b border-slate-200/80 bg-white shadow-sm md:block">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 md:px-6">
          <span className="text-lg font-bold tracking-tight text-slate-900">Store Locator</span>

          {showRiderStrip ? (
            <div className="flex min-w-0 flex-1 flex-col gap-3 lg:flex-row lg:items-center lg:justify-end lg:gap-6">
              <div className="flex items-start gap-2.5 lg:shrink-0">
                <div
                  className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15"
                  aria-hidden
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div className="min-w-0 pt-0.5">
                  <p className="text-[10px] font-bold uppercase leading-none tracking-wide text-slate-500">
                    Rider requirement
                  </p>
                  <p className="mt-1 text-2xl font-black tabular-nums leading-none text-slate-900">
                    {Number(riderTotal).toLocaleString()}
                  </p>
                </div>
              </div>

              {hasClientChips && (
                <div className="min-w-0 lg:max-w-[min(100%,720px)]">
                  <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wide text-slate-400">By client</p>
                  <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {riderByClient.map(({ client, req }) => {
                      const src = CLIENT_ICON_URL[client]
                      return (
                        <span
                          key={client}
                          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[11px] font-semibold text-slate-800 shadow-sm"
                          title={`${client}: ${req}`}
                        >
                          {src ? (
                            <img src={src} alt="" className="h-5 w-5 shrink-0 rounded-full object-cover ring-1 ring-white" />
                          ) : null}
                          <span className="max-w-[100px] truncate">{client}</span>
                          <span className="font-mono text-sm font-bold text-primary tabular-nums">{req}</span>
                        </span>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </header>
    </>
  )
}
