import { Link, router, usePage } from '@inertiajs/react'
import AdminLayout from '@/layouts/admin-layout'
import { useEffect, useMemo, useState } from 'react'
import * as React from 'react'
import { Eye, Pencil, Trash2, CheckCircle2, Filter } from 'lucide-react'

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

export default function Index() {
    const { forms, filters } = usePage<{ forms: Paginated<Row>; filters: any }>().props

    const [q, setQ] = useState(filters?.q ?? '')
    const [level, setLevel] = useState(filters?.level ?? '')
    const [read, setRead] = useState(filters?.read ?? '')
    const [per, setPer] = useState<number>(Number(filters?.per_page ?? 25))
    const [sort, setSort] = useState(filters?.sort ?? 'created_at')
    const [dir, setDir] = useState<'asc' | 'desc'>(filters?.dir === 'asc' ? 'asc' : 'desc')
    const [openFilters, setOpenFilters] = useState(false)

    const submit = (e?: React.FormEvent) => {
        e?.preventDefault()
        router.get(
            BASE,
            { q, level, read, per_page: per, sort, dir },
            { preserveState: true, replace: true }
        )
    }

    useEffect(() => {
        // zamknij „filtry” po zmianie listy
        setOpenFilters(false)
    }, [forms?.current_page, forms?.data?.length])

    const changeSort = (col: string) => {
        const next = sort === col ? (dir === 'asc' ? 'desc' : 'asc') : 'asc'
        setSort(col as any)
        setDir(next)
        router.get(BASE, { q, level, read, per_page: per, sort: col, dir: next }, { preserveState: true })
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
                    <div className="relative">
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
                            <div className="absolute right-0 z-20 mt-2 w-72 rounded-xl border bg-white p-3 shadow-lg">
                                <label className="block text-xs font-medium text-slate-600">Poziom języka</label>
                                <select
                                    className="mt-1 w-full rounded-md border bg-white px-2 py-1.5"
                                    value={level}
                                    onChange={(e) => setLevel(e.target.value)}
                                >
                                    <option value="">— dowolny —</option>
                                    <option>Brak języka</option>
                                    <option>Podstawowa</option>
                                    <option>Komunikatywna</option>
                                    <option>Bardzo dobra</option>
                                </select>

                                <label className="mt-3 block text-xs font-medium text-slate-600">Czy przeczytany</label>
                                <select
                                    className="mt-1 w-full rounded-md border bg-white px-2 py-1.5"
                                    value={read}
                                    onChange={(e) => setRead(e.target.value)}
                                >
                                    <option value="">— dowolnie —</option>
                                    <option value="1">Tak</option>
                                    <option value="0">Nie</option>
                                </select>

                                <label className="mt-3 block text-xs font-medium text-slate-600">Na stronę</label>
                                <select
                                    className="mt-1 w-full rounded-md border bg-white px-2 py-1.5"
                                    value={per}
                                    onChange={(e) => setPer(Number(e.target.value))}
                                >
                                    {[10, 25, 50, 100].map((n) => (
                                        <option key={n} value={n}>
                                            {n}
                                        </option>
                                    ))}
                                </select>

                                <div className="mt-3 flex justify-end">
                                    <button type="button" onClick={() => submit()} className="rounded-lg bg-mint px-3 py-1.5 font-semibold">
                                        Zastosuj
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    <button className="rounded-xl border px-3 py-2" type="submit">
                        Szukaj
                    </button>
                </form>

                {/* Tabela */}
                <div className="mt-4 overflow-x-auto rounded-xl border bg-white">
                    <table className="w-full table-auto text-sm min-w-[1300px]">

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
                                    <div className="flex h-12 items-center leading-none">{r.phone ?? '—'}</div>
                                </td>

                                <td className="px-4">
                                    <div className="flex h-12 items-center leading-none">{r.language_level ?? '—'}</div>
                                </td>

                                <td className="px-4">
                                    <div className="flex h-12 items-center leading-none">
                                        {new Date(r.created_at).toLocaleString('pl-PL', { timeZone: 'Europe/Warsaw' })}
                                    </div>
                                </td>

                                <td className="px-4">
                                    <div className="flex h-12 items-center justify-center">
                                        {r.is_read ? (
                                            <CheckCircle2 className="block h-5 w-5 text-emerald-600" />
                                        ) : (
                                            <span className="text-slate-400">—</span>
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
                                            onClick={() => router.patch(`${BASE}/${r.id}/toggle-read`, {}, { preserveScroll: true })}
                                            className="inline-flex h-8 w-8 items-center justify-center rounded border leading-none"
                                            title={r.is_read ? 'Oznacz jako nieprzeczytany' : 'Oznacz jako przeczytany'}
                                        >
                                            <CheckCircle2 className={`block h-4 w-4 ${r.is_read ? 'text-emerald-600' : 'text-slate-400'}`} />
                                        </button>

                                        <button
                                            onClick={() => {
                                                if (!confirm('Usunąć formularz?')) return
                                                router.delete(`${BASE}/${r.id}`, { preserveScroll: true })
                                            }}
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
                                    className={`rounded-md px-3 py-1 ${l.active ? 'bg-slate-200 font-semibold' : 'hover:bg-slate-50'} ${
                                        !l.url && 'pointer-events-none opacity-40'
                                    }`}
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
