import { Link, router, usePage } from '@inertiajs/react'
import AdminLayout from '@/layouts/admin-layout'
import { useState } from 'react'
import { Eye, Pencil, Trash2, Filter, CheckCircle2, XCircle } from 'lucide-react'
import * as React from 'react'
import { FilterPopover, FilterRow, Select, TriStateRead } from '@/components/admin/FilterPopover'

type Row = {
    id: number
    name: string
    email: string
    phone: string | null
    subject: string | null
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

const BASE = '/admin/messages/de/site-contacts'

export default function Index() {
    const { contacts, filters } = usePage<{ contacts: Paginated<Row>; filters: any }>().props
    const [q, setQ] = useState(filters?.q ?? '')
    const [read, setRead] = useState<'all' | 'yes' | 'no'>(filters?.read ?? 'all')
    const [perPage, setPerPage] = useState<number>(Number(filters?.per_page) || contacts.per_page || 25)
    const [filtersOpen, setFiltersOpen] = useState(false)

    const submit = (e?: React.FormEvent) => {
        e?.preventDefault()
        router.get(BASE, { q, read, per_page: perPage }, { preserveState: true, replace: true })
    }

    const destroyRow = (id: number) => {
        if (!confirm('Usunąć wpis?')) return
        router.delete(`${BASE}/${id}`, { preserveScroll: true })
    }

    const fmt = (iso: string) =>
        new Date(iso).toLocaleString('pl-PL', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        })

    return (
        <AdminLayout>
            <main className="p-6">
                <div className="text-sm text-slate-500">Wiadomości</div>
                <p className="mt-1 text-2xl font-bold">Kontakty Strona (de)</p>

                {/* Szukaj + filtry */}
                <div className="mt-4 flex max-w-full items-center gap-3">
                    <form onSubmit={submit} className="flex w-full max-w-xl items-center gap-3">
                        <div className="relative flex-1">
                            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Szukaj" className="w-full rounded-full border bg-white px-4 py-2 pl-10" />
                            <span className="pointer-events-none absolute left-3 top-2.5">🔎</span>
                        </div>
                    </form>

                    <div className="relative">
                        <button onClick={() => setFiltersOpen((v) => !v)} className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-slate-50" type="button">
                            <Filter className="h-4 w-4" />
                            <span>Filtry</span>
                        </button>

                        <FilterPopover
                            open={filtersOpen}
                            setOpen={setFiltersOpen}
                            onApply={() => submit()}
                            onReset={() => {
                                setRead('all')
                                setPerPage(25)
                                router.get(BASE, { q }, { preserveState: true, replace: true })
                            }}
                        >
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

                <div className="mt-4 overflow-x-auto rounded-xl border bg-white">
                    <table className="w-full table-auto text-sm min-w-[1100px]">
                        <thead className="bg-slate-50 text-slate-600">
                        <tr>
                            <th className="w-16 px-4">ID</th>
                            <th className="px-4">IMIĘ I NAZWISKO</th>
                            <th className="px-4">E-MAIL</th>
                            <th className="px-4">TELEFON</th>
                            <th className="px-4">TEMAT</th>
                            <th className="px-4">DATA WYSŁANIA</th>
                            <th className="w-40 px-4 text-center">CZY PRZECZYTANY</th>
                            <th className="w-28 px-4 text-right">AKCJE</th>
                        </tr>
                        </thead>

                        <tbody>
                        {contacts.data.map((r) => (
                            <tr key={r.id} className="border-t">
                                <td className="px-4">
                                    <div className="flex h-12 items-center leading-none">
                                        <Link href={`${BASE}/${r.id}`} className="font-mono text-teal-600">
                                            {r.id}
                                        </Link>
                                    </div>
                                </td>

                                <td className="px-4">
                                    <div className="flex h-12 items-center leading-none">{r.name}</div>
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
                                    <div className="flex h-12 items-center leading-none">{r.subject ?? '—'}</div>
                                </td>

                                <td className="px-4">
                                    <div className="flex h-12 items-center leading-none">{fmt(r.created_at)}</div>
                                </td>

                                <td className="px-4">
                                    <div className="flex h-12 items-center justify-center">
                                        {r.is_read ? <CheckCircle2 className="block h-5 w-5 text-emerald-600" /> : <span className="text-slate-400"><XCircle className="h-5 w-5 text-rose-600" aria-hidden /></span>}
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

                        {contacts.data.length === 0 && (
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
                        <span>{rangeInfo(contacts)}</span>
                        <nav className="flex items-center gap-1">
                            {contacts.links.map((l, i) => (
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
