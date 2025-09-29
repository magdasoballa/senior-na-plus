import { Link, usePage } from '@inertiajs/react'
import AdminLayout from '@/layouts/admin-layout'
import { CheckCircle2, XCircle } from 'lucide-react'

type Req = { id:number; name:string; is_visible:boolean; created_at?:string|null; updated_at?:string|null }
const BASE = '/admin/offers/requirements'

export default function Show(){
    const { req } = usePage<{ req: Req }>().props
    return (
        <AdminLayout>
            <main className="p-6">
                <div className="text-sm text-slate-500">Oferty › Wymagania › Szczegóły: {req.name}</div>
                <div className="mt-1 flex items-center justify-between">
                    <p className="text-2xl font-bold">Szczegóły Wymaganie: {req.name}</p>
                    <Link href={`${BASE}/${req.id}/edit`} className="rounded border px-3 py-1">Edytuj</Link>
                </div>

                <div className="mt-4 overflow-hidden rounded-xl border bg-white">
                    <table className="w-full text-sm">
                        <tbody>
                        <tr className="border-b"><td className="w-48 px-4 py-3 font-medium">ID</td><td className="px-4 py-3">{req.id}</td></tr>
                        <tr className="border-b"><td className="px-4 py-3 font-medium">Nazwa</td><td className="px-4 py-3">{req.name}</td></tr>
                        <tr><td className="px-4 py-3 font-medium">Widoczny</td>
                            <td className="px-4 py-3">{req.is_visible ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : <XCircle className="h-5 w-5 text-rose-600" />}</td></tr>
                        </tbody>
                    </table>
                </div>
            </main>
        </AdminLayout>
    )
}
