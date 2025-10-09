import { Link, router, usePage } from '@inertiajs/react'
import AdminLayout from '@/layouts/admin-layout'
import { useMemo, useState } from 'react'
import * as React from 'react'

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
    is_read: boolean
    created_at: string
}

const BASE = '/admin/messages/pl/forms'

export default function Edit() {
    const { form: initial, errors } = usePage<{ form: Form; errors: Record<string, string> }>().props

    const [form, setForm] = useState<Form>({ ...initial })
    const [skillsStr, setSkillsStr] = useState<string>((initial.skills ?? []).join(', '))

    const save = (stay = false) => {
        const skillsArr = skillsStr
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)

        router.put(
            `${BASE}/${form.id}`,
            { ...form, skills: skillsArr, stay },
            { preserveScroll: true }
        )
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
                    › Edycja
                </div>
                <p className="mt-1 text-2xl font-bold">Aktualizacja Formularz (pl): {form.full_name}</p>

                <div className="mt-4 overflow-hidden rounded-xl border bg-white">
                    <div className="divide-y">
                        <Row label="Imię i nazwisko *" error={errors.full_name}>
                            <input
                                className="form-input w-full rounded-md border px-3 py-2"
                                value={form.full_name}
                                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                            />
                        </Row>

                        <Row label="E-mail *" error={errors.email}>
                            <input
                                type="email"
                                className="form-input w-full rounded-md border px-3 py-2"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                            />
                        </Row>

                        <Row label="Telefon" error={errors.phone}>
                            <input
                                className="form-input w-full rounded-md border px-3 py-2"
                                value={form.phone ?? ''}
                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            />
                        </Row>

                        <Row label="Poziom języka" error={errors.language_level}>
                            <select
                                className="form-input w-full rounded-md border px-3 py-2"
                                value={form.language_level ?? ''}
                                onChange={(e) => setForm({ ...form, language_level: e.target.value || null })}
                            >
                                <option value="">—</option>
                                <option>Brak języka</option>
                                <option>Podstawowa</option>
                                <option>Komunikatywna</option>
                                <option>Bardzo dobra</option>
                            </select>
                        </Row>

                        <Row label="Zawód wyuczony" error={errors.profession_trained}>
                            <input
                                className="form-input w-full rounded-md border px-3 py-2"
                                value={form.profession_trained ?? ''}
                                onChange={(e) => setForm({ ...form, profession_trained: e.target.value })}
                            />
                        </Row>

                        <Row label="Zawód wykonywany" error={errors.profession_performed}>
                            <input
                                className="form-input w-full rounded-md border px-3 py-2"
                                value={form.profession_performed ?? ''}
                                onChange={(e) => setForm({ ...form, profession_performed: e.target.value })}
                            />
                        </Row>

                        <Row label="Doświadczenie" error={errors.experience}>
                            <input
                                className="form-input w-full rounded-md border px-3 py-2"
                                value={form.experience ?? ''}
                                onChange={(e) => setForm({ ...form, experience: e.target.value })}
                            />
                        </Row>

                        <Row label="Umiejętności (oddzielaj przecinkami)">
                            <input
                                className="form-input w-full rounded-md border px-3 py-2"
                                value={skillsStr}
                                onChange={(e) => setSkillsStr(e.target.value)}
                                placeholder="np. prawo jazdy, gotowanie, porządki"
                            />
                        </Row>

                        <Row label="Wynagrodzenie" error={errors.salary}>
                            <input
                                className="form-input w-full rounded-md border px-3 py-2"
                                value={form.salary ?? ''}
                                onChange={(e) => setForm({ ...form, salary: e.target.value })}
                            />
                        </Row>

                        <Row label="Referencje" error={errors.references}>
              <textarea
                  className="form-input w-full rounded-md border px-3 py-2"
                  rows={4}
                  value={form.references ?? ''}
                  onChange={(e) => setForm({ ...form, references: e.target.value })}
              />
                        </Row>

                        <Row label="Czy przeczytany">
                            <label className="inline-flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={form.is_read}
                                    onChange={(e) => setForm({ ...form, is_read: e.target.checked })}
                                />
                                <span>Tak</span>
                            </label>
                        </Row>

                        <Row label="Data wysłania">
                            <input className="form-input w-64 rounded-md border px-3 py-2" value={created} readOnly />
                        </Row>
                    </div>

                    <div className="flex items-center justify-end gap-3 border-t px-4 py-3">
                        <Link href={`${BASE}/${form.id}`} className="rounded-lg border px-4 py-2 hover:bg-slate-50">
                            Anuluj
                        </Link>
                        <button onClick={() => save(true)} className="rounded-lg bg-mint px-4 py-2 font-semibold cursor-pointer">
                            Aktualizuj i Kontynuuj Edycję
                        </button>
                        <button onClick={() => save(false)} className="rounded-lg bg-mint px-4 py-2 font-semibold cursor-pointer">
                            Aktualizacja Formularz (pl)
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
            <div className="pt-2 text-slate-600">{label}</div>
            <div className="col-span-2">
                {children}
                {error && <div className="mt-1 text-sm text-rose-600">{error}</div>}
            </div>
        </div>
    )
}
