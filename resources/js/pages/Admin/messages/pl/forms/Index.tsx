import { Link, router, usePage } from '@inertiajs/react'
import AdminLayout from '@/layouts/admin-layout'
import * as React from 'react'
import { useEffect, useRef, useState } from 'react'
import { Eye, Pencil, Trash2, CheckCircle2, Filter, XCircle, Search, X } from 'lucide-react' // Dodano Search i X
import { FilterPopover, FilterRow, Select, TriStateRead } from '@/components/admin/FilterPopover'

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

    useEffect(() => {
        const onClick = (e: MouseEvent) => {
            if (!popRef.current) return
            if (!popRef.current.contains(e.target as Node)) setOpenFilters(false)
        }
        const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && setOpenFilters(false)
        document.addEventListener('mousedown', onClick)
        document.addEventListener('keydown', onEsc)
        return () => {
            document.removeEventListener('mousedown', onClick)
            document.removeEventListener('keydown', onEsc)
        }
    }, [])

    useEffect(() => setOpenFilters(false), [forms?.current_page, forms?.data?.length])

    const submit = (e?: React.FormEvent) => {
        e?.preventDefault()
        router.get(BASE, { q, level, experience, read, per_page: per, sort, dir }, { preserveState: true, replace: true })
    }

    const resetFilters = () => {
        setLevel('')
        setExperience('')
        setRead('')
        setPer(25)
        router.get(BASE, { q, sort, dir }, { preserveState: true, replace: true })
    }

    // Dodano funkcję resetowania wyszukiwania
    const resetSearch = () => {
        setQ('')
        router.get(BASE, { level, experience, read, per_page: per, sort, dir }, { preserveState: true, replace: true })
    }

    // Dodano funkcję resetowania wszystkich filtrów i wyszukiwania
    const resetAll = () => {
        setQ('')
        setLevel('')
        setExperience('')
        setRead('')
        setPer(25)
        router.get(BASE, {}, { preserveState: true, replace: true })
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
            <span className="text-slate-400">{sort === col ? (dir === 'asc' ? '▴' : '▾') : <span className="opacity-40">↕</span>}</span>
        </button>
    )

    return (
        <AdminLayout>
            <main className="p-6">
                <div className="text-sm text-slate-500">Wiadomości</div>
                <p className="mt-1 text-2xl font-bold">Formularze (pl)</p>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                    <form onSubmit={submit} className="flex items-center gap-3">
                    <div className="relative w-full max-w-xl">
                        <div className="relative w-80">
                            <input
                                value={q}
                                onChange={e=>setQ(e.target.value)}
                                placeholder="Szukaj"
                                className="w-full rounded-full border bg-white px-4 py-2 pl-10"
                            />
                            <span className="pointer-events-none absolute left-3 top-2.5">🔎</span>
                        </div>
                    </div>

                    <div className="relative" ref={popRef}>
                        <button
                            type="button"
                            onClick={() => setOpenFilters((v) => !v)}
                            aria-expanded={openFilters}
                            className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-slate-50"
                        >
                            <Filter className="h-4 w-4" />
                            <span>Filtry</span>
                        </button>

                        <FilterPopover
                            open={openFilters}
                            setOpen={setOpenFilters}
                            onApply={() => submit()}
                            onReset={resetAll} // Zmieniono na resetAll
                        >
                            <FilterRow label="Poziom języka">
                                <Select value={level} onChange={(e) => setLevel(e.target.value)}>
                                    <option value="">Kliknij aby wybrać</option>
                                    {LEVEL_OPTS.map((v) => (
                                        <option key={v} value={v}>
                                            {v}
                                        </option>
                                    ))}
                                </Select>
                            </FilterRow>

                            <FilterRow label="Doświadczenie">
                                <Select value={experience} onChange={(e) => setExperience(e.target.value)}>
                                    <option value="">Kliknij aby wybrać</option>
                                    {EXP_OPTS.map((v) => (
                                        <option key={v} value={v}>
                                            {v}
                                        </option>
                                    ))}
                                </Select>
                            </FilterRow>

                            <FilterRow label="Czy przeczytany">
                                <TriStateRead value={read} onChange={setRead} map={{ all: '', yes: '1', no: '0' }} />
                            </FilterRow>

                            <FilterRow label="Na stronę">
                                <Select value={per} onChange={(e) => setPer(Number(e.target.value))}>
                                    {[10, 25, 50, 100].map((n) => (
                                        <option key={n} value={n}>
                                            {n}
                                        </option>
                                    ))}
                                </Select>
                            </FilterRow>
                        </FilterPopover>
                    </div>
                </form>
                </div>
                {/* Reszta kodu pozostaje bez zmian */}
                <div className="mt-4 rounded-xl border bg-white">
                    <div className="w-full max-w-full overflow-x-auto">
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
                                        <div className="flex h-12 items-center leading-none whitespace-nowrap">{fmtDate(r.created_at)}</div>
                                    </td>

                                    <td className="px-4">
                                        <div className="flex h-12 items-center justify-center">
                                            {r.is_read ? <CheckCircle2 className="block h-5 w-5 text-emerald-600" /> : <XCircle className="h-5 w-5 text-rose-600" aria-hidden />}
                                        </div>
                                    </td>

                                    <td className="px-4">
                                        <div className="flex h-12 items-center justify-end gap-2 leading-none">
                                            <Link href={`${BASE}/${r.id}`} className="inline-flex h-8 w-8 items-center justify-center rounded border leading-none" title="Podgląd">
                                                <Eye className="block h-4 w-4" />
                                            </Link>
                                            <Link href={`${BASE}/${r.id}/edit`} className="inline-flex h-8 w-8 items-center justify-center rounded border leading-none" title="Edytuj">
                                                <Pencil className="block h-4 w-4" />
                                            </Link>
                                            <button onClick={() => destroyRow(r.id)} className="inline-flex h-8 w-8 items-center justify-center rounded border leading-none" title="Usuń">
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
                    </div>
                    {/* Paginacja */}
                    <div className="flex items-center justify-between border-t px-4 py-3 text-sm text-slate-600">
                        <span>{rangeInfo(forms)}</span>
                        <nav className="flex items-center gap-1">
                            {forms.links.map((l, i) => (
                                <Link key={i} href={l.url ?? '#'} preserveScroll className={`rounded-md px-3 py-1 ${l.active ? 'bg-slate-200 font-semibold' : 'hover:bg-slate-50'} ${!l.url && 'pointer-events-none opacity-40'}`}>
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
