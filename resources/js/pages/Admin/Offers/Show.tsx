import AdminLayout from '@/layouts/admin-layout'
import { Link, usePage } from '@inertiajs/react'
import { useMemo, useState } from 'react'
import { CheckCircle2, Pencil, XCircle } from 'lucide-react'

type DictItem = { id: number | string; name: string; checked?: boolean }

type Offer = {
    id: number | string
    title: string
    start_date?: string | null
    country?: string | null
    region?: string | null
    city?: string | null
    new_city?: string | null
    language?: string | null
    wage?: number | string | null
    description?: string | null
    is_visible?: boolean
    duties?: DictItem[]              // z checked = true/false
    requirements?: DictItem[]        // z checked = true/false
    perks?: DictItem[]               // tylko zielone (checked=true) — jeśli masz, renderujemy jako zielone
}

export default function Show() {
    const { offer } = usePage<{ offer: Offer }>().props
    const [openDesc, setOpenDesc] = useState(false)

    const duties = useMemo(() => splitByChecked(offer?.duties), [offer?.duties])
    const reqs   = useMemo(() => splitByChecked(offer?.requirements), [offer?.requirements])
    const perks  = useMemo(() => splitByChecked(offer?.perks), [offer?.perks])

    return (
        <AdminLayout>
            <main className="p-6">
                {/* --- Breadcrumbs (powrót do listy) --- */}
                <div className="text-sm text-slate-500">
                    <Link href="/admin/offers" className="text-sky-700 hover:underline">
                        Oferty
                    </Link>
                    &nbsp;&rsaquo;&nbsp; Szczegóły oferty #{offer?.id}
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-xl font-semibold">
                        Szczegóły Oferta: {offer?.title}
                    </p>
                    <div className="flex items-center gap-2">
                        <Link
                            href={`/admin/offers/${encodeURIComponent(String(offer?.id))}/edit`}
                            className="rounded-lg border px-3 py-2 hover:bg-slate-50"
                            title="Edytuj"
                        >
                            <Pencil className="h-4 w-4" />
                        </Link>
                        <Link
                            href="/admin/offers"
                            className="rounded-lg border px-3 py-2 hover:bg-slate-50"
                            title="Powrót"
                        >
                            ↩︎
                        </Link>
                    </div>
                </div>

                <section className="mt-4 rounded-xl border bg-white">
                    <dl className="divide-y">
                        <Row label="ID">{offer?.id}</Row>
                        <Row label="Tytuł">{offer?.title}</Row>
                        <Row label="Data wyjazdu">{formatDate(offer?.start_date)}</Row>
                        <Row label="Kraj">{offer?.country ?? '—'}</Row>
                        <Row label="Region">{offer?.region ?? '—'}</Row>
                        <Row label="Miasto">{offer?.city ?? '—'}</Row>
                        <Row label="Nowe miasto">{offer?.new_city ?? '—'}</Row>
                        <Row label="Język">{offer?.language ?? '—'}</Row>

                        {/* Obowiązki: zielone (tak) po lewej, czerwone (nie) po prawej */}
                        <Row label="Obowiązki">
                            <TwoCols
                                left={<DotList color="green" items={duties.yes} />}
                                right={<DotList color="red"   items={duties.no} />}
                            />
                        </Row>

                        {/* Wymagania */}
                        <Row label="Wymagania">
                            <TwoCols
                                left={<DotList color="green" items={reqs.yes} />}
                                right={<DotList color="red"   items={reqs.no} />}
                            />
                        </Row>

                        {/* Oferujemy – zwykle tylko zielone */}
                        <Row label="Oferujemy">
                            <TwoCols
                                left={<DotList color="green" items={perks.yes} />}
                                right={<DotList color="red"   items={perks.no} />}
                            />
                        </Row>

                        <Row label="Stawka">{formatWage(offer?.wage)}</Row>

                        <Row
                            label="Opis"
                            right={
                                offer?.description ? (
                                    <button
                                        type="button"
                                        onClick={() => setOpenDesc(s => !s)}
                                        className="text-sky-700 hover:underline"
                                    >
                                        {openDesc ? 'Ukryj Zawartość' : 'Pokaż Zawartość'}
                                    </button>
                                ) : null
                            }
                        >
                            {openDesc && offer?.description ? (
                                <pre className="whitespace-pre-wrap text-slate-700">
                  {offer?.description}
                </pre>
                            ) : (
                                offer?.description ? '—' : '—'
                            )}
                        </Row>

                        <Row label="Widoczny">
              <span className="inline-flex items-center gap-2">
                {offer.is_visible ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                ) : (
                    <XCircle className="h-5 w-5 text-rose-600" />
                )}
              </span>
                        </Row>
                    </dl>
                </section>
            </main>
        </AdminLayout>
    )
}

/* --- helpers / pod-komponenty --- */

function Row({
                 label,
                 children,
                 right,
             }: {
    label: string
    children?: React.ReactNode
    right?: React.ReactNode
}) {
    return (
        <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-3">
            <dt className="text-sm font-medium">{label}</dt>
            <dd className="md:col-span-2 flex items-start justify-between">
                <div className="min-h-[24px]">{children ?? '—'}</div>
                {right}
            </dd>
        </div>
    )
}

function TwoCols({ left, right }: { left?: React.ReactNode; right?: React.ReactNode }) {
    return (
        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
            <div>{left}</div>
            <div>{right}</div>
        </div>
    )
}

function DotList({ items, color }: { items?: DictItem[]; color: 'green' | 'red' }) {
    if (!items || items.length === 0) return <span className="text-slate-400">—</span>
    const dot =
        color === 'green'
            ? 'inline-block h-2.5 w-2.5 rounded-full bg-emerald-500'
            : 'inline-block h-2.5 w-2.5 rounded-full bg-rose-500'
    return (
        <ul className="space-y-1">
            {items.map(i => (
                <li key={String(i.id)} className="flex items-center gap-2">
                    <span className={dot} />
                    <span>{i.name}</span>
                </li>
            ))}
        </ul>
    )
}

function splitByChecked(arr?: DictItem[]) {
    const list = Array.isArray(arr) ? arr : []
    return {
        yes: list.filter(i => i.checked === true || i.checked === undefined), // domyślnie zielone
        no: list.filter(i => i.checked === false),
    }
}

function formatDate(d?: string | null) {
    if (!d) return '—'
    const parsed = new Date(d)
    return isNaN(parsed.getTime()) ? d : parsed.toLocaleDateString('pl-PL')
}

function formatWage(w: number | string | null | undefined) {
    if (w === null || w === undefined || w === '') return '—'
    if (typeof w === 'number') {
        return new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'EUR' }).format(w)
    }
    // jeśli backend zwraca np. "2000€"
    return String(w)
}
