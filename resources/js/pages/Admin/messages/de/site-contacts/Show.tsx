import { Link, router, usePage } from '@inertiajs/react'
import AdminLayout from '@/layouts/admin-layout'
import { Pencil, Trash2, CheckCircle2 } from 'lucide-react'
import * as React from 'react'

type Contact = {
    id: number
    name?: string | null
    full_name?: string | null
    email?: string | null
    phone?: string | null
    subject?: string | null
    message?: string | null
    consents?: Record<string, boolean> | null
    is_read?: boolean
    created_at?: string | null
}

const BASE = '/admin/messages/de/site-contacts'
const showOrDash = (v?: string | null) => (v?.toString().trim() ? v : '—')

export default function Show() {
    const { contact } = usePage<{ contact: Contact }>().props

    const toggle = () => router.patch(`${BASE}/${contact.id}/toggle-read`, {}, { preserveScroll: true })
    const destroyRow = () => { if (confirm('Usunąć wpis?')) router.delete(`${BASE}/${contact.id}`) }

    const created =
        contact.created_at && !Number.isNaN(new Date(contact.created_at).getTime())
            ? new Date(contact.created_at).toLocaleString('pl-PL', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' })
            : '—'

    return (
        <AdminLayout>
            <main className="p-6">
                <div className="text-sm text-slate-500">Wiadomości › Kontakty Strona (de) › Szczegóły</div>
                <p className="mt-1 text-2xl font-bold">Szczegóły Kontakt Strona (de):</p>

                <div className="mt-4 overflow-hidden rounded-xl border bg-white">
                    {/* toolbar */}
                    <div className="flex items-center justify-end gap-2 border-b px-4 py-3">
                        <button onClick={toggle} className="rounded border px-2 py-1 text-sm">
                            Oznacz jako {contact.is_read ? 'nieprzeczytany' : 'przeczytany'}
                        </button>
                        <Link href={`${BASE}/${contact.id}/edit`} className="inline-flex h-8 w-8 items-center justify-center rounded border" title="Edytuj">
                            <Pencil className="h-4 w-4" />
                        </Link>
                        <button onClick={destroyRow} className="inline-flex h-8 w-8 items-center justify-center rounded border" title="Usuń">
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>

                    <dl className="divide-y [&_dt]:font-medium [&_dd]:text-slate-700">
                        <Row label="ID">{contact.id}</Row>
                        <Row label="Imię i nazwisko">{showOrDash(contact.full_name ?? contact.name)}</Row>
                        <Row label="E-mail">
                            {contact.email ? <a href={`mailto:${contact.email}`} className="text-sky-700 hover:underline">{contact.email}</a> : '—'}
                        </Row>
                        <Row label="Telefon">{showOrDash(contact.phone)}</Row>
                        <Row label="Temat">{showOrDash(contact.subject)}</Row>
                        <Row label="Wiadomość"><div className="whitespace-pre-line">{showOrDash(contact.message)}</div></Row>
                        <Row label="Data wysłania">{created}</Row>
                        <Row label="Zgody">{contact.consents ? 'Zaznaczone' : '—'}</Row>
                        <Row label="Czy przeczytany">{contact.is_read ? <CheckCircle2 className="inline h-5 w-5 text-emerald-600" /> : '—'}</Row>
                    </dl>
                </div>
            </main>
        </AdminLayout>
    )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="grid grid-cols-3 gap-4 px-4 py-3">
            <dt className="text-slate-600">{label}</dt>
            <dd className="col-span-2">{children}</dd>
        </div>
    )
}
