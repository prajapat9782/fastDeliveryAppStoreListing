import { useMemo, useState } from 'react'

function pad2(n) {
  return String(n).padStart(2, '0')
}

/**
 * Password rule:
 * - password = DDHH (day-of-month + 24h hour), both zero-padded
 * - Example: Apr 2, 1pm => day=02, hour=13 => "0213"
 *
 * Unlock persists for the current hour via localStorage.
 */
export default function LockGate({ children }) {
  const storageKey = useMemo(() => `store-locator:unlock:session`, [])
  const [unlocked, setUnlocked] = useState(() => {
    try {
      return window.sessionStorage.getItem(storageKey) === '1'
    } catch {
      return false
    }
  })

  const [value, setValue] = useState('')
  const [error, setError] = useState('')

  const getExpectedPassword = () => {
    const now = new Date()
    return `${pad2(now.getDate())}${pad2(now.getHours())}`
  }

  if (unlocked) return children

  return (
    <div className="flex h-screen items-center justify-center bg-surface px-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
        <h1 className="text-lg font-extrabold text-slate-900">Enter password</h1>

        <div className="mt-4">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Password</label>
          <input
            inputMode="numeric"
            autoFocus
            value={value}
            onChange={(e) => {
              setError('')
              setValue(e.target.value.replace(/[^\d]/g, '').slice(0, 4))
            }}
            onKeyDown={(e) => {
              if (e.key !== 'Enter') return
              if (value === getExpectedPassword()) {
                try {
                  window.sessionStorage.setItem(storageKey, '1')
                } catch {
                  // ignore
                }
                setUnlocked(true)
              } else {
                setError('Incorrect password')
              }
            }}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base font-semibold text-slate-900 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="••••"
            aria-label="Password"
          />
          {error && <p className="mt-2 text-sm font-semibold text-red-600">{error}</p>}
        </div>

        <button
          type="button"
          className="mt-4 w-full rounded-2xl bg-primary py-3 text-sm font-extrabold text-white shadow-sm hover:bg-primary-dark"
          onClick={() => {
            if (value === getExpectedPassword()) {
              try {
                window.sessionStorage.setItem(storageKey, '1')
              } catch {
                // ignore
              }
              setUnlocked(true)
            } else {
              setError('Incorrect password')
            }
          }}
        >
          Unlock
        </button>
      </div>
    </div>
  )
}

