import AppLayout from '@/layouts/app-layout'
import { Link } from '@inertiajs/react'

type Props = {
    isAdmin: boolean
    stats?: { offers: number; applications: number } | null
}

export default function Dashboard({ isAdmin, stats }: Props) {
    return (
        <AppLayout>
            <div className="mx-auto max-w-5xl p-6">
                <h1 className="text-2xl font-bold">
                    {isAdmin ? 'Panel administracyjny' : 'Twoje konto'}
                </h1>

                {isAdmin ? (
                    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3 text-black">
                        <Card
                            title="Oferty"
                            value={stats?.offers ?? 0}
                            href="/admin/offers"
                            cta="Zarządzaj ofertami"
                        />
                        <Card
                            title="Aplikacje"
                            value={stats?.applications ?? 0}
                            href="/admin/applications"
                            cta="Zobacz aplikacje"
                        />

                    </div>
                ) : (
                    <div className="mt-6 space-y-4">

                        <Link
                            href="/"
                            className="inline-flex rounded-full bg-coral px-5 py-2 font-bold "
                        >
                            Przeglądaj oferty
                        </Link>
                    </div>
                )}
            </div>
        </AppLayout>
    )
}

function Card({
                  title,
                  value,
                  href,
                  cta,
              }: {
    title: string
    value: number | string
    href: string
    cta: string
}) {
    return (
        <div className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="text-sm ">{title}</div>
            <div className="mt-1 text-3xl font-extrabold">{value}</div>
            <Link
                href={href}
                className="mt-4 inline-flex rounded-full bg-mint px-4 py-1 font-semibold"
            >
                {cta}
            </Link>
        </div>
    )
}
