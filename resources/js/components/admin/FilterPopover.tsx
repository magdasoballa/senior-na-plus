// resources/js/components/admin/FilterPopover.tsx
import React, { useEffect, useRef } from 'react'
import { CheckCircle2, MinusCircle, XCircle } from 'lucide-react'

/* ======================== FilterPopover ========================= */
export function FilterPopover({
                                  open,
                                  setOpen,
                                  children,
                                  onApply,
                                  onReset,
                                  width = 'w-80', // możesz nadpisać np. 'w-96' albo 'w-[28rem]'
                              }: {
    open: boolean
    setOpen: (v: boolean) => void
    children: React.ReactNode
    onApply: () => void
    onReset: () => void
    width?: string
}) {
    const ref = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const onDown = (e: MouseEvent) => {
            if (!ref.current) return
            if (!ref.current.contains(e.target as Node)) setOpen(false)
        }
        const onEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false)
        }
        document.addEventListener('mousedown', onDown)
        document.addEventListener('keydown', onEsc)
        return () => {
            document.removeEventListener('mousedown', onDown)
            document.removeEventListener('keydown', onEsc)
        }
    }, [setOpen])

    if (!open) return null

    return (
        <div ref={ref} className={`absolute right-0 z-20 mt-2 ${width}`}>
            {/* caret / ogonek */}
            <div className="relative">
                <div className="absolute -top-2 right-6 h-4 w-4 rotate-45 border-l border-t border-slate-200 bg-white" />
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
                <div className="space-y-4">{children}</div>

                <div className="mt-4 flex items-center justify-end gap-2">
                    <button
                        type="button"
                        onClick={onReset}
                        className="rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50"
                    >
                        Wyczyść
                    </button>
                    <button
                        type="button"
                        onClick={onApply}
                        className="rounded-md bg-teal-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-teal-600"
                    >
                        Zastosuj
                    </button>
                </div>
            </div>
        </div>
    )
}

/* =========================== FilterRow ========================== */
export function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <div className="mb-1 text-[11px] font-semibold uppercase text-slate-500">{label}</div>
            {children}
        </div>
    )
}

/* ============================= Select ========================== */
export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
    const { className = '', ...rest } = props
    return (
        <select
            {...rest}
            className={
                'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200 ' +
                className
            }
        />
    )
}

/* ========================== TriStateRead ======================= */
/**
 * Kontrolowany tri-state:
 * - value jest jedną z wartości z `map` (all/yes/no).
 * - kliknięcie w aktywną ikonę „Tak” lub „Nie” przywraca stan „Wszystkie”.
 * - zawsze podświetlona jest tylko jedna ikona.
 */
// --- tylko fragment: podmień istniejący TriStateRead ---
export function TriStateRead({
                                 value,
                                 onChange,
                                 map = { all: 'all', yes: 'yes', no: 'no' },
                             }: {
    value: string | number | boolean
    onChange: (v: string) => void
    map?: { all: string | number | boolean; yes: string | number | boolean; no: string | number | boolean }
}) {
    // porównujemy po stringach, by uniknąć '1' vs 1
    const v = String(value)
    const M = { all: String(map.all), yes: String(map.yes), no: String(map.no) }

    const isAll = v === M.all
    const isYes = v === M.yes
    const isNo  = v === M.no

    const choose = (target: 'all' | 'yes' | 'no') => {
        // klik w już aktywną pozycję -> wracamy do "all"
        if ((target === 'all' && isAll) || (target === 'yes' && isYes) || (target === 'no' && isNo)) {
            onChange(String(M.all))
        } else {
            onChange(String(M[target]))
        }
    }

    const btn = (active: boolean, activeCls: string, inactiveCls: string) =>
        `inline-flex h-8 w-8 items-center justify-center rounded-full border transition-colors ${
            active ? activeCls : inactiveCls
        }`

    return (
        <div role="radiogroup" aria-label="Czy przeczytany" className="flex items-center gap-2">
            <button
                type="button"
                role="radio"
                aria-checked={isAll}
                onClick={() => choose('all')}
                className={btn(isAll, 'border-slate-300 bg-slate-100 text-slate-600', 'border-slate-300 text-slate-400 hover:bg-slate-50')}
                title="Wszystkie"
            >
                <MinusCircle className="h-4 w-4" />
            </button>

            <button
                type="button"
                role="radio"
                aria-checked={isYes}
                onClick={() => choose('yes')}
                className={btn(isYes, 'border-emerald-300 bg-emerald-50 text-emerald-600', 'border-slate-300 text-emerald-600 hover:bg-emerald-50/40')}
                title="Tak"
            >
                <CheckCircle2 className="h-4 w-4" />
            </button>

            <button
                type="button"
                role="radio"
                aria-checked={isNo}
                onClick={() => choose('no')}
                className={btn(isNo, 'border-rose-300 bg-rose-50 text-rose-600', 'border-slate-300 text-rose-600 hover:bg-rose-50/40')}
                title="Nie"
            >
                <XCircle className="h-4 w-4" />
            </button>
        </div>
    )
}

