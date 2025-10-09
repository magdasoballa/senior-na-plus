import { Link, router, usePage } from '@inertiajs/react'
import AdminLayout from '@/layouts/admin-layout'
import { useState } from 'react'
import * as React from 'react'
import { CheckCircle2 } from 'lucide-react'

type Form = {
    id: number
    full_name: string
    zip: string | null
    city: string | null
    phone: string | null
    start_at: string | null
    timezone?: string | null
    people_on_site: string | null
    mobility: string | null
    gender: string | null
    sent_at: string | null
    consents: string | null
    is_read: boolean
}

const BASE = '/admin/messages/de/forms'

const fieldClass =
    'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 ' +
    'focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-400'

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

const PEOPLE_OPTIONS = [
    'jedna osoba',
    'dwie ale tylko jedna osoba wymaga opieki',
    'dwie osoby (obie wymagają opieki)',
    'trzy osoby',
]
const MOBILITY_OPTIONS = [
    'pełna mobilność',
    'mobilność lekko ograniczona używa, rolatora (chodzika)',
    'ograniczona – porusza się na wózku',
    'leżący',
]
const GENDER_OPTIONS = ['Mężczyzna', 'Kobieta', 'Para', '—']

export default function Edit() {
    const { form: initial, errors, flash } = usePage<{
        form: Form
        errors: Record<string, string>
        flash?: { success?: string; error?: string }
    }>().props

    const [form, setForm] = useState<Form>({ ...initial })
    const [saved, setSaved] = useState(false)
    const set = <K extends keyof Form>(k: K) => (v: Form[K]) => setForm({ ...form, [k]: v })

    const save = (stay = false) =>
        router.put(
            `${BASE}/${form.id}`,
            { ...form, stay },
            {
                preserveScroll: true,
                onSuccess: () => {
                    if (stay) {
                        setSaved(true)
                        window.setTimeout(() => setSaved(false), 2500)
                    } else {
                        // po zwykłym zapisie wracamy do LISTY
                        router.visit(BASE, { replace: true })
                    }
                },
            }
        )

    const sent =
        form.sent_at && !Number.isNaN(new Date(form.sent_at).getTime())
            ? new Date(form.sent_at).toLocaleString('pl-PL', {
                day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
            })
            : '—'

    return (
        <AdminLayout>
            <main className="p-6">
                <p className="text-2xl font-bold">Aktualizacja Formularz (de): {form.id}</p>

                {/* Flash z backendu */}
                {flash?.success && (
                    <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-800">
                        <CheckCircle2 className="h-4 w-4" />
                        {flash.success}
                    </div>
                )}
                {/* Lokalne potwierdzenie po „Aktualizuj i Kontynuuj Edycję” */}
                {saved && !flash?.success && (
                    <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-800">
                        <CheckCircle2 className="h-4 w-4" />
                        Zapisano zmiany
                    </div>
                )}

                <div className="mt-4 overflow-hidden rounded-xl border bg-white">
                    <Row label="Imię i nazwisko *" error={errors?.full_name}>
                        <input className={fieldClass} value={form.full_name} onChange={(e)=>set('full_name')(e.target.value)} />
                    </Row>

                    <Row label="Kod pocztowy *" error={errors?.zip}>
                        <input className={fieldClass} value={form.zip ?? ''} onChange={(e)=>set('zip')(e.target.value)} />
                    </Row>

                    <Row label="Miasto *" error={errors?.city}>
                        <input className={fieldClass} value={form.city ?? ''} onChange={(e)=>set('city')(e.target.value)} />
                    </Row>

                    <Row label="Telefon *" error={errors?.phone}>
                        <input className={fieldClass} value={form.phone ?? ''} onChange={(e)=>set('phone')(e.target.value)} />
                    </Row>

                    <Row label="Data rozpoczęcia opieki *" error={errors?.start_at}>
                        <div className="flex items-center gap-3">
                            <input className={`${fieldClass} w-72`} value={form.start_at ?? ''} onChange={(e)=>set('start_at')(e.target.value)} />
                            <span className="text-slate-500">{form.timezone ?? 'Europe/Warsaw'}</span>
                        </div>
                    </Row>

                    <Row label="Ile osób jest na miejscu *" error={errors?.people_on_site}>
                        <select className={fieldClass} value={form.people_on_site ?? ''} onChange={(e)=>set('people_on_site')(e.target.value)}>
                            <option value="">—</option>
                            {PEOPLE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                    </Row>

                    <Row label="Mobilność podopiecznego *" error={errors?.mobility}>
                        <select className={fieldClass} value={form.mobility ?? ''} onChange={(e)=>set('mobility')(e.target.value)}>
                            <option value="">—</option>
                            {MOBILITY_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                    </Row>

                    <Row label="Płeć osoby do opieki" error={errors?.gender}>
                        <select className={fieldClass} value={form.gender ?? ''} onChange={(e)=>set('gender')(e.target.value)}>
                            {GENDER_OPTIONS.map(o => <option key={o} value={o === '—' ? '' : o}>{o}</option>)}
                        </select>
                    </Row>

                    {/* ZGODY (read-only) */}
                    <Row label="Zgody">
                        <input className={fieldClass} value={form.consents ?? '—'} readOnly />
                    </Row>

                    <Row label="Data wysłania">
                        <div className="flex items-center gap-3">
                            <input className={`${fieldClass} w-72`} value={sent} readOnly />
                            <span className="text-slate-500">{form.timezone ?? 'Europe/Warsaw'}</span>
                        </div>
                    </Row>

                    <Row label="Czy przeczytany">
                        <label className="inline-flex items-center gap-2">
                            <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-slate-300 focus:ring-2 focus:ring-slate-200"
                                checked={form.is_read}
                                onChange={(e)=>set('is_read')(e.target.checked)}
                            />
                            <span>Tak</span>
                        </label>
                    </Row>

                    <div className="flex items-center justify-end gap-3 border-t px-4 py-3">
                        {/* Anuluj → LISTA */}
                        <Link href={BASE} className="rounded-lg border px-4 py-2 hover:bg-slate-50">Anuluj</Link>
                        <button onClick={()=>save(true)} className="rounded-lg bg-mint px-4 py-2 font-semibold cursor-pointer">
                            Aktualizuj i Kontynuuj Edycję
                        </button>
                        <button onClick={()=>save(false)} className="rounded-lg bg-mint px-4 py-2 font-semibold cursor-pointer">
                            Aktualizacja Formularz (de)
                        </button>
                    </div>
                </div>
            </main>
        </AdminLayout>
    )
}
