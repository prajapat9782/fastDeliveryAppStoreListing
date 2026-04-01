/**
 * Top bar: logo + nav (Map View, Add new store, Help center).
 */
export default function TopNav() {
  return (
    <header className="flex h-14 shrink-0 flex-wrap items-center gap-x-6 gap-y-2 border-b border-slate-200/80 bg-white px-4 shadow-sm md:px-6">
      <span className="text-lg font-bold tracking-tight text-slate-900">Store Locator</span>
      <nav className="flex flex-wrap items-center gap-1">
        <button
          type="button"
          className="relative px-3 py-2 text-sm font-semibold text-primary after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:rounded-full after:bg-primary after:content-['']"
        >
          Map View
        </button>
        <button
          type="button"
          className="px-3 py-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
          onClick={() => {
            /* wire to modal / route later */
          }}
        >
          Add new store
        </button>
        <a
          href="#help"
          className="px-3 py-2 text-sm font-medium text-slate-600 transition hover:text-primary"
          onClick={(e) => e.preventDefault()}
        >
          Help center
        </a>
      </nav>
    </header>
  )
}
