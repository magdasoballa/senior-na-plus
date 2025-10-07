// resources/js/pages/Admin/settings/portal/Index.tsx
import { Link, router, usePage } from '@inertiajs/react'
import { useState } from 'react'
import AdminLayout from '@/layouts/admin-layout'
import { Eye, Pencil } from 'lucide-react'
import * as React from 'react'

type Row = {
    id: number
    phone_pl: string | null
    address_pl: string | null
    email_pl: string | null
    phone?: string | null
    address?: string | null
    email?: string | null
}

type Paginated<T> = {
    data: T[]
    links: { url: string | null; label: string; active: boolean }[]
    current_page: number
    last_page: number
    per_page: number
    total: number
}

const BASE = '/admin/settings/portal'

export default function Index() {
    const { settings, filters } = usePage<{ settings: Paginated<Row>; filters: { q?: string } }>().props
    const [q, setQ] = useState(filters?.q ?? '')

    const submit = (e: React.FormEvent) => {
        e.preventDefault()
        router.get(BASE, { q }, { preserveState: true, replace: true })
    }

    const pl = (v?: string | null, fb?: string | null) => (v ?? fb ?? '').trim() || '—'

    return (
        <AdminLayout>
            <main className="p-6">
                <div className="text-sm text-slate-500">Zasoby › Ustawienia portalu</div>
                <p className="mt-1 text-2xl font-bold">Ustawienia portalu</p>

                <form onSubmit={submit} className="mt-4 max-w-md">
                    <div className="relative">
                        <input
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="Szukaj"
                            className="w-full rounded-full border bg-white px-4 py-2 pl-10"
                        />
                        <span className="pointer-events-none absolute left-3 top-2.5">🔎</span>
                    </div>
                </form>

                <div className="mt-4 overflow-hidden rounded-xl border bg-white">
                    <table
                        className="w-full text-sm table-fixed
                       [&_th]:py-3 [&_th]:align-middle
                       [&_td]:py-0 [&_td]:align-middle
                       [&_tbody>tr]:h-12"
                    >
                        <thead className="bg-slate-50 text-slate-600">
                        <tr>
                            <th className="w-16 px-4">ID</th>
                            <th className="px-4">TELEFON (PL)</th>
                            <th className="px-4">ADRES (PL)</th>
                            <th className="px-4">EMAIL (PL)</th>
                            <th className="w-28 px-4 text-right">AKCJE</th>
                        </tr>
                        </thead>

                        <tbody>
                        {settings.data.map((row) => {
                            const phone = pl(row.phone_pl, row.phone)
                            const address = pl(row.address_pl, row.address)
                            const email = pl(row.email_pl, row.email)

                            return (
                                <tr key={row.id} className="border-t">
                                    <td className="px-4">
                                        <div className="flex h-12 items-center leading-none">
                                            <Link href={`${BASE}/${row.id}`} className="font-mono text-teal-600 inline-block">
                                                {row.id}
                                            </Link>
                                        </div>
                                    </td>

                                    <td className="px-4">
                                        <div className="flex h-12 items-center justify-center leading-none">
                                            <span className="inline-block">{phone}</span>
                                        </div>
                                    </td>

                                    <td className="px-4">
                                        <div className="flex h-12 items-center justify-center leading-none">
                                            <span className="inline-block">{address}</span>
                                        </div>
                                    </td>

                                    <td className="px-4">
                                        <div className="flex h-12 items-center justify-center leading-none">
                                            {email !== '—' ? (
                                                <a href={`mailto:${email}`} className="text-sky-700 hover:underline inline-block">
                                                    {email}
                                                </a>
                                            ) : (
                                                '—'
                                            )}
                                        </div>
                                    </td>

                                    <td className="px-4">
                                        <div className="flex h-12 items-center justify-end gap-2 leading-none">
                                            <Link
                                                href={`${BASE}/${row.id}`}
                                                className="inline-flex h-8 w-8 items-center justify-center rounded border leading-none"
                                                title="Podgląd"
                                                aria-label={`Podgląd #${row.id}`}
                                            >
                                                <Eye className="block h-4 w-4 -translate-y-[1px]" />
                                            </Link>
                                            <Link
                                                href={`${BASE}/${row.id}/edit`}
                                                className="inline-flex h-8 w-8 items-center justify-center rounded border leading-none"
                                                title="Edytuj"
                                                aria-label={`Edytuj #${row.id}`}
                                            >
                                                <Pencil className="block h-4 w-4 -translate-y-[1px]" />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}

                        {settings.data.length === 0 && (
                            <tr>
                                <td className="px-4 py-8 text-center text-slate-500" colSpan={5}>
                                    Brak rekordów
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>

                    <div className="flex items-center justify-between border-t px-4 py-3 text-sm text-slate-600">
                        <span>{rangeInfo(settings)}</span>
                        <nav className="flex items-center gap-1">
                            {settings.links.map((l, i) => (
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
    const start = (p.current_page - 1) * p.per_page + 1
    const end = Math.min(p.current_page * p.per_page, p.total)
    return `${start}-${end} z ${p.total}`
}
