import { Link, usePage } from '@inertiajs/react'
import AdminLayout from '@/layouts/admin-layout'
import { CheckCircle2, XCircle, Pencil, CornerUpLeft } from 'lucide-react';

type Duty = { id:number; name:string; is_visible:boolean }

const BASE = '/admin/dictionaries/duties'

export default function Show(){
    const { duty } = usePage<{ duty:Duty }>().props

    return (
        <AdminLayout>
            <main className="p-6">
                {/* breadcrumbs – styl jak na screenie */}
                <div className="mb-2 text-sm text-slate-500">

                    <Link href={BASE} className="hover:underline">Obowiązki</Link>
                    {' › '}
                    <span className="text-slate-700">#{duty.id}</span>
                </div>

                <div className="flex items-start justify-between gap-4">
                    <p className="text-3xl font-bold text-emerald-900">
                        Szczegóły Obowiązek: {duty.name}
                    </p>

                    {/* akcje w prawym górnym rogu */}
                    <div className="flex gap-2">
                        <Link href={`${BASE}/${duty.id}/edit`} className="rounded-lg border px-3 py-1 hover:bg-slate-50">
                            <Pencil/>
                        </Link>

                        <Link href={BASE} className="rounded-lg border px-3 py-1 hover:bg-slate-50">↩︎</Link>
                    </div>
                </div>

                {/* „karta-tabela” jak na screenie */}
                <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                    <table className="w-full text-sm">
                        <tbody className="divide-y divide-slate-200">
                        <tr>
                            <th className="w-56 px-6 py-4 text-left text-slate-600">ID</th>
                            <td className="px-6 py-4">{duty.id}</td>
                        </tr>
                        <tr>
                            <th className="w-56 px-6 py-4 text-left text-slate-600">Tytuł</th>
                            <td className="px-6 py-4">{duty.name}</td>
                        </tr>
                        <tr>
                            <th className="w-56 px-6 py-4 text-left text-slate-600">Widoczny</th>
                            <td className="px-6 py-4">
                                {duty.is_visible ? (
                                    <span className="inline-flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-2">
                      <XCircle className="h-5 w-5 text-rose-600" />
                    </span>
                                )}
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </main>
        </AdminLayout>
    )
}
