import AppLayout from '@/layouts/app-layout'
import { Link, router, usePage } from '@inertiajs/react'
import { CheckCircle2, Pencil, Trash2 } from 'lucide-react'
import * as React from 'react'
import AdminLayout from '@/layouts/admin-layout';

type Contact = {
    id:number
    full_name?: string|null
    email?: string|null
    phone?: string|null
    subject?: string|null
    message?: string|null
    consents?: any
    is_read?: boolean
    created_at?: string|null
}

const BASE = '/admin/messages/pl/site-contacts'
const showOrDash = (v?: string|null)=> (v?.toString().trim() ? v : '—')
const fmtDate = (s?: string | null) =>
    !s || Number.isNaN(new Date(s).getTime())
        ? '—'
        : new Date(s).toLocaleString('pl-PL', {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit',
        })

export default function Show(){
    const { contact } = usePage<{contact:Contact}>().props

    const toggle = () => router.patch(`${BASE}/${contact.id}/toggle-read`, {}, { preserveScroll:true })
    const destroyIt = () => {
        if(!confirm('Usunąć ten kontakt?')) return
        router.delete(`${BASE}/${contact.id}`, { onSuccess:()=>router.visit(BASE) })
    }

    return (
        <AdminLayout>
            <main className="mx-auto max-w-[110rem] p-6">
                {/* --- Breadcrumbs (powrót do listy) --- */}
                <div className="text-sm text-slate-500">
                    <Link href={BASE} className="text-sky-700 hover:underline">
                        Kontakty Strona (pl)
                    </Link>
                    &nbsp;&rsaquo;&nbsp; Szczegóły kontaktu #{contact.id}
                </div>

                {/* Tytuł */}
                <p className="mt-1 text-2xl font-bold">
                    Szczegóły Kontakt Strona (pl): {showOrDash(contact.subject)}
                </p>

                <div className="mt-4 overflow-hidden rounded-xl border bg-white">
                    <div className="flex items-center justify-end gap-2 border-b px-4 py-3">
                        <button onClick={toggle} className="rounded border px-2 py-1 text-sm">
                            Oznacz jako {contact.is_read ? 'nieprzeczytany' : 'przeczytany'}
                        </button>
                        <Link
                            href={`${BASE}/${contact.id}/edit`}
                            className="inline-flex h-8 w-8 items-center justify-center rounded border"
                            title="Edytuj"
                        >
                            <Pencil className="h-4 w-4"/>
                        </Link>
                        <button
                            onClick={destroyIt}
                            className="inline-flex h-8 w-8 items-center justify-center rounded border text-rose-600"
                            title="Usuń"
                        >
                            <Trash2 className="h-4 w-4"/>
                        </button>
                    </div>

                    <dl className="divide-y [&_dt]:font-medium [&_dd]:text-slate-700">
                        <Row label="ID">{contact.id}</Row>
                        <Row label="Imię i nazwisko">{showOrDash(contact.full_name)}</Row>
                        <Row label="E-mail">
                            {contact.email ? (
                                <a href={`mailto:${contact.email}`} className="text-sky-700 hover:underline">
                                    {contact.email}
                                </a>
                            ) : '—'}
                        </Row>
                        <Row label="Telefon">{showOrDash(contact.phone)}</Row>
                        <Row label="Temat">{showOrDash(contact.subject)}</Row>
                        <Row label="Wiadomość">{showOrDash(contact.message)}</Row>
                        <Row label="Data wysłania">{fmtDate(contact.created_at)}</Row>
                        <Row label="Zgody">{contact.consents ? 'Zaznaczone wszystkie' : '—'}</Row>
                        <Row label="Czy przeczytany">
                            {contact.is_read ? <CheckCircle2 className="inline h-5 w-5 text-emerald-600"/> : '—'}
                        </Row>
                    </dl>
                </div>
            </main>
        </AdminLayout>
    )
}

function Row({label, children}:{label:string; children:React.ReactNode}){
    return (
        <div className="grid grid-cols-3 gap-4 px-4 py-3">
            <dt className="text-slate-600">{label}</dt>
            <dd className="col-span-2">{children}</dd>
        </div>
    )
}
