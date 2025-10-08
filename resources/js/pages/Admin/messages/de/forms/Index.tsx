import { Link, router, usePage } from '@inertiajs/react'
import AdminLayout from '@/layouts/admin-layout'
import { useEffect, useRef, useState } from 'react'
import { Eye, Pencil, Trash2, Filter, CheckCircle2, XCircle } from 'lucide-react'
import * as React from 'react'
import { FilterPopover, FilterRow, Select, TriStateRead } from '@/components/admin/FilterPopover'

type Row = {
    id: number
    full_name: string
    zip?: string | null
    zip_code?: string | null
    city: string | null
    phone: string | null
    created_at: string | null
    is_read: boolean
}

type Paginated<T> = {
    data: T[]
    links: { url: string | null; label: string; active: boolean }[]
    current_page: number
    last_page: number
    per_page: number
    total: number
}

const BASE = '/admin/messages/de/forms'

export default function Index() {
    const { forms, filters } = usePage<{ forms: Paginated<Row>; filters: any }>().props

    const [q, setQ] = useState<string>(filters?.q ?? '')
    const [read, setRead] = useState<string>(filters?.read ?? '') // '', '1', '0'
    const [perPage, setPerPage] = useState<number>(Number(filters?.per_page) || forms.per_page || 25)

    const [filtersOpen, setFiltersOpen] = useState(false)
    const popRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const onDown = (e: MouseEvent) => {
            if (!popRef.current) return
            if (!popRef.current.contains(e.target as Node)) setFiltersOpen(false)
        }
        const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && setFiltersOpen(false)
        document.addEventListener('mousedown', onDown)
        document.addEventListener('keydown', onEsc)
        return () => {
            document.removeEventListener('mousedown', onDown)
            document.removeEventListener('keydown', onEsc)
        }
    }, [])

    const submit = (e?: React.FormEvent) => {
        e?.preventDefault()
        router.get(
            BASE,
            { q, read, per_page: perPage },
            { preserveState: true, replace: true }
        )
    }

    const reset = () => {
        setRead('')
        setPerPage(25)
        router.get(BASE, { q }, { preserveState: true, replace: true })
    }

    const destroyRow = (id: number) => {
        if (!confirm('Usunąć wpis?')) return
        router.delete(`${BASE}/${id}`, { preserveScroll: true })
    }

    const fmt = (iso?: string | null) =>
        iso
            ? new Date(iso).toLocaleString('pl-PL', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
            })
            : '—'

    const iconBtn =
        'inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 text-slate-600 hover:bg-slate-50 hover:text-slate-800'

    return (
        <AdminLayout>
            <main className="p-6">
                <div className="text-sm text-slate-500">Formularze (de)</div>
                <p className="mt-1 text-2xl font-bold">Formularze (de)</p>

                {/* Szukaj + filtry */}
                <div className="mt-4 flex max-w-full items-center gap-3">
                    <form onSubmit={submit} className="flex w-full max-w-xl items-center gap-3">
                        <div className="relative flex-1">
                            <input
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                placeholder="Szukaj (imię, telefon, miasto, kod)"
                                className="w-full rounded-full border border-slate-300 bg-white px-4 py-2 pl-10 placeholder-slate-400"
                            />
                            <span className="pointer-events-none absolute left-3 top-2.5">🔎</span>
                        </div>
                    </form>

                    <div className="relative" ref={popRef}>
                        <button
                            onClick={() => setFiltersOpen((v) => !v)}
                            className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-slate-50"
                            type="button"
                        >
                            <Filter className="h-4 w-4" />
                            <span>Filtry</span>
                        </button>

                        <FilterPopover open={filtersOpen} setOpen={setFiltersOpen} onApply={() => submit()} onReset={reset} width="w-80">
                            <FilterRow label="Czy przeczytany">
                                {/* backend: '', '1', '0' */}
                                <TriStateRead value={read} onChange={setRead} map={{ all: '', yes: '1', no: '0' }} />
                            </FilterRow>

                            <FilterRow label="Na stronę">
                                <Select value={perPage} onChange={(e) => setPerPage(Number(e.target.value))}>
                                    {[10, 25, 50, 100].map((n) => (
                                        <option key={n} value={n}>{n}</option>
                                    ))}
                                </Select>
                            </FilterRow>
                        </FilterPopover>
                    </div>
                </div>

                {/* Tabela */}
                <div className="mt-4 overflow-x-auto rounded-xl border bg-white">
                    <table className="min-w-[1100px] w-full table-auto text-sm">
                        <thead className="bg-slate-50 text-slate-600">
                        <tr>
                            <th className="w-16 px-4 py-3 text-left">ID</th>
                            <th className="px-4 py-3 text-left">IMIĘ I NAZWISKO</th>
                            <th className="px-4 py-3 text-left">KOD POCZTOWY</th>
                            <th className="px-4 py-3 text-left">MIASTO</th>
                            <th className="px-4 py-3 text-left">TELEFON</th>
                            <th className="px-4 py-3 text-left">DATA WYSŁANIA</th>
                            <th className="w-40 px-4 py-3 text-center">CZY PRZECZYTANY</th>
                            <th className="w-28 px-4 py-3 text-right">AKCJE</th>
                        </tr>
                        </thead>
                        <tbody>
                        {forms.data.map((r) => (
                            <tr key={r.id} className="border-t">
                                <td className="px-4">
                                    <div className="flex h-12 items-center leading-none">
                                        <Link href={`${BASE}/${r.id}`} className="font-mono text-teal-600 hover:underline">{r.id}</Link>
                                    </div>
                                </td>
                                <td className="px-4"><div className="flex h-12 items-center leading-none">{r.full_name}</div></td>
                                <td className="px-4"><div className="flex h-12 items-center leading-none">{r.zip ?? r.zip_code ?? '—'}</div></td>
                                <td className="px-4"><div className="flex h-12 items-center leading-none">{r.city ?? '—'}</div></td>
                                <td className="px-4"><div className="flex h-12 items-center leading-none">{r.phone ?? '—'}</div></td>
                                <td className="px-4"><div className="flex h-12 items-center leading-none">{fmt(r.created_at)}</div></td>
                                <td className="px-4">
                                    <div className="flex h-12 items-center justify-center">
                                        {r.is_read ? <CheckCircle2 className="block h-5 w-5 text-emerald-600" /> : <span className="text-slate-400"><XCircle className="h-5 w-5 text-rose-600" aria-hidden /></span>}
                                    </div>
                                </td>
                                <td className="px-4">
                                    <div className="flex h-12 items-center justify-end gap-2 leading-none">
                                        <Link href={`${BASE}/${r.id}`} className={iconBtn} title="Podgląd"><Eye className="h-4 w-4" /></Link>
                                        <Link href={`${BASE}/${r.id}/edit`} className={iconBtn} title="Edytuj"><Pencil className="h-4 w-4" /></Link>
                                        <button onClick={() => destroyRow(r.id)} className={iconBtn} title="Usuń"><Trash2 className="h-4 w-4" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {forms.data.length === 0 && (
                            <tr>
                                <td className="px-4 py-8 text-center text-slate-500" colSpan={8}>Brak rekordów</td>
                            </tr>
                        )}
                        </tbody>
                    </table>

                    <div className="flex items-center justify-between border-t px-4 py-3 text-sm text-slate-600">
                        <span className="text-slate-400">Poprzedni</span>
                        <span className="text-slate-600">
              {forms.total
                  ? `${(forms.current_page - 1) * forms.per_page + 1}-${Math.min(forms.current_page * forms.per_page, forms.total)} z ${forms.total}`
                  : '0-0 z 0'}
            </span>
                        <span className="text-slate-400">Następny</span>
                    </div>
                </div>
            </main>
        </AdminLayout>
    )
}
