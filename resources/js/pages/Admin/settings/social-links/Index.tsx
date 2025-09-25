import * as React from 'react'
import { Link, router } from '@inertiajs/react'
import AdminLayout from '@/layouts/admin-layout'
import { CheckCircle2, XCircle } from 'lucide-react';

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
                    <input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && submit()}
                        placeholder="Szukaj"
                        className="w-80 rounded-full border bg-white px-4 py-2"
                    />
                </div>

                <div className="overflow-hidden rounded-xl border bg-white">
                    <table className="min-w-full text-sm">
                        <thead className="bg-slate-50">
                        <tr>
                            <th className="px-4 py-3 text-left">ID</th>
                            <th className="px-4 py-3 text-left">Nazwa</th>
                            <th className="px-4 py-3 text-left">Ikona</th>
                            <th className="px-4 py-3 text-left">Widoczność PL</th>
                            <th className="px-4 py-3 text-left">Widoczność DE</th>
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
                                        <i className={resolveFa(r.icon) || ''} />
                                    ) : (
                                        '—'
                                    )}
                                </td>
                                <td className="px-4 py-3">{r.visible_pl ?  <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-hidden /> :  <XCircle className="h-5 w-5 text-rose-600" aria-hidden />}</td>
                                <td className="px-4 py-3">{r.visible_de ?  <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-hidden /> :  <XCircle className="h-5 w-5 text-rose-600" aria-hidden />}</td>
                                <td className="px-4 py-3 space-x-2 text-right">
                                    <Link
                                        href={`/admin/settings/social-links/${r.id}`}
                                        className="rounded px-2 py-1 hover:bg-slate-50"
                                    >
                                        Podgląd
                                    </Link>
                                    <Link
                                        href={`/admin/settings/social-links/${r.id}/edit`}
                                        className="rounded px-2 py-1 hover:bg-slate-50"
                                    >
                                        Edytuj
                                    </Link>
                                    <Link
                                        as="button"
                                        method="delete"
                                        href={`/admin/settings/social-links/${r.id}`}
                                        className="rounded px-2 py-1 text-rose-600 hover:bg-rose-50"
                                    >
                                        Usuń
                                    </Link>
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
                                className={`rounded px-3 py-1 ${
                                    l.active ? 'bg-slate-200' : ''
                                }`}
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
