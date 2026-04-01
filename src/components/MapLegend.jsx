import { CLIENT_COLORS, CLIENT_ICON_URL } from '../constants/clients'

/** Floating card on map — brand logos + names */
export default function MapLegend() {
  return (
    <div className="pointer-events-auto w-[200px] rounded-2xl border border-slate-100 bg-white p-4 shadow-float">
      <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Map legend</p>
      <ul className="space-y-2.5">
        {Object.keys(CLIENT_COLORS).map((name) => {
          const hex = CLIENT_COLORS[name]
          const src = CLIENT_ICON_URL[name]
          return (
            <li key={name} className="flex items-center gap-2.5 text-xs font-medium text-slate-700">
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white"
                style={{ backgroundColor: hex }}
              >
                {src ? (
                  <img src={src} alt="" className="h-full w-full object-cover" />
                ) : null}
              </span>
              {name}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
