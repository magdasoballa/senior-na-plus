import { Link, usePage } from '@inertiajs/react'
import AdminLayout from '@/layouts/admin-layout'
import { CheckCircle2, Pencil, XCircle } from 'lucide-react';

type Req = { id:number; title:string; body:string; image_url:string|null; is_visible:boolean; created_at?:string; updated_at?:string }
const BASE = '/admin/dictionaries/recruitment-reqs'

export default function Show(){
    const { req } = usePage<{ req: Req }>().props

    return (
        <AdminLayout>
            <main className="p-6">
                <div className="text-sm text-slate-500">Zasoby › Wymagania rekrutacyjne › #{req.id}</div>
                <div className="mt-1 flex items-center justify-between">
                    <p className="text-2xl font-bold">Szczegóły Wymaganie rekrutacyjne: {req.title}</p>
                    <div className="flex gap-2">
                        <Link href={`${BASE}/${req.id}/edit`} className="rounded-lg border px-3 py-1 hover:bg-slate-50"><Pencil/></Link>
                        <Link href={BASE} className="rounded-lg border px-3 py-1 hover:bg-slate-50">↩︎</Link>
                    </div>
                </div>

                <div className="mt-6 overflow-hidden rounded-xl border bg-white">
                    <dl className="divide-y">
                        <Row label="ID">{req.id}</Row>
                        <Row label="Tytuł">{req.title}</Row>
                        <Row label="Zdjęcie">
                            {req.image_url ? (
                                <div className="flex items-center gap-4">
                                    <img src={req.image_url} alt="" className="h-32 rounded object-cover" />
                                    <a href={req.image_url} download className="text-slate-700 hover:underline">⬇ Pobierz</a>
                                </div>
                            ) : '—'}
                        </Row>
                        <Row label="Widoczny">{req.is_visible ? <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-hidden /> : <XCircle className="h-5 w-5 text-rose-600" aria-hidden />}</Row>
                        <Row label="Opis">
                            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: req.body }} />
                        </Row>
                    </dl>
                </div>

                <div className="py-6 text-center text-xs text-slate-500">Senior na plus {new Date().getFullYear()}</div>
            </main>
        </AdminLayout>
    )
}
function Row({label, children}:{label:string; children:React.ReactNode}){
    return (
        <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-3">
            <dt className="text-sm font-medium">{label}</dt>
            <dd className="md:col-span-2">{children}</dd>
        </div>
    )
}
