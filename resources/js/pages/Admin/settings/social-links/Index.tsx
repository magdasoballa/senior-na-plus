import * as React from 'react'
import { Link, router } from '@inertiajs/react'
import AdminLayout from '@/layouts/admin-layout'
import { CheckCircle2, Eye, Pencil, Trash2, XCircle, X } from 'lucide-react';

type Row = {
    id: number
    name: string
    url: string
    icon?: string | null
    icon_file_url?: string | null
    visible_pl: boolean
    visible_de: boolean
}

type Paginator<T> = {
    data: T[]
    links: { url: string | null; label: string; active: boolean }[]
}

export default function Index({
                                  records,
                                  filters,
                              }: {
    records: Paginator<Row>
    filters: { q?: string }
}) {
    const [q, setQ] = React.useState(filters?.q ?? '')

    const submit = () =>
        router.get(
            '/admin/settings/social-links',
            q ? { q } : {},
            { preserveState: true, replace: true }
        )

    const clearSearch = () => {
        setQ('')
        router.get(
            '/admin/settings/social-links',
            {},
            { preserveState: true, replace: true }
        )
    }

    const resolveFa = (icon?: string | null) => {
        if (!icon) return null
        return icon.includes('fa-') ? icon : `fa-brands fa-${icon}`
    }

    return (
        <AdminLayout>
            <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                    <p className="text-2xl font-bold">Linki społecznościowe</p>
                    <Link
                        href="/admin/settings/social-links/create"
                        className="rounded-full bg-mint px-4 py-2 font-semibold"
                    >
                        Utwórz Link społecznościowy
                    </Link>
                </div>

                <div className="mb-3">
                    <div className="relative w-80">
                        <input
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="Szukaj"
                            className="w-full rounded-full border bg-white px-4 py-2 pl-10 pr-10 outline-none"
                        />
                        <span className="pointer-events-none absolute left-3 top-2.5">🔎</span>
                        {/* Przycisk czyszczenia - pokazuje się tylko gdy jest tekst */}
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
                </div>

                <div className="overflow-hidden rounded-xl border bg-white">
                    <table className="min-w-full text-sm">
                        <thead className="bg-slate-50">
                        <tr>
                            <th className="px-4 py-3 text-left">ID</th>
                            <th className="px-4 py-3 text-left">Nazwa</th>
                            <th className="px-4 py-3 text-left">Ikona</th>
                            {/* WYŚRODKOWANE NAGŁÓWKI */}
                            <th className="px-4 py-3 text-center">Widoczność PL</th>
                            <th className="px-4 py-3 text-center">Widoczność DE</th>
                            <th className="px-4 py-3 text-right">Akcje</th>
                        </tr>
                        </thead>
                        <tbody>
                        {records.data.map((r) => (
                            <tr key={r.id} className="border-t">
                                <td className="px-4 py-3">{r.id}</td>
                                <td className="px-4 py-3">{r.name}</td>
                                <td className="px-4 py-3">
                                    {r.icon_file_url ? (
                                        <img
                                            src={r.icon_file_url}
                                            alt=""
                                            className="h-6 w-6 object-contain"
                                        />
                                    ) : r.icon ? (
                                        <i className={resolveFa(r.icon) || ''} aria-hidden />
                                    ) : (
                                        '—'
                                    )}
                                </td>

                                {/* WYŚRODKOWANE IKONY W KOMÓRKACH */}
                                <td className="px-4 py-3">
                                    <div className="flex justify-center">
                                        {r.visible_pl ? (
                                            <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-hidden />
                                        ) : (
                                            <XCircle className="h-5 w-5 text-rose-600" aria-hidden />
                                        )}
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex justify-center">
                                        {r.visible_de ? (
                                            <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-hidden />
                                        ) : (
                                            <XCircle className="h-5 w-5 text-rose-600" aria-hidden />
                                        )}
                                    </div>
                                </td>

                                <td className="px-4 py-3 text-right align-middle">
                                    <div className="inline-flex items-center justify-end gap-1">
                                        {/* PODGLĄD */}
                                        <Link
                                            href={`/admin/settings/social-links/${r.id}`}
                                            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white hover:bg-slate-50"
                                            aria-label="Podgląd"
                                            title="Podgląd"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Link>

                                        {/* EDYCJA */}
                                        <Link
                                            href={`/admin/settings/social-links/${r.id}/edit`}
                                            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white hover:bg-slate-50"
                                            aria-label="Edytuj"
                                            title="Edytuj"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Link>

                                        {/* USUŃ */}
                                        <Link
                                            as="button"
                                            method="delete"
                                            href={`/admin/settings/social-links/${r.id}`}
                                            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-rose-200 bg-white text-rose-600 hover:bg-rose-50"
                                            aria-label="Usuń"
                                            title="Usuń"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {records.data.length === 0 && (
                            <tr>
                                <td className="px-4 py-8 text-center" colSpan={6}>
                                    Brak danych
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                {/* prosta paginacja */}
                <nav className="mt-3 flex justify-center gap-1">
                    {records.links?.map((l, i) =>
                        l.url ? (
                            <Link
                                key={i}
                                href={l.url}
                                preserveScroll
                                className={`rounded px-3 py-1 ${l.active ? 'bg-slate-200' : ''}`}
                                dangerouslySetInnerHTML={{ __html: l.label }}
                            />
                        ) : (
                            <span
                                key={i}
                                className="rounded px-3 py-1 opacity-40"
                                dangerouslySetInnerHTML={{ __html: l.label }}
                            />
                        )
                    )}
                </nav>
            </div>
        </AdminLayout>
    )
}
