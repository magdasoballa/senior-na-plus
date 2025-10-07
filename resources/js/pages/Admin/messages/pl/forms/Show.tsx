import { Link, router, usePage } from '@inertiajs/react'
import AdminLayout from '@/layouts/admin-layout'
import * as React from 'react'
import { CheckCircle2, Pencil, Trash2 } from 'lucide-react'

type Form = {
    id: number
    full_name: string
    email: string
    phone: string | null
    language_level: string | null
    profession_trained: string | null
    profession_performed: string | null
    experience: string | null
    skills: string[] | null
    salary: string | null
    references: string | null
    consents: Record<string, boolean> | null
    is_read: boolean
    created_at: string
}

const BASE = '/admin/messages/pl/forms'
const dash = (v?: string | null) => (v?.toString().trim() ? v : '—')

export default function Show() {
    const { form } = usePage<{ form: Form }>().props

    const toggle = () => router.patch(`${BASE}/${form.id}/toggle-read`, {}, { preserveScroll: true })
    const destroyRow = () => {
        if (!confirm('Usunąć formularz?')) return
        router.delete(`${BASE}/${form.id}`)
    }

    const created =
        form.created_at && !Number.isNaN(new Date(form.created_at).getTime())
            ? new Date(form.created_at).toLocaleString('pl-PL', { timeZone: 'Europe/Warsaw' })
            : '—'

    return (
        <AdminLayout>
            <main className="p-6">
                <div className="text-sm text-slate-500">
                    <Link href={BASE} className="hover:underline">
                        Formularze (pl)
                    </Link>{' '}
                    › Szczegóły
                </div>
                <p className="mt-1 text-2xl font-bold">Szczegóły Formularz (pl): {form.full_name}</p>

                <div className="mt-4 overflow-hidden rounded-xl border bg-white">
                    {/* Toolbar */}
                    <div className="flex items-center justify-end gap-2 border-b px-4 py-3">
                        <button onClick={toggle} className="rounded border px-2 py-1 text-sm">
                            Oznacz jako {form.is_read ? 'nieprzeczytany' : 'przeczytany'}
                        </button>
                        <Link
                            href={`${BASE}/${form.id}/edit`}
                            className="inline-flex h-8 w-8 items-center justify-center rounded border"
                            title="Edytuj"
                        >
                            <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                            onClick={destroyRow}
                            className="inline-flex h-8 w-8 items-center justify-center rounded border"
                            title="Usuń"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>

                    <dl className="divide-y [&_dt]:font-medium [&_dd]:text-slate-700">
                        <Row label="ID">{form.id}</Row>
                        <Row label="Imię i nazwisko">{dash(form.full_name)}</Row>
                        <Row label="E-mail">
                            {form.email ? (
                                <a href={`mailto:${form.email}`} className="text-sky-700 hover:underline">
                                    {form.email}
                                </a>
                            ) : (
                                '—'
                            )}
                        </Row>
                        <Row label="Telefon">{dash(form.phone)}</Row>
                        <Row label="Poziom języka">{dash(form.language_level)}</Row>
                        <Row label="Zawód wyuczony">{dash(form.profession_trained)}</Row>
                        <Row label="Zawód wykonywany">{dash(form.profession_performed)}</Row>
                        <Row label="Doświadczenie">{dash(form.experience)}</Row>
                        <Row label="Umiejętności">
                            {form.skills && form.skills.length ? (
                                <div className="flex flex-wrap gap-1">
                                    {form.skills.map((s, i) => (
                                        <span key={i} className="rounded-full border px-2 py-0.5 text-xs">
                      {s}
                    </span>
                                    ))}
                                </div>
                            ) : (
                                '—'
                            )}
                        </Row>
                        <Row label="Wynagrodzenie">{dash(form.salary)}</Row>
                        <Row label="Referencje">{dash(form.references)}</Row>
                        <Row label="Data wysłania">{created}</Row>
                        <Row label="Zgody">{form.consents ? 'Zaznaczone wszystkie' : '—'}</Row>
                        <Row label="Czy przeczytany">
                            {form.is_read ? <CheckCircle2 className="inline h-5 w-5 text-emerald-600" /> : '—'}
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
