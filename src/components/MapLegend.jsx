import { CLIENT_COLORS, CLIENT_ICON_URL } from '../constants/clients'
import { RiderRequirementLegend } from './RiderRequirementSummary'

/** Floating card on map — brand logos + names + optional rider requirement for selected city */
export default function MapLegend({ cityName, riderTotal, riderByClient }) {
  return (
    <div className="pointer-events-auto w-[220px] rounded-2xl border border-slate-100 bg-white p-4 shadow-float md:w-[200px]">
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
      <RiderRequirementLegend cityName={cityName} total={riderTotal} byClient={riderByClient} />
    </div>
  )
}
