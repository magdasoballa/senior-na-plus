// resources/js/pages/Admin/settings/portal/Show.tsx
import { Link, usePage } from '@inertiajs/react'
import AdminLayout from '@/layouts/admin-layout'
import { useState, type ReactNode } from 'react'

type Setting = {
    id: number

    // bazowe (fallback)
    phone?: string | null
    address?: string | null
    email?: string | null

    // lokalizowane (opcjonalnie)
    phone_pl?: string | null
    phone_de?: string | null
    address_pl?: string | null
    address_de?: string | null
    email_pl?: string | null
    email_de?: string | null

    created_at?: string | null
    updated_at?: string | null
}

const BASE = '/admin/settings/portal'

export default function Show() {
    const { setting } = usePage<{ setting: Setting }>().props

    return (
        <AdminLayout>
            <main className="p-6">
                <div className="text-sm text-slate-500">Zasoby › Ustawienia portalu › #{setting.id}</div>
                <div className="mt-1 flex items-center justify-between">
                    <p className="text-2xl font-bold">Szczegóły Ustawienie portalu: {setting.id}</p>
                    <div className="flex gap-2">
                        <Link href={`${BASE}/${setting.id}/edit`} className="rounded-lg border px-3 py-1 hover:bg-slate-50" aria-label="Edytuj">
                            ✎
                        </Link>
                        <Link href={BASE} className="rounded-lg border px-3 py-1 hover:bg-slate-50" aria-label="Powrót">
                            ↩︎
                        </Link>
                    </div>
                </div>

                <div className="mt-6 overflow-hidden rounded-xl border bg-white">
                    <dl className="divide-y">
                        <Row label="ID">{setting.id}</Row>

                        <LocalizedRow
                            label="Telefon"
                            pl={setting.phone_pl ?? setting.phone}
                            de={setting.phone_de ?? setting.phone}
                        />

                        <LocalizedRow
                            label="Adres"
                            pl={setting.address_pl ?? setting.address}
                            de={setting.address_de ?? setting.address}
                        />

                        <LocalizedRow
                            label="Email"
                            pl={setting.email_pl ?? setting.email}
                            de={setting.email_de ?? setting.email}
                            mailto
                        />
                    </dl>
                </div>

                <div className="py-6 text-center text-xs text-slate-500">
                    Senior na plus {new Date().getFullYear()}
                </div>
            </main>
        </AdminLayout>
    )
}

/* --- helpers --- */

function Row({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-3">
            <dt className="text-sm font-medium">{label}</dt>
            <dd className="md:col-span-2">{children}</dd>
        </div>
    )
}

/** Wiersz z lokalizacją (własny przełącznik PL/DE w każdym wierszu) */
function LocalizedRow({
                          label,
                          pl,
                          de,
                          mailto = false,
                      }: {
    label: string
    pl?: string | null
    de?: string | null
    mailto?: boolean // dla maila robi <a href="mailto:...">
}) {
    const [lang, setLang] = useState<'pl' | 'de'>('pl')
    const val = (lang === 'pl' ? pl : de) ?? ''
    const trimmed = typeof val === 'string' ? val.trim() : ''
    const content = mailto && trimmed
        ? <a href={`mailto:${trimmed}`} className="text-sky-700 hover:underline">{trimmed}</a>
        : (trimmed ? trimmed : '—')

    return (
        <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-3">
            <dt className="text-sm font-medium">{label}</dt>
            <dd className="md:col-span-2 flex items-center justify-between">
                <div>{content}</div>
                <LangSwitch lang={lang} onChange={setLang} />
            </dd>
        </div>
    )
}

function LangSwitch({ lang, onChange }: { lang: 'pl' | 'de'; onChange: (l: 'pl' | 'de') => void }) {
    return (
        <div className="text-sm">
            <button
                type="button"
                onClick={() => onChange('pl')}
                className={`mr-3 hover:underline ${lang === 'pl' ? 'text-sky-600 font-semibold' : ''}`}
            >
                Polski
            </button>
            <button
                type="button"
                onClick={() => onChange('de')}
                className={`hover:underline ${lang === 'de' ? 'text-sky-600 font-semibold' : ''}`}
            >
                Niemiecki
            </button>
        </div>
    )
}
