import { Link, router, usePage } from '@inertiajs/react'
import AdminLayout from '@/layouts/admin-layout'
import { CheckCircle2, Pencil, Trash2, XCircle } from 'lucide-react';
import * as React from 'react'

type Contact = {
    id: number
    full_name?: string | null
    email?: string | null
    phone?: string | null
    language_level?: string | null
    consents?: Record<string, boolean> | null
    is_read?: boolean
    created_at?: string | null
}

const BASE = '/admin/messages/pl/front-contacts'
const showOrDash = (v?: string | null) => (v?.toString().trim() ? v : '—')

export default function Show() {
    const { contact } = usePage<{ contact: Contact }>().props

    const toggle = () =>
        router.patch(`${BASE}/${contact.id}/toggle-read`, {}, { preserveScroll: true })

    const destroyIt = () => {
        if (!confirm('Usunąć ten kontakt?')) return
        router.delete(`${BASE}/${contact.id}`, {
            preserveScroll: true,
            onSuccess: () => router.visit(BASE), // na wszelki wypadek przejdź do listy
        })
    }

    const created =
        contact.created_at && !Number.isNaN(new Date(contact.created_at).getTime())
            ? new Date(contact.created_at).toLocaleString()
            : '—'

    return (
        <AdminLayout>
            <main className="p-6">
                <p className="mt-1 text-2xl font-bold">Szczegóły Kontakt Front (pl):</p>

                <div className="mt-4 overflow-hidden rounded-xl border bg-white">
                    {/* Toolbar */}
                    <div className="flex items-center justify-end gap-2 border-b px-4 py-3">
                        <button onClick={toggle} className="rounded border px-2 py-1 text-sm">
                            Oznacz jako {contact.is_read ? 'nieprzeczytany' : 'przeczytany'}
                        </button>

                        <Link
                            href={`${BASE}/${contact.id}/edit`}
                            className="rounded-lg border px-3 py-1 hover:bg-slate-50"
                            title="Edytuj"
                        >
                            <Pencil className="h-4 w-4" />
                        </Link>

                        <button
                            onClick={destroyIt}
                            className="rounded-lg border px-3 py-1 text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                            title="Usuń"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>

                    <dl className="[&_dt]:font-medium [&_dd]:text-slate-700 divide-y">
                        <Row label="ID">{contact.id}</Row>
                        <Row label="Imię i nazwisko">{showOrDash(contact.full_name)}</Row>
                        <Row label="E-mail">
                            {contact.email ? (
                                <a href={`mailto:${contact.email}`} className="text-sky-700 hover:underline">
                                    {contact.email}
                                </a>
                            ) : (
                                '—'
                            )}
                        </Row>
                        <Row label="Telefon">{showOrDash(contact.phone)}</Row>
                        <Row label="Poziom języka">{showOrDash(contact.language_level)}</Row>
                        <Row label="Data wysłania">{created}</Row>
                        <Row label="Zgody">{contact.consents ? 'Zaznaczone' : '—'}</Row>
                        <Row label="Czy przeczytany">
                            {contact.is_read ? <CheckCircle2 className="inline h-5 w-5 text-emerald-600" /> : <XCircle className="h-5 w-5 text-rose-600" aria-hidden />}
                        </Row>
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
