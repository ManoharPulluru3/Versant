import { useEffect, useState } from 'react'

export function Page({ children }) {
  return <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 p-5 sm:p-8">{children}</div>
}

export function Panel({ title, subtitle, action, children }) {
  return (
    <section className="rounded-[24px] border border-[#E5E8E2] bg-white p-5">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold tracking-tight">{title}</h2>
          {subtitle ? <p className="mt-1 text-sm text-muted">{subtitle}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}

export function Button({ children, tone = 'brand', className = '', ...props }) {
  const tones = {
    brand: 'bg-brand text-white',
    ghost: 'border border-[#E2E7E0] bg-white text-dark',
    danger: 'bg-[#FDEFE7] text-[#B65F39]',
  }
  return (
    <button
      type="button"
      className={`inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-extrabold disabled:opacity-50 ${tones[tone]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold text-muted">{label}</span>
      {children}
    </label>
  )
}

export const inputClass =
  'h-11 w-full rounded-xl border border-[#E5E8E2] bg-[#F8F9F5] px-3 text-sm font-semibold outline-none focus:border-brand'

export function Notice({ children }) {
  return <p className="rounded-2xl bg-[#FDEFE7] px-4 py-3 text-sm font-semibold text-[#B65F39]">{children}</p>
}

export function useLoad(load, deps = []) {
  const [state, setState] = useState({ loading: true, error: '', data: null })

  useEffect(() => {
    let active = true
    setState((current) => ({ ...current, loading: true, error: '' }))
    load()
      .then((data) => {
        if (active) setState({ loading: false, error: '', data })
      })
      .catch((error) => {
        if (active) setState({ loading: false, error: error.message, data: null })
      })
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return state
}

export function useReload(load) {
  const [tick, setTick] = useState(0)
  const state = useLoad(load, [tick])
  return { ...state, reload: () => setTick((value) => value + 1) }
}
