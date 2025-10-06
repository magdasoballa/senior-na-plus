import AppLayout from '@/layouts/app-layout'
import { Link } from '@inertiajs/react'
import AdminLayout from '@/layouts/admin-layout';
import { CheckCircle2, Pencil, XCircle } from 'lucide-react';

export default function Show({ record }: { record:{
        id:number; name:string; url:string; icon?:string|null; visible_pl:boolean; visible_de:boolean
    }}) {
    return (
        <AdminLayout>
            <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                    <p className="text-2xl font-bold">Szczegóły Link społecznościowy: {record.name}</p>
                    <Link href={`/admin/settings/social-links/${record.id}/edit`} className="rounded-lg border px-3 py-1 hover:bg-slate-50"><Pencil/></Link>
                </div>

                <div className="overflow-hidden rounded-xl border bg-white">
                    <table className="min-w-full text-sm">
                        <tbody>
                        <tr className="border-b"><th className="w-64 px-4 py-3 text-left">ID</th><td className="px-4 py-3">{record.id}</td></tr>
                        <tr className="border-b"><th className="px-4 py-3 text-left">Nazwa</th><td className="px-4 py-3">{record.name}</td></tr>
                        <tr className="border-b"><th className="px-4 py-3 text-left">Link</th><td className="px-4 py-3"><a className="text-teal-600 underline" href={record.url} target="_blank">{record.url}</a></td></tr>
                        <tr className="border-b"><th className="px-4 py-3 text-left">Ikona</th><td className="px-4 py-3">{record.icon ?? '—'}</td></tr>
                        <tr className="border-b"><th className="px-4 py-3 text-left">Widoczność na polskiej stronie</th><td className="px-4 py-3">{record.visible_pl ? <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-hidden /> : <XCircle className="h-5 w-5 text-rose-600" aria-hidden />}</td></tr>
                        <tr><th className="px-4 py-3 text-left">Widoczność na niemieckiej stronie</th><td className="px-4 py-3">{record.visible_de ? <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-hidden />
                            : <XCircle className="h-5 w-5 text-rose-600" aria-hidden />}</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    )
}
