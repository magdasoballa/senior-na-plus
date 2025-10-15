import AdminLayout from '@/layouts/admin-layout'
import { Link, router, usePage } from '@inertiajs/react'
import * as React from 'react'

type Stats = {
    pl_site_contacts: number
    pl_job_forms: number
    offers: number
}
type Periods = {
    days_site_pl: number
    days_apps_pl: number
    days_offers: number
}
type PageProps = { stats: Stats; periods: Periods }

const DAY_OPTS = [7, 30, 90, 180, 365]

function Dashboard() {
    const { stats, periods } = usePage<PageProps>().props

    return (
        <AdminLayout>
            <main className="p-6">
                <h1 className="mb-4 text-3xl font-bold">Panel główny</h1>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <MetricCard
                        title={<>Formularze kontaktowe<br/> (Strona) PL</>}
                        value={stats.pl_site_contacts}
                        days={periods.days_site_pl}
                        onDays={(d) => reload({ days_site_pl: d, keep: ['days_apps_pl','days_offers'] })}
                        href="/admin/messages/pl/site-contacts"
                    />

                    <MetricCard
                        title={<>Formularze ofert<br/> pracy PL</>}
                        value={stats.pl_job_forms}
                        days={periods.days_apps_pl}
                        onDays={(d) => reload({ days_apps_pl: d, keep: ['days_site_pl','days_offers'] })}
                        href="/admin/messages/pl/forms"
                    />

                    <MetricCard
                        title="Oferty pracy"
                        value={stats.offers}
                        days={periods.days_offers}
                        onDays={(d) => reload({ days_offers: d, keep: ['days_site_pl','days_apps_pl'] })}
                        href="/admin/offers"
                    />
                </div>
            </main>
        </AdminLayout>
    )
}

Dashboard.layout = (page: React.ReactNode) => <>{page}</>

export default Dashboard

function MetricCard({
                        title, value, days, onDays, href,
                    }: {
    title: React.ReactNode
    value: number
    days: number
    onDays: (d: number) => void
    href: string
}) {
    return (
        // Kafelek ma pełną wysokość i układ kolumnowy
        <div className="h-full rounded-2xl border bg-white p-5 shadow-sm flex flex-col">
            {/* HEADER o stałej wysokości */}
            <div className="mb-3 flex items-start justify-between min-h-[56px]">
                {/* dwie linie max → spójna wysokość */}
                <div className="text-lg font-semibold leading-snug line-clamp-2 pr-3">
                    {title}
                </div>
                <select
                    className="rounded-md border px-2 py-1 text-sm shrink-0"
                    value={days}
                    onChange={(e) => onDays(parseInt(e.target.value))}
                >
                    {DAY_OPTS.map((n) => (
                        <option key={n} value={n}>{n} dni</option>
                    ))}
                </select>
            </div>

            {/* TREŚĆ o stałej wysokości */}
            <div className="flex items-center gap-4 min-h-[64px]">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-mint/30">📈</div>
                <div>
                    <div className="text-4xl font-extrabold leading-none">{value}</div>
                    <div className="text-slate-400 leading-none mt-1">—</div>
                </div>
            </div>

            {/* STOPKA dociśnięta do dołu */}
            <div className="mt-auto pt-4">
                <Link
                    href={href}
                    className="inline-flex rounded-full bg-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-300"
                >
                    Otwórz listę
                </Link>
            </div>
        </div>
    )
}

/** Partial reload tylko z parametrami, które zmieniamy.
 *  Zachowujemy pozostałe okresy, przekazując je w URL (keep[]).
 */
function reload({
                    days_site_pl,
                    days_apps_pl,
                    days_offers,
                    keep = [],
                }: {
    days_site_pl?: number
    days_apps_pl?: number
    days_offers?: number
    keep?: Array<keyof Periods>
}) {
    // Zaciągnij aktualne query z location.search, aby nie wyzerować innych kart:
    const params = new URLSearchParams(window.location.search)
    const setIf = (key: string, val?: number) => {
        if (typeof val === 'number') params.set(key, String(val))
    }

    // zachowaj istniejące okresy, jeśli prosisz o 'keep'
    keep.forEach((k) => {
        const existing = params.get(k)
        if (!existing) {
            // nic – kontroler i tak ma domyślne 30
        }
    })

    setIf('days_site_pl', days_site_pl)
    setIf('days_apps_pl', days_apps_pl)
    setIf('days_offers', days_offers)

    router.get(`/admin`, Object.fromEntries(params as any), {
        preserveState: true,
        replace: true,
        only: ['stats', 'periods'],
    })
}
