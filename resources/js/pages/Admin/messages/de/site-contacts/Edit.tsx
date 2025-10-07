import { Link, router, usePage } from '@inertiajs/react'
import AdminLayout from '@/layouts/admin-layout'
import { useState } from 'react'
import * as React from 'react'

type Contact = {
    id: number
    name: string
    email: string
    phone: string | null
    subject: string | null
    message: string | null
    is_read: boolean
    created_at: string | null
}

const BASE = '/admin/messages/de/site-contacts'

export default function Edit() {
    const { contact, errors } = usePage<{ contact: Contact; errors: Record<string, string> }>().props
    const [form, setForm] = useState<Contact>({ ...contact })

    const save = (stay = false) => {
        router.put(`${BASE}/${contact.id}`, { ...form, stay }, { preserveScroll: true })
    }

    const created =
        form.created_at && !Number.isNaN(new Date(form.created_at).getTime())
            ? new Date(form.created_at).toLocaleString('pl-PL', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' })
            : '—'

    return (
        <AdminLayout>
            <main className="p-6">
                <div className="text-sm text-slate-500">Wiadomości › Kontakty Strona (de)</div>
                <p className="mt-1 text-2xl font-bold">Edycja kontaktu #{contact.id}</p>

                <div className="mt-4 overflow-hidden rounded-xl border bg-white">
                    <div className="divide-y">
                        <Row label="Imię i nazwisko *" error={errors.name}>
                            <input className="form-input w-full" value={form.name}
                                   onChange={(e)=>setForm({ ...form, name: e.target.value })}/>
                        </Row>

                        <Row label="E-mail *" error={errors.email}>
                            <input type="email" className="form-input w-full" value={form.email}
                                   onChange={(e)=>setForm({ ...form, email: e.target.value })}/>
                        </Row>

                        <Row label="Telefon" error={errors.phone}>
                            <input className="form-input w-full" value={form.phone ?? ''} onChange={(e)=>setForm({ ...form, phone: e.target.value })}/>
                        </Row>

                        <Row label="Temat" error={errors.subject}>
                            <input className="form-input w-full" value={form.subject ?? ''} onChange={(e)=>setForm({ ...form, subject: e.target.value })}/>
                        </Row>

                        <Row label="Wiadomość" error={errors.message}>
                            <textarea className="form-input w-full min-h-[120px]" value={form.message ?? ''} onChange={(e)=>setForm({ ...form, message: e.target.value })}/>
                        </Row>

                        <Row label="Czy przeczytany">
                            <label className="inline-flex items-center gap-2">
                                <input type="checkbox" checked={form.is_read} onChange={(e)=>setForm({ ...form, is_read: e.target.checked })}/>
                                <span>Tak</span>
                            </label>
                        </Row>

                        <Row label="Utworzono">
                            <input className="form-input w-64" value={created} readOnly />
                        </Row>
                    </div>

                    <div className="flex items-center justify-end gap-3 border-t px-4 py-3">
                        <Link href={`${BASE}/${contact.id}`} className="text-slate-600 hover:underline">Anuluj</Link>
                        <button onClick={()=>save(true)} className="rounded-lg bg-mint px-3 py-2">Zapisz i kontynuuj</button>
                        <button onClick={()=>save(false)} className="rounded-lg bg-mint px-3 py-2">Zapisz</button>
                    </div>
                </div>
            </main>
        </AdminLayout>
    )
}

function Row({ label, error, children }:{ label:string; error?:string; children:React.ReactNode }) {
    return (
        <div className="grid grid-cols-3 items-start gap-4 px-4 py-3">
            <div className="pt-2 text-slate-600">{label}</div>
            <div className="col-span-2">
                {children}
                {error && <div className="mt-1 text-sm text-rose-600">{error}</div>}
            </div>
        </div>
    )
}
