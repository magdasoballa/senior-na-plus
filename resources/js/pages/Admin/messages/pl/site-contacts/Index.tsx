import AdminLayout from '@/layouts/admin-layout'
import { Link, router, usePage } from '@inertiajs/react'
import * as React from 'react'
import { useEffect, useRef, useState } from 'react'
import { Eye, Trash2, Pencil, CheckCircle2, Filter, XCircle, X } from 'lucide-react'
import { FilterPopover, FilterRow, Select, TriStateRead } from '@/components/admin/FilterPopover'

type Row = {
    id: number
    full_name: string
    email: string
    phone: string
    subject: string
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

type FilterState = {
    q?: string
    sort?: string
    dir?: 'asc' | 'desc'
    read?: 'all' | 'yes' | 'no'
    per_page?: number
}

const BASE = '/admin/messages/pl/site-contacts'

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

export default function Index() {
    const { contacts, filters } = usePage<{ contacts: Paginated<Row>; filters: FilterState }>().props

    const [q, setQ] = useState(filters?.q ?? '')
    const [sort, setSort] = useState(filters?.sort ?? 'created_at')
    const [dir, setDir] = useState<'asc' | 'desc'>((filters?.dir as any) ?? 'desc')
    const [read, setRead] = useState<'all' | 'yes' | 'no'>(filters?.read ?? 'all')
    const [perPage, setPerPage] = useState<number>(Number(filters?.per_page) || contacts.per_page || 25)

    const [filtersOpen, setFiltersOpen] = useState(false)
    const popRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const onClick = (e: MouseEvent) => {
            if (!popRef.current) return
            if (!popRef.current.contains(e.target as Node)) setFiltersOpen(false)
        }
        const onEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setFiltersOpen(false)
        }
        document.addEventListener('mousedown', onClick)
        document.addEventListener('keydown', onEsc)
        return () => {
            document.removeEventListener('mousedown', onClick)
            document.removeEventListener('keydown', onEsc)
        }
    }, [])

    const submit = (e?: React.FormEvent) => {
        e?.preventDefault()
        router.get(BASE, { q, sort, dir, read, per_page: perPage }, { preserveState: true, replace: true })
    }

    const resetFilters = () => {
        setRead('all')
        setPerPage(25)
        router.get(BASE, { q, sort, dir }, { preserveState: true, replace: true })
    }

    // DODANA FUNKCJA: Czyszczenie wyszukiwarki
    const clearSearch = () => {
        setQ('')
        router.get(BASE, { sort, dir, read, per_page: perPage }, { preserveState: true, replace: true })
    }

    const changeSort = (col: string) => {
        const next = sort === col ? (dir === 'asc' ? 'desc' : 'asc') : 'asc'
        setSort(col as any)
        setDir(next as any)
        router.get(BASE, { q, sort: col, dir: next, read, per_page: perPage }, { preserveState: true })
    }

    const destroyRow = (id: number) => {
        if (!confirm('Usunąć wpis?')) return
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
            <main className="mx-auto max-w-[110rem] p-6">
                <p className="mt-1 text-2xl font-bold">Kontakty Strona (pl)</p>

                {/* Szukaj + filtry */}
                <div className="mt-4 flex flex-wrap items-center gap-3">
                    <form onSubmit={submit} className="flex items-center gap-3">
                        <div className="relative w-full md:w-[36rem] max-w-xl">
                            <input
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                placeholder="Szukaj"
                                className="w-full rounded-full border bg-white px-4 py-2 pl-10 pr-10"
                            />
                            <span className="pointer-events-none absolute left-3 top-2.5">🔎</span>

                            {/* DODANY PRZYCISK CZYSZCZENIA */}
                            {q && (
                                <button
                                    type="button"
                                    onClick={clearSearch}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    title="Wyczyść wyszukiwanie"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    </form>

                    <div className="relative" ref={popRef}>
                        <button onClick={() => setFiltersOpen((v) => !v)} aria-expanded={filtersOpen} className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-slate-50">
                            <Filter className="h-4 w-4" />
                            <span>Filtry</span>
                        </button>

                        <FilterPopover open={filtersOpen} setOpen={setFiltersOpen} onApply={() => submit()} onReset={resetFilters}>
                            <FilterRow label="Czy przeczytany">
                                <TriStateRead value={read} onChange={(v) => setRead(v as any)} map={{ all: 'all', yes: 'yes', no: 'no' }} />
                            </FilterRow>

                            <FilterRow label="Na stronę">
                                <Select value={perPage} onChange={(e) => setPerPage(Number(e.target.value))}>
                                    {[10, 25, 50, 100].map((n) => (
                                        <option key={n} value={n}>
                                            {n}
                                        </option>
                                    ))}
                                </Select>
                            </FilterRow>
                        </FilterPopover>
                    </div>
                </div>

                {/* Tabela */}
                <div className="relative mt-4 overflow-x-auto rounded-xl border bg-white">
                    <table className="w-full table-auto text-sm">
                        <thead className="bg-slate-50 text-slate-600">
                        <tr>
                            <th className="w-16 px-5 py-3">
                                <H col="id">ID</H>
                            </th>
                            <th className="min-w-[200px] px-5 py-3">
                                <H col="full_name">IMIĘ I NAZWISKO</H>
                            </th>
                            <th className="min-w-[260px] px-5 py-3">
                                <H col="email">E-MAIL</H>
                            </th>
                            <th className="min-w-[170px] px-5 py-3">
                                <H col="phone">TELEFON</H>
                            </th>
                            <th className="min-w-[240px] px-5 py-3">
                                <H col="subject">TEMAT</H>
                            </th>
                            <th className="min-w-[190px] px-5 py-3">
                                <H col="created_at">DATA WYSŁANIA</H>
                            </th>
                            <th className="w-40 px-5 py-3 text-center">CZY PRZECZYTANY</th>
                            <th className="w-28 px-5 py-3 text-right">AKCJE</th>
                        </tr>
                        </thead>

                        <tbody className="[&>tr]:border-t">
                        {contacts.data.map((r) => (
                            <tr key={r.id}>
                                <td className="px-5 py-3">
                                    <Link href={`${BASE}/${r.id}`} className="font-mono text-teal-600">
                                        {r.id}
                                    </Link>
                                </td>
                                <td className="px-5 py-3">{r.full_name}</td>
                                <td className="px-5 py-3">
                                    <a href={`mailto:${r.email}`} className="text-sky-700 hover:underline">
                                        {r.email}
                                    </a>
                                </td>
                                <td className="px-5 py-3 whitespace-nowrap">{r.phone ?? '—'}</td>
                                <td className="px-5 py-3">{r.subject ?? '—'}</td>
                                <td className="px-5 py-3 whitespace-nowrap">{fmtDate(r.created_at)}</td>
                                <td className="px-5 py-3">
                                    <div className="flex items-center justify-center">
                                        {r.is_read ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : <XCircle className="h-5 w-5 text-rose-600" aria-hidden />}
                                    </div>
                                </td>
                                <td className="px-5 py-3">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link href={`${BASE}/${r.id}`} className="inline-flex h-8 w-8 items-center justify-center rounded border" title="Podgląd">
                                            <Eye className="h-4 w-4" />
                                        </Link>
                                        <Link href={`${BASE}/${r.id}/edit`} className="inline-flex h-8 w-8 items-center justify-center rounded border" title="Edytuj">
                                            <Pencil className="h-4 w-4" />
                                        </Link>
                                        <button onClick={() => destroyRow(r.id)} className="inline-flex h-8 w-8 items-center justify-center rounded border" title="Usuń">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {contacts.data.length === 0 && (
                            <tr>
                                <td className="px-5 py-10 text-center text-slate-500" colSpan={8}>
                                    Brak rekordów
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>

                    <div className="flex items-center justify-between border-t px-5 py-3 text-sm text-slate-600">
                        <span>{rangeInfo(contacts)}</span>
                        <nav className="flex items-center gap-1">
                            {contacts.links.map((l, i) => (
                                <Link
                                    key={i}
                                    href={l.url ?? '#'}
                                    preserveScroll
                                    className={`rounded-md px-3 py-1 ${l.active ? 'bg-slate-200 font-semibold' : 'hover:bg-slate-50'} ${!l.url && 'pointer-events-none opacity-40'}`}
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

function sanitize(s: string) { return s.replace(/&laquo;|&raquo;/g, '').trim() }
function rangeInfo(p: Paginated<any>) {
    if (p.total === 0) return '0-0 z 0'
    const a = (p.current_page - 1) * p.per_page + 1
    const b = Math.min(p.current_page * p.per_page, p.total)
    return `${a}-${b} z ${p.total}`
}
