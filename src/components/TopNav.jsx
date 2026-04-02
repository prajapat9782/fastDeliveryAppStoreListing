/**
 * Top bar: logo + nav (Map View, Add new store, Help center).
 */
export default function TopNav({
  onOpenFilters,
}) {
  return (
    <>
      {/* Mobile: filter icon only */}
      <header className="flex h-14 shrink-0 items-center justify-end gap-3 border-b border-slate-200/80 bg-white/80 px-4 backdrop-blur md:hidden">

        <button
          type="button"
          onClick={onOpenFilters}
          className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm ring-1 ring-primary/15 hover:bg-primary/15"
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
      </header>

      {/* Desktop: logo + nav */}
      <header className="hidden flex h-14 shrink-0 flex-wrap items-center gap-x-6 gap-y-2 border-b border-slate-200/80 bg-white px-4 shadow-sm md:flex md:px-6">
        <span className="text-lg font-bold tracking-tight text-slate-900">Store Locator</span>
      </header>
    </>
  )
}
