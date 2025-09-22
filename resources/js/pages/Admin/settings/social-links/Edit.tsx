import { Link, router } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import { useState } from 'react'

type RecordT = { id:number|null; name:string; url:string; icon?:string|null; visible_pl:boolean; visible_de:boolean }
export default function Edit({ record, mode }: { record:RecordT, mode:'create'|'edit' }) {
    const [f,setF] = useState<RecordT>(record)
    const save = () => {
        const data = { ...f }
        if (mode==='create') router.post('/admin/settings/social-links', data)
        else router.put(`/admin/settings/social-links/${record.id}`, data)
    }
    return (
        <AppLayout>
            <div className="p-6">
                <h1 className="mb-4 text-2xl font-bold">{mode==='create' ? 'Utwórz' : 'Aktualizacja'} Link społecznościowy{record.name ? `: ${record.name}`:''}</h1>

                <div className="rounded-xl border bg-white p-5 space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Nazwa *</label>
                        <input value={f.name} onChange={e=>setF(s=>({...s, name:e.target.value}))} className="mt-1 w-full rounded-lg border px-3 py-2"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Link *</label>
                        <input value={f.url} onChange={e=>setF(s=>({...s, url:e.target.value}))} className="mt-1 w-full rounded-lg border px-3 py-2"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Ikona (np. facebook / fa-facebook) </label>
                        <div className="mt-1 flex items-center gap-3">
                            <div className="grid h-10 w-10 place-items-center rounded-full bg-slate-100">{f.icon ?? 'f'}</div>
                            <input value={f.icon ?? ''} onChange={e=>setF(s=>({...s, icon:e.target.value}))} className="flex-1 rounded-lg border px-3 py-2"/>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" checked={f.visible_pl} onChange={e=>setF(s=>({...s, visible_pl:e.target.checked}))}/>
                            <span>Widoczność na polskiej stronie</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" checked={f.visible_de} onChange={e=>setF(s=>({...s, visible_de:e.target.checked}))}/>
                            <span>Widoczność na niemieckiej stronie</span>
                        </label>
                    </div>
                </div>

                <div className="mt-4 flex gap-3">
                    <Link href="/admin/settings/social-links" className="rounded-full border px-4 py-2">Anuluj</Link>
                    <button onClick={save} className="rounded-full bg-mint px-4 py-2 font-semibold">{mode==='create' ? 'Utwórz' : 'Aktualizuj Link społecznościowy'}</button>
                </div>
            </div>
        </AppLayout>
    )
}
