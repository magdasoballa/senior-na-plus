// resources/js/pages/Admin/messages/pl/forms/Index.tsx
import { Link, router, usePage } from '@inertiajs/react'
import AdminLayout from '@/layouts/admin-layout'
import * as React from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
    Eye,
    Pencil,
    Trash2,
    CheckCircle2,
    Filter,
    XCircle,
    MinusCircle,
} from 'lucide-react'

type Row = {
    id: number
    full_name: string
    email: string
    phone: string | null
    language_level: string | null
    is_read: boolean
    created_at: string
}

type Paginated<T> = {
    data: T[]
    links: { url: string | null; label: string; active: boolean }[]
    current_page: number
    last_page: number
    per_page: number
    total: number
}

const BASE = '/admin/messages/pl/forms'

const fmtDate = (s?: string | null) =>
    !s || Number.isNaN(new Date(s).getTime())
        ? '—'
        : new Date(s).toLocaleString('pl-PL', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        })

// opcje (dopasuj do backendu jeśli masz inne wartości)
const LEVEL_OPTS = ['Brak języka', 'Podstawowa', 'Komunikatywna', 'Bardzo dobra']
const EXP_OPTS = ['brak', '1–2 lata', '3–5 lat', 'powyżej 5 lat']

export default function Index() {
    const { forms, filters } = usePage<{ forms: Paginated<Row>; filters: any }>().props

    const [q, setQ] = useState<string>(filters?.q ?? '')
    const [level, setLevel] = useState<string>(filters?.level ?? '')
    const [experience, setExperience] = useState<string>(filters?.experience ?? '')
    const [read, setRead] = useState<string>(filters?.read ?? '') // '' | '1' | '0'
    const [per, setPer] = useState<number>(Number(filters?.per_page ?? 25))
    const [sort, setSort] = useState<string>(filters?.sort ?? 'created_at')
    const [dir, setDir] = useState<'asc' | 'desc'>(filters?.dir === 'asc' ? 'asc' : 'desc')

    const [openFilters, setOpenFilters] = useState(false)
    const popRef = useRef<HTMLDivElement | null>(null)

    // zamykaj popover na klik poza i na ESC
    useEffect(() => {
        const onClick = (e: MouseEvent) => {
            if (!popRef.current) return
            if (!popRef.current.contains(e.target as Node)) setOpenFilters(false)
        }
        const onEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpenFilters(false)
        }
        document.addEventListener('mousedown', onClick)
        document.addEventListener('keydown', onEsc)
        return () => {
            document.removeEventListener('mousedown', onClick)
            document.removeEventListener('keydown', onEsc)
        }
    }, [])

    // zamykaj po przeładowaniu listy
    useEffect(() => setOpenFilters(false), [forms?.current_page, forms?.data?.length])

    const submit = (e?: React.FormEvent) => {
        e?.preventDefault()
        router.get(
            BASE,
            { q, level, experience, read, per_page: per, sort, dir },
            { preserveState: true, replace: true }
        )
    }

    const resetFilters = () => {
        setLevel('')
        setExperience('')
        setRead('')
        setPer(25)
        router.get(BASE, { q, sort, dir }, { preserveState: true, replace: true })
    }

    const changeSort = (col: string) => {
        const next = sort === col ? (dir === 'asc' ? 'desc' : 'asc') : 'asc'
        setSort(col)
        setDir(next)
        router.get(BASE, { q, level, experience, read, per_page: per, sort: col, dir: next }, { preserveState: true })
    }

    const destroyRow = (id: number) => {
        if (!confirm('Usunąć formularz?')) return
        router.delete(`${BASE}/${id}`, { preserveScroll: true })
    }

    const H = ({ col, children }: { col: string; children: React.ReactNode }) => (
        <button onClick={() => changeSort(col)} className="inline-flex items-center gap-1">
            <span>{children}</span>
            <span className="text-slate-400">
        {sort === col ? (dir === 'asc' ? '▴' : '▾') : <span className="opacity-40">↕</span>}
      </span>
        </button>
    )

    return (
        <AdminLayout>
            <main className="p-6">
                <div className="text-sm text-slate-500">Wiadomości</div>
                <p className="mt-1 text-2xl font-bold">Formularze (pl)</p>

                {/* Szukaj + filtry */}
                <form onSubmit={submit} className="mt-4 flex items-center gap-3">
                    <div className="relative w-full max-w-xl">
                        <input
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="Szukaj"
                            className="w-full rounded-full border bg-white px-4 py-2 pl-10"
                        />
                        <span className="pointer-events-none absolute left-3 top-2.5">🔎</span>
                    </div>

                    {/* Popover z filtrami */}
                    <div className="relative" ref={popRef}>
                        <button
                            type="button"
                            onClick={() => setOpenFilters((v) => !v)}
                            className="rounded-xl border px-3 py-2"
                            aria-expanded={openFilters}
                            aria-label="Pokaż filtry"
                        >
                            <Filter className="h-4 w-4" />
                        </button>

                        {openFilters && (
                            <div className="absolute right-0 z-20 mt-2 w-80">
                                {/* caret */}
                                <div className="relative">
                                    <div className="absolute -top-2 right-6 h-4 w-4 rotate-45 border-l border-t border-slate-200 bg-white" />
                                </div>

                                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
                                    <div className="space-y-4">
                                        {/* POZIOM JĘZYKA */}
                                        <div>
                                            <div className="mb-1 text-[11px] font-semibold uppercase text-slate-500">
                                                Poziom języka
                                            </div>
                                            <select
                                                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                                                value={level}
                                                onChange={(e) => setLevel(e.target.value)}
                                            >
                                                <option value="">{'Kliknij aby wybrać'}</option>
                                                {LEVEL_OPTS.map((v) => (
                                                    <option key={v} value={v}>
                                                        {v}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* DOŚWIADCZENIE */}
                                        <div>
                                            <div className="mb-1 text-[11px] font-semibold uppercase text-slate-500">
                                                Doświadczenie
                                            </div>
                                            <select
                                                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                                                value={experience}
                                                onChange={(e) => setExperience(e.target.value)}
                                            >
                                                <option value="">{'Kliknij aby wybrać'}</option>
                                                {EXP_OPTS.map((v) => (
                                                    <option key={v} value={v}>
                                                        {v}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* CZY PRZECZYTANY — tri-state ikonami */}
                                        <div>
                                            <div className="mb-1 text-[11px] font-semibold uppercase text-slate-500">
                                                Czy przeczytany
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setRead('')}
                                                    aria-pressed={read === ''}
                                                    className={`inline-flex h-8 w-8 items-center justify-center rounded-full border ${
                                                        read === '' ? 'border-slate-300 bg-slate-100 text-slate-600' : 'border-slate-300 text-slate-400 hover:bg-slate-50'
                                                    }`}
                                                    title="Wszystkie"
                                                >
                                                    <MinusCircle className="h-4 w-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setRead('1')}
                                                    aria-pressed={read === '1'}
                                                    className={`inline-flex h-8 w-8 items-center justify-center rounded-full border ${
                                                        read === '1' ? 'border-emerald-300 bg-emerald-50 text-emerald-600' : 'border-slate-300 text-emerald-600 hover:bg-emerald-50/40'
                                                    }`}
                                                    title="Tak"
                                                >
                                                    <CheckCircle2 className="h-4 w-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setRead('0')}
                                                    aria-pressed={read === '0'}
                                                    className={`inline-flex h-8 w-8 items-center justify-center rounded-full border ${
                                                        read === '0' ? 'border-rose-300 bg-rose-50 text-rose-600' : 'border-slate-300 text-rose-600 hover:bg-rose-50/40'
                                                    }`}
                                                    title="Nie"
                                                >
                                                    <XCircle className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* NA STRONĘ */}
                                        <div>
                                            <div className="mb-1 text-[11px] font-semibold uppercase text-slate-500">
                                                Na stronę
                                            </div>
                                            <select
                                                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                                                value={per}
                                                onChange={(e) => setPer(Number(e.target.value))}
                                            >
                                                {[10, 25, 50, 100].map((n) => (
                                                    <option key={n} value={n}>
                                                        {n}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                type="button"
                                                onClick={resetFilters}
                                                className="rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50"
                                            >
                                                Wyczyść
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => submit()}
                                                className="rounded-md bg-teal-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-teal-600"
                                            >
                                                Zastosuj
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>


                </form>

                {/* Tabela */}
                <div className="mt-4 overflow-x-auto rounded-xl border bg-white">
                    <table className="min-w-[1300px] w-full table-auto text-sm">
                        <thead className="bg-slate-50 text-slate-600">
                        <tr>
                            <th className="w-16 px-4">
                                <H col="id">ID</H>
                            </th>
                            <th className="px-4">
                                <H col="full_name">IMIĘ I NAZWISKO</H>
                            </th>
                            <th className="px-4">
                                <H col="email">E-MAIL</H>
                            </th>
                            <th className="px-4">
                                <H col="phone">TELEFON</H>
                            </th>
                            <th className="px-4">
                                <H col="language_level">POZIOM JĘZYKA</H>
                            </th>
                            <th className="px-4">
                                <H col="created_at">DATA WYSŁANIA</H>
                            </th>
                            <th className="w-40 px-4 text-center">CZY PRZECZYTANY</th>
                            <th className="w-28 px-4 text-right">AKCJE</th>
                        </tr>
                        </thead>

                        <tbody>
                        {forms.data.map((r) => (
                            <tr key={r.id} className="border-t">
                                <td className="px-4">
                                    <div className="flex h-12 items-center leading-none">
                                        <Link href={`${BASE}/${r.id}`} className="font-mono text-teal-600">
                                            {r.id}
                                        </Link>
                                    </div>
                                </td>

                                <td className="px-4">
                                    <div className="flex h-12 items-center leading-none">{r.full_name}</div>
                                </td>

                                <td className="px-4">
                                    <div className="flex h-12 items-center leading-none">
                                        <a href={`mailto:${r.email}`} className="text-sky-700 hover:underline">
                                            {r.email}
                                        </a>
                                    </div>
                                </td>

                                <td className="px-4">
                                    <div className="flex h-12 items-center leading-none whitespace-nowrap">{r.phone ?? '—'}</div>
                                </td>

                                <td className="px-4">
                                    <div className="flex h-12 items-center leading-none">{r.language_level ?? '—'}</div>
                                </td>

                                <td className="px-4">
                                    <div className="flex h-12 items-center leading-none whitespace-nowrap">
                                        {fmtDate(r.created_at)}
                                    </div>
                                </td>

                                <td className="px-4">
                                    <div className="flex h-12 items-center justify-center">
                                        {r.is_read ? (
                                            <CheckCircle2 className="block h-5 w-5 text-emerald-600" />
                                        ) : (
                                            <XCircle className="h-5 w-5 text-rose-600" aria-hidden />
                                        )}
                                    </div>
                                </td>

                                <td className="px-4">
                                    <div className="flex h-12 items-center justify-end gap-2 leading-none">
                                        <Link
                                            href={`${BASE}/${r.id}`}
                                            className="inline-flex h-8 w-8 items-center justify-center rounded border leading-none"
                                            title="Podgląd"
                                        >
                                            <Eye className="block h-4 w-4" />
                                        </Link>
                                        <Link
                                            href={`${BASE}/${r.id}/edit`}
                                            className="inline-flex h-8 w-8 items-center justify-center rounded border leading-none"
                                            title="Edytuj"
                                        >
                                            <Pencil className="block h-4 w-4" />
                                        </Link>
                                        <button
                                            onClick={() =>
                                                router.patch(`${BASE}/${r.id}/toggle-read`, {}, { preserveScroll: true })
                                            }
                                            className="inline-flex h-8 w-8 items-center justify-center rounded border leading-none"
                                            title={r.is_read ? 'Oznacz jako nieprzeczytany' : 'Oznacz jako przeczytany'}
                                        >
                                            <CheckCircle2
                                                className={`block h-4 w-4 ${r.is_read ? 'text-emerald-600' : 'text-slate-400'}`}
                                            />
                                        </button>
                                        <button
                                            onClick={() => destroyRow(r.id)}
                                            className="inline-flex h-8 w-8 items-center justify-center rounded border leading-none"
                                            title="Usuń"
                                        >
                                            <Trash2 className="block h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {forms.data.length === 0 && (
                            <tr>
                                <td className="px-4 py-8 text-center text-slate-500" colSpan={8}>
                                    Brak rekordów
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>

                    {/* Paginacja */}
                    <div className="flex items-center justify-between border-t px-4 py-3 text-sm text-slate-600">
                        <span>{rangeInfo(forms)}</span>
                        <nav className="flex items-center gap-1">
                            {forms.links.map((l, i) => (
                                <Link
                                    key={i}
                                    href={l.url ?? '#'}
                                    preserveScroll
                                    className={`rounded-md px-3 py-1 ${
                                        l.active ? 'bg-slate-200 font-semibold' : 'hover:bg-slate-50'
                                    } ${!l.url && 'pointer-events-none opacity-40'}`}
                                >
                                    {sanitize(l.label)}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>
            </main>
        </AdminLayout>
    )
}

function sanitize(s: string) {
    return s.replace(/&laquo;|&raquo;/g, '').trim()
}
function rangeInfo(p: Paginated<any>) {
    if (p.total === 0) return '0-0 z 0'
    const a = (p.current_page - 1) * p.per_page + 1
    const b = Math.min(p.current_page * p.per_page, p.total)
    return `${a}-${b} z ${p.total}`
}
