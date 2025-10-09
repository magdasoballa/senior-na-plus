import { Link, router, usePage } from '@inertiajs/react'
import AdminLayout from '@/layouts/admin-layout'
import { CheckCircle2, XCircle, Pencil } from 'lucide-react'

type P = { id:number; link:string; image_url:string|null; image_path:string|null; is_visible:boolean; created_at:string|null }

const BASE = '/admin/partners'

export default function Show(){
    const { partner } = usePage<{ partner:P }>().props

    const toggle = () => {
        router.post(`${BASE}/${partner.id}/toggle-visible`, {}, { preserveScroll:true })
    }

    return (
        <AdminLayout>
            <main className="p-6">
                <div className="text-sm text-slate-500">
                    <Link href={BASE} className="text-sky-700 hover:underline">Partnerzy</Link>
                    &nbsp;&rsaquo;&nbsp; Szczegóły Partner: {partner.id}
                </div>

                <div className="mt-4 rounded-xl border bg-white p-4">
                    <div className="grid gap-4">
                        <div><div className="text-xs text-slate-500">ID</div><div className="font-semibold">{partner.id}</div></div>
                        <div><div className="text-xs text-slate-500">Link</div><a href={partner.link} className="text-sky-700 hover:underline" target="_blank" rel="noreferrer">{partner.link}</a></div>
                        <div>
                            <div className="text-xs text-slate-500">Zdjęcie</div>
                            {partner.image_url ? (
                                <div className="mt-2">
                                    <img src={partner.image_url} alt="" className="h-24 object-contain"/>
                                    <div className="mt-2">
                                        <a href={partner.image_url} download className="text-slate-600 hover:underline">Pobierz</a>
                                    </div>
                                </div>
                            ) : '—'}
                        </div>
                        <div>
                            <div className="text-xs text-slate-500">Widoczny</div>
                            <div className="mt-1 flex items-center gap-3">
                                {partner.is_visible ? <CheckCircle2 className="h-5 w-5 text-emerald-600"/> : <XCircle className="h-5 w-5 text-rose-600"/>}
                                <button onClick={toggle} className="rounded-md border px-3 py-1.5 text-sm">Przełącz</button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6">
                        <Link href={`${BASE}/${partner.id}/edit`} className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
                            <Pencil className="h-4 w-4" /> Edytuj
                        </Link>
                    </div>
                </div>
            </main>
        </AdminLayout>
    )
}
