import AdminLayout from '@/layouts/admin-layout'
import { Link } from '@inertiajs/react'

type Props = { stats?: { offers: number; applications: number } | null }

function Dashboard({ stats }: Props) {
    return (
        <>
            <h1 className="text-3xl font-bold">Panel administracyjny</h1>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3 text-black">
                <Card title="Oferty" value={stats?.offers ?? 0} href="/admin/offers" cta="Zarządzaj ofertami" />
                <Card title="Aplikacje" value={stats?.applications ?? 0} href="/admin/applications" cta="Zobacz aplikacje" />
            </div>
        </>
    )
}

Dashboard.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>
export default Dashboard

function Card({ title, value, href, cta }: { title: string; value: number | string; href: string; cta: string }) {
    return (
        <div className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="text-sm">{title}</div>
            <div className="mt-1 text-3xl font-extrabold">{value}</div>
            <Link href={href} className="mt-4 inline-flex rounded-full bg-mint px-4 py-1 font-semibold">
                {cta}
            </Link>
        </div>
    )
}
