import { useMemo, useState } from 'react'

const STATIC_PASSWORD = '123456'

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
    // Previously: DDHH (day + 24h hour). Now static password.
    return STATIC_PASSWORD
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
              setValue(e.target.value.replace(/[^\d]/g, '').slice(0, 6))
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

