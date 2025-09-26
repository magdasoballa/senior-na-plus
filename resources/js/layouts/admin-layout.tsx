import AppLayout from '@/layouts/app-layout'
import { Link, usePage } from '@inertiajs/react'
import { useState } from 'react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <AppLayout>
            <div className="flex min-h-[calc(100vh-64px)]">
                <AdminSidebar />
                <main className="flex-1 p-6">{children}</main>
            </div>
        </AppLayout>
    )
}

/** ------- Sidebar + pomocnicze komponenty ------- */
function AdminSidebar() {
    return (
        <aside className="hidden w-72 shrink-0 border-r bg-white/80 p-4 md:block">
            <div className="px-2 pb-3 text-xs font-semibold uppercase tracking-wide text-green">
                Ustawienia
            </div>
            <NavList
                items={[
                    { label: 'Strony', href: '/admin/settings/pages' },
                    { label: 'Linki społecznościowe', href: '/admin/settings/social-links' },
                    { label: 'Banery', href: '/admin/settings/banners' },
                    { label: 'Ustawienia portalu', href: '/admin/settings/portal' },
                    { label: 'Popup', href: '/admin/settings/popups' },
                ]}
            />

            <Section title="Słowniki">
                <NavList
                    items={[
                        { label: 'Umiejętności', href: '/admin/dictionaries/skills' },
                        { label: 'Osoby do opieki', href: '/admin/dictionaries/care-targets' },
                        { label: 'Mobilność podopiecznych', href: '/admin/dictionaries/mobility' },
                        { label: 'Płcie osób do opieki', href: '/admin/dictionaries/genders' },
                        { label: 'Doświadczenia w opiece', href: '/admin/dictionaries/experience' },
                        { label: 'Wymagania rekrutacyjne', href: '/admin/dictionaries/recruitment-reqs' },
                        { label: 'Obowiązki', href: '/admin/dictionaries/duties' },
                    ]}
                />
            </Section>

            <Section title="Oferty">
                <NavList
                    items={[
                        { label: 'Obowiązki', href: '/admin/offers/duties' },
                        { label: 'Wymagania', href: '/admin/offers/requirements' },
                        { label: 'Oferujemy', href: '/admin/offers/perks' },
                        { label: 'Oferty', href: '/admin/offers' },
                    ]}
                />
            </Section>

            <Section title="Zgody">
                <NavList
                    items={[
                        { label: 'Formularze', href: '/admin/consents/forms' },
                        { label: 'Kontakty', href: '/admin/consents/contacts' },
                    ]}
                />
            </Section>

            <Section title="Wiadomości">
                <div className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-wide text-green">
                    Wersja PL
                </div>
                <NavList
                    items={[
                        { label: 'Kontakty Front (pl)', href: '/admin/messages/pl/front' },
                        { label: 'Kontakty Strona (pl)', href: '/admin/messages/pl/site' },
                        { label: 'Formularze (pl)', href: '/admin/messages/pl/forms', badge: 1 },
                    ]}
                />
                <div className="px-2 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-wide text-green">
                    Wersja DE
                </div>
                <NavList
                    items={[
                        { label: 'Kontakty Strona (de)', href: '/admin/messages/de/site' },
                        { label: 'Formularze (de)', href: '/admin/messages/de/forms' },
                    ]}
                />
            </Section>

            <Section title="Partnerzy">
                <NavList items={[{ label: 'Partnerzy', href: '/admin/partners' }]} />
            </Section>

            <Section title="Użytkownicy">
                <NavList items={[{ label: 'Strona główna', href: '/admin/users' }]} />
            </Section>
        </aside>
    )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    const [open, setOpen] = useState(true)
    return (
        <div className="mt-4">
            <button
                onClick={() => setOpen((v) => !v)}
                className="flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-sm font-semibold text-green hover:bg-slate-50"
                type="button"
            >
                <span>{title}</span>
                <span className={`transition-transform ${open ? 'rotate-180' : ''}`}>▾</span>
            </button>
            {open && <div className="mt-1">{children}</div>}
        </div>
    )
}

type Item = { label: string; href: string; badge?: number }

function NavList({ items }: { items: Item[] }) {
    const { url } = usePage()
    const isActive = (href: string) => {
        // Aktywne, jeśli dokładnie ten adres, albo ścieżka z podstroną (/edit, /create, /:id) lub zapytaniem
        return (
            url === href ||
            url.startsWith(`${href}/`) ||
            url.startsWith(`${href}?`)
        )
    }

    return (
        <nav className="space-y-1 px-1">
            {items.map((item) => {
                const active = isActive(item.href)
                return (
                    <Link
                        key={item.href + item.label}
                        href={item.href}
                        aria-current={active ? 'page' : undefined}
                        className={[
                            'group flex items-center justify-between rounded-md px-2 py-2 text-sm',
                            active
                                ? 'bg-slate-100 font-semibold text-green ring-1 ring-inset ring-slate-200'
                                : 'text-green hover:bg-slate-50'
                        ].join(' ')}
                    >
            <span className="flex items-center gap-2">
              {/* pionowa kreska po lewej dla aktywnej pozycji */}
                <span
                    className={[
                        'h-4 w-1 rounded-full transition-opacity',
                        active ? 'bg-green opacity-100' : 'opacity-0 group-hover:opacity-30 bg-slate-300'
                    ].join(' ')}
                    aria-hidden
                />
                {item.label}
            </span>

                        {/* badge – odkomentuj, jeśli chcesz pokazywać liczby */}
                        {/* {typeof item.badge === 'number' && item.badge > 0 && (
              <span className="ml-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-500 px-1 text-xs font-bold text-white">
                {item.badge}
              </span>
            )} */}
                    </Link>
                )
            })}
        </nav>
    )
}
