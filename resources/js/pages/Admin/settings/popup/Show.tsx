import { Link, usePage } from '@inertiajs/react'
import AdminLayout from '@/layouts/admin-layout'
import { CheckCircle2, Pencil, XCircle } from 'lucide-react';

type Popup = { id:number; name:string; link:string|null; image_url:string|null; is_visible:boolean; created_at?:string; updated_at?:string }
const BASE = '/admin/settings/popups'

export default function Show(){
    const { popup } = usePage<{ popup: Popup }>().props

    return (
        <AdminLayout>
            <main className="p-6">
                <div className="text-sm text-slate-500">Popup › #{popup.id}</div>
                <div className="mt-1 flex items-center justify-between">
                    <p className="text-2xl font-bold">Szczegóły Popup: {popup.id}</p>
                    <div className="flex gap-2 ">
                        <Link href={`${BASE}/${popup.id}/edit`} className="rounded-lg border px-3 py-1 hover:bg-slate-50"><Pencil/></Link>
                        <Link href={BASE} className="rounded-lg border px-3 py-1 hover:bg-slate-50">↩︎</Link>
                    </div>
                </div>

                <div className="mt-6 overflow-hidden rounded-xl border bg-white">
                    <dl className="divide-y">
                        <Row label="ID">{popup.id}</Row>
                        <Row label="Nazwa">{popup.name}</Row>
                        <Row label="Link">{popup.link ? <a href={popup.link} target="_blank" rel="noreferrer" className="text-sky-600 hover:underline">{popup.link}</a> : '—'}</Row>
                        <Row label="Zdjęcie">
                            {popup.image_url ? (
                                <div className="flex items-center gap-4">
                                    <img src={popup.image_url} alt="" className="h-40 rounded object-cover" />
                                    <a href={popup.image_url} download className="text-slate-700 hover:underline">⬇ Pobierz</a>
                                </div>
                            ) : '—'}
                        </Row>
                        <Row label="Widoczny">{popup.is_visible ? <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-hidden />
                            : <XCircle className="h-5 w-5 text-rose-600" aria-hidden />}</Row>
                    </dl>
                </div>

                <div className="py-6 text-center text-xs text-slate-500">Senior na plus {new Date().getFullYear()}</div>
            </main>
        </AdminLayout>
    )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-3">
            <dt className="text-sm font-medium">{label}</dt>
            <dd className="md:col-span-2">{children}</dd>
        </div>
    )
}
