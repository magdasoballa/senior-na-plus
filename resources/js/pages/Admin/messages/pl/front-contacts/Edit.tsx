import { Link, router, usePage } from '@inertiajs/react'
import AdminLayout from '@/layouts/admin-layout'
import * as React from 'react'
import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'

type Contact = {
    id: number
    full_name: string
    email: string
    phone: string | null
    language_level: string | null
    is_read: boolean
    created_at: string
}

const BASE = '/admin/messages/pl/front-contacts'

export default function Edit() {
    const { contact, errors, flash } = usePage<{
        contact: Contact
        errors: Record<string, string>
        flash?: { success?: string; error?: string }
    }>().props

    const [form, setForm] = useState<Contact>({ ...contact })
    const [saved, setSaved] = useState(false)

    const save = (stay = false) => {
        router.put(
            `${BASE}/${contact.id}`,
            { ...form, stay },
            {
                preserveScroll: true,
                onSuccess: () => {
                    if (stay) {
                        setSaved(true)
                        setTimeout(() => setSaved(false), 2500)
                    } else {
                        // wymuś powrót do listy niezależnie od redirectu backendu
                        router.visit(BASE, { replace: true })
                    }
                },
            }
        )
    }

    return (
        <AdminLayout>
            <main className="p-6">
                <p className="mt-1 text-2xl font-bold">Edycja kontaktu #{contact.id}</p>

                {/* Flash z backendu */}
                {flash?.success && (
                    <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-800">
                        <CheckCircle2 className="h-4 w-4" />
                        {flash.success}
                    </div>
                )}
                {/* Lokalne „zapisano” po Zapisz i kontynuuj */}
                {saved && !flash?.success && (
                    <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-800">
                        <CheckCircle2 className="h-4 w-4" />
                        Zapisano zmiany
                    </div>
                )}

                <div className="mt-4 overflow-hidden rounded-xl border bg-white">
                    <div className="divide-y">
                        <Row label="Imię i nazwisko *" error={errors.full_name}>
                            <input
                                className="w-full rounded-xl border bg-white px-3 py-2 outline-none focus:border-mint focus:ring-2 focus:ring-mint/30"
                                value={form.full_name}
                                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                            />
                        </Row>

                        <Row label="E-mail *" error={errors.email}>
                            <input
                                type="email"
                                className="w-full rounded-xl border bg-white px-3 py-2 outline-none focus:border-mint focus:ring-2 focus:ring-mint/30"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                            />
                        </Row>

                        <Row label="Telefon" error={errors.phone}>
                            <input
                                className="w-full rounded-xl border bg-white px-3 py-2 outline-none focus:border-mint focus:ring-2 focus:ring-mint/30"
                                value={form.phone ?? ''}
                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            />
                        </Row>

                        <Row label="Poziom języka" error={errors.language_level}>
                            <input
                                className="w-full rounded-xl border bg-white px-3 py-2 outline-none focus:border-mint focus:ring-2 focus:ring-mint/30"
                                value={form.language_level ?? ''}
                                onChange={(e) => setForm({ ...form, language_level: e.target.value })}
                            />
                        </Row>

                        <Row label="Czy przeczytany">
                            <div className="inline-flex items-center gap-2 rounded-xl border px-3 py-2">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-slate-300"
                                    checked={form.is_read}
                                    onChange={(e) => setForm({ ...form, is_read: e.target.checked })}
                                />
                                <span>Tak</span>
                            </div>
                        </Row>

                        <Row label="Utworzono">
                            <input
                                className="w-64 rounded-xl border bg-slate-50 px-3 py-2"
                                value={new Date(form.created_at).toLocaleString()}
                                readOnly
                            />
                        </Row>
                    </div>

                    <div className="flex items-center justify-end gap-3 border-t px-4 py-3">
                        <Link href={BASE} className="text-slate-600 hover:underline">
                            Anuluj
                        </Link>
                        <button
                            onClick={() => save(true)}
                            className="rounded-lg bg-mint px-3 py-2 font-semibold hover:brightness-110"
                        >
                            Zapisz i kontynuuj
                        </button>
                        <button
                            onClick={() => save(false)}
                            className="rounded-lg bg-mint px-3 py-2 font-semibold hover:brightness-110"
                        >
                            Zapisz
                        </button>
                    </div>
                </div>
            </main>
        </AdminLayout>
    )
}

function Row({
                 label,
                 error,
                 children,
             }: {
    label: string
    error?: string
    children: React.ReactNode
}) {
    return (
        <div className="grid grid-cols-3 items-start gap-4 px-4 py-3">
            <div className="pt-2 text-slate-700">{label}</div>
            <div className="col-span-2">
                {children}
                {error && <div className="mt-1 text-sm text-rose-600">{error}</div>}
            </div>
        </div>
    )
}
