import { Link, usePage } from '@inertiajs/react'
import AdminLayout from '@/layouts/admin-layout'
import { CheckCircle2, XCircle } from 'lucide-react';

type Row = {
    id:number; name_pl:string; name_de:string|null;
    is_visible_pl:boolean; is_visible_de:boolean;
    created_at?:string; updated_at?:string;
}
const BASE = '/admin/dictionaries/experience'

export default function Show(){
    const { row } = usePage<{ row: Row }>().props

    return (
        <AdminLayout>
            <main className="p-6">
                <div className="text-sm text-slate-500">Zasoby › Doświadczenia w opiece › Szczegóły</div>
                <div className="mt-1 flex items-center justify-between">
                    <p className="text-2xl font-bold">Szczegóły Doświadczenie w opiece: {row.id}</p>
                    <div className="flex gap-2">
                        <Link href={`${BASE}/${row.id}/edit`} className="rounded-lg border px-3 py-1 hover:bg-slate-50">✎</Link>
                        <Link href={BASE} className="rounded-lg border px-3 py-1 hover:bg-slate-50">↩︎</Link>
                    </div>
                </div>

                <div className="mt-6 overflow-hidden rounded-xl border bg-white">
                    <dl className="divide-y">
                        <Line label="ID">{row.id}</Line>
                        <Line label="Nazwa">{row.name_pl}</Line>
                        <Line label="Widoczność na polskiej stronie">{row.is_visible_pl ?  <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-hidden /> :  <XCircle className="h-5 w-5 text-rose-600" aria-hidden />}</Line>
                        <Line label="Widoczność na niemieckiej stronie">{row.is_visible_de ?  <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-hidden /> :  <XCircle className="h-5 w-5 text-rose-600" aria-hidden />}</Line>
                    </dl>
                </div>

                <div className="py-6 text-center text-xs text-slate-500">Senior na plus {new Date().getFullYear()}</div>
            </main>
        </AdminLayout>
    )
}
function Line({label, children}:{label:string; children:React.ReactNode}){
    return (
        <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-3">
            <dt className="text-sm font-medium">{label}</dt>
            <dd className="md:col-span-2">{children}</dd>
        </div>
    )
}
