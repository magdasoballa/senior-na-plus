import AdminLayout from '@/layouts/admin-layout'
import { Link, useForm, usePage } from '@inertiajs/react'
import { CheckCircle2, Pencil, Trash2, XCircle } from 'lucide-react'
import { useState } from 'react'

type Contact = {
    id:number; name:string; content_pl:string; content_de?:string|null; visible_pl:boolean; visible_de:boolean;
}
const BASE = '/admin/consents/contacts'

export default function Show(){
    const { contact } = usePage<{ contact: Contact }>().props
    const form = useForm({})
    const [lang, setLang] = useState<'pl'|'de'>('pl')

    const handleDelete = ()=>{
        if(confirm('Usunąć?')) form.delete(`${BASE}/${contact.id}`, { preserveScroll:true })
    }

    return (
        <AdminLayout>
            <main className="p-6">
                <div className="text-sm text-slate-500"> <Link href={BASE} >Kontakty</Link> › Szczegóły Kontakt: {contact.id}</div>
                <div className="mt-1 flex items-center justify-between">
                    <p className="text-2xl font-bold">Szczegóły Kontakt: {contact.id}</p>
                    <div className="flex gap-2">
                        <Link href={`${BASE}/${contact.id}/edit`} className="rounded-lg border px-3 py-1 hover:bg-slate-50"><Pencil/></Link>
                        <button onClick={handleDelete} className="rounded-lg border px-3 py-1 text-rose-600 hover:bg-rose-50" disabled={form.processing}><Trash2 className="h-4 w-4"/></button>
                        <Link href={BASE} className="rounded-lg border px-3 py-1 hover:bg-slate-50">↩︎</Link>
                    </div>
                </div>

                <div className="mt-6 rounded-xl border bg-white">
                    <dl className="divide-y">
                        <Row label="ID">{contact.id}</Row>
                        <Row label="Nazwa">{contact.name}</Row>

                        <Row label="Treść" right={
                            <div className="text-sm">
                                <button onClick={()=>setLang('pl')} className={`mr-3 hover:underline ${lang==='pl'?'text-sky-600 font-semibold':''}`}>Polski</button>
                                <button onClick={()=>setLang('de')} className={`hover:underline ${lang==='de'?'text-sky-600 font-semibold':''}`}>Niemiecki</button>
                            </div>
                        }>
                            <div className="whitespace-pre-wrap">{lang==='pl' ? (contact.content_pl || '—') : (contact.content_de || '—')}</div>
                        </Row>

                        <Row label="Widoczność na polskiej stronie">
                            {contact.visible_pl ? <CheckCircle2 className="h-5 w-5 text-emerald-600"/> : <XCircle className="h-5 w-5 text-rose-600"/>}
                        </Row>
                        <Row label="Widoczność na niemieckiej stronie">
                            {contact.visible_de ? <CheckCircle2 className="h-5 w-5 text-emerald-600"/> : <XCircle className="h-5 w-5 text-rose-600"/>}
                        </Row>
                    </dl>
                </div>
            </main>
        </AdminLayout>
    )
}

function Row({label, children, right}:{label:string; children:React.ReactNode; right?:React.ReactNode}){
    return (
        <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-3">
            <dt className="text-sm font-medium">{label}</dt>
            <dd className="md:col-span-2 flex items-center justify-between">
                <div>{children}</div>
                {right}
            </dd>
        </div>
    )
}
