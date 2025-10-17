import { Link, useForm, usePage } from '@inertiajs/react'
import AdminLayout from '@/layouts/admin-layout'
import { useState } from 'react'
import { CheckCircle2, Eye, Pencil, Trash2, XCircle } from 'lucide-react'
import * as React from 'react';

type Row = {
    id: number
    name: string
    visible_pl: boolean
    visible_de: boolean
}

type PageProps = {
    forms: { data: Row[]; links: any; from: number; to: number; total: number }
    filters: { q: string }
}

const BASE = '/admin/consents/forms'

export default function Index() {
    const { forms, filters } = usePage<PageProps>().props
    const [q, setQ] = useState(filters?.q ?? '')
    const form = useForm({})


    return (
        <AdminLayout>
            <main className="p-6">
                <div className="mt-1 flex items-center justify-between">
                    <p className="text-2xl font-bold">Formularze (Zgody)</p>
                    <Link href={`${BASE}/create`} className="rounded-lg bg-mint px-4 py-2 font-semibold text-white">
                        Utwórz Formularz
                    </Link>
                </div>
                <div className="mt-4 flex items-center gap-3">
                    <div className="relative w-72">
                        <input
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    window.location.href = `${BASE}?q=${encodeURIComponent(q)}`
                                }
                            }}
                            placeholder="Szukaj"
                            className="w-full rounded-full border bg-white px-4 py-2 pl-10"
                        />
                        <span className="pointer-events-none absolute left-3 top-2.5">🔎</span>

                    </div>
                </div>
                <div className="mt-4 overflow-hidden rounded-xl border bg-white">
                    <table className="w-full table-fixed text-sm">
                        <colgroup>
                            <col className="w-20" />            {/* ID */}
                            <col />                              {/* NAZWA – wypełnia resztę */}
                            <col className="w-48 sm:w-56" />     {/* WIDOCZNOŚĆ PL */}
                            <col className="w-48 sm:w-56" />     {/* WIDOCZNOŚĆ DE */}
                            <col className="w-36 sm:w-40" />     {/* Akcje */}
                        </colgroup>

                        <thead className="bg-slate-50">
                        <tr>
                            <th className="px-3 py-2 text-left">ID</th>
                            <th className="px-3 py-2 text-left">NAZWA</th>
                            <th className="px-3 py-2 text-center">WIDOCZNOŚĆ PL</th>
                            <th className="px-3 py-2 text-center">WIDOCZNOŚĆ DE</th>
                            <th className="px-3 py-2 text-right"></th>
                        </tr>
                        </thead>

                        <tbody>
                        {forms.data.map(r => (
                            <tr key={r.id} className="border-t">
                                <td className="px-3 py-2 align-middle text-slate-500">{r.id}</td>
                                <td className="px-3 py-2 align-middle">
                                    <span className="block truncate">{r.name}</span>
                                </td>

                                <td className="px-3 py-2 align-middle">
                                    <div className="flex justify-center">
                                        {r.visible_pl
                                            ? <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                                            : <XCircle className="h-5 w-5 text-rose-600" />
                                        }
                                    </div>
                                </td>

                                <td className="px-3 py-2 align-middle">
                                    <div className="flex justify-center">
                                        {r.visible_de
                                            ? <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                                            : <XCircle className="h-5 w-5 text-rose-600" />
                                        }
                                    </div>
                                </td>

                                <td className="px-3 py-2 align-middle">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link href={`${BASE}/${r.id}`} className="rounded-md border p-2 hover:bg-slate-50" title="Podgląd">
                                            <Eye className="h-4 w-4" />
                                        </Link>
                                        <Link href={`${BASE}/${r.id}/edit`} className="rounded-md border p-2 hover:bg-slate-50" title="Edytuj">
                                            <Pencil className="h-4 w-4" />
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => form.delete(`${BASE}/${r.id}`, { preserveScroll: true })}
                                            className="rounded-md border p-2 text-rose-600 hover:bg-rose-50"
                                            title="Usuń"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {forms.data.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-3 py-6 text-center text-slate-500">Brak danych</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>


            </main>
        </AdminLayout>
    )
}
