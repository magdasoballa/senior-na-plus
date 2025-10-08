import { Link, usePage } from '@inertiajs/react'
import AdminLayout from '@/layouts/admin-layout'
import * as React from 'react'
import { MoreHorizontal, SquarePen, CircleCheck, CircleX } from 'lucide-react'

type Form = {
    id: number
    full_name: string
    zip: string | null
    city: string | null
    phone: string | null
    start_at: string | null
    sent_at: string | null
    timezone?: string | null
    people_on_site: string | null
    mobility: string | null
    gender: string | null
    consents: string | null       // <= TU
    is_read: boolean
}

const BASE = '/admin/messages/de/forms'

export default function Show() {
    const { form } = usePage<{ form: Form }>().props

    const fmt = (iso?: string | null) =>
        iso
            ? new Date(iso).toLocaleString('pl-PL', {
                year: 'numeric', month: '2-digit', day: '2-digit',
                hour: '2-digit', minute: '2-digit',
            })
            : '—'

    const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
        <div className="grid grid-cols-3 gap-4 px-4 py-3">
            <div className="text-slate-600">{label}</div>
            <div className="col-span-2">{children}</div>
        </div>
    )

    return (
        <AdminLayout>
            <main className="p-6">
                <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold">Szczegóły Formularz (de): {form.id}</p>
                    <div className="flex items-center gap-2">
                        <button className="rounded-md border border-slate-300 p-2 text-slate-600 hover:bg-slate-50">
                            <MoreHorizontal className="h-4 w-4" />
                        </button>
                        <Link href={`${BASE}/${form.id}/edit`} className="rounded-md border border-slate-300 p-2 text-slate-600 hover:bg-slate-50">
                            <SquarePen className="h-4 w-4" />
                        </Link>
                    </div>
                </div>

                <div className="mt-4 overflow-hidden rounded-xl border bg-white">
                    <Row label="ID">{form.id}</Row>
                    <Row label="Imię i nazwisko">{form.full_name}</Row>
                    <Row label="Kod pocztowy">{form.zip ?? '—'}</Row>
                    <Row label="Miasto">{form.city ?? '—'}</Row>
                    <Row label="Telefon">{form.phone ?? '—'}</Row>
                    <Row label="Data rozpoczęcia opieki">{fmt(form.start_at)} {form.timezone ?? ''}</Row>
                    <Row label="Ile osób jest na miejscu">{form.people_on_site ?? '—'}</Row>
                    <Row label="Mobilność podopiecznego">{form.mobility ?? '—'}</Row>
                    <Row label="Płeć osoby do opieki">{form.gender ?? '—'}</Row>
                    <Row label="Data wysłania">{fmt(form.sent_at)} {form.timezone ?? ''}</Row>
                    <Row label="Zgody">{form.consents ?? '—'}</Row> {/* <= TU */}
                    <Row label="Czy przeczytany">
                        {form.is_read ? (
                            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-emerald-700"><CircleCheck className="h-4 w-4" /></span>
                        ) : (
                            <span className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-rose-700"><CircleX className="h-4 w-4" /></span>
                        )}
                    </Row>
                </div>

                <div className="mt-4 flex gap-3">
                    <Link href={BASE} className="px-3 py-2 text-slate-600 hover:underline">Powrót</Link>
                    <Link href={`${BASE}/${form.id}/edit`} className="rounded-lg bg-mint px-3 py-2">Edytuj</Link>
                </div>
            </main>
        </AdminLayout>
    )
}
