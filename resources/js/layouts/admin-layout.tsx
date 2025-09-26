import AppLayout from '@/layouts/app-layout'
import { Link, usePage } from '@inertiajs/react'
import { useMemo, useState } from 'react'

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

/** ---------------- Sidebar ---------------- */
function AdminSidebar() {
    const groups: NavGroup[] = [
        {
            title: 'Ustawienia',
            items: [
                { label: 'Strony', href: '/admin/settings/pages' },
                { label: 'Linki społecznościowe', href: '/admin/settings/social-links' },
                { label: 'Banery', href: '/admin/settings/banners' },
                { label: 'Ustawienia portalu', href: '/admin/settings/portal' },
                { label: 'Popup', href: '/admin/settings/popups' },
            ],
        },
        {
            title: 'Słowniki',
            items: [
                { label: 'Umiejętności', href: '/admin/dictionaries/skills' },
                { label: 'Osoby do opieki', href: '/admin/dictionaries/care-targets' },
                { label: 'Mobilność podopiecznych', href: '/admin/dictionaries/mobility' },
                { label: 'Płcie osób do opieki', href: '/admin/dictionaries/genders' },
                { label: 'Doświadczenia w opiece', href: '/admin/dictionaries/experience' },
                { label: 'Wymagania rekrutacyjne', href: '/admin/dictionaries/recruitment-reqs' },
                { label: 'Obowiązki', href: '/admin/dictionaries/duties' }, // ← słownikowe
            ],
        },
        {
            title: 'Oferty',
            items: [
                { label: 'Obowiązki', href: '/admin/offers/duties' },
                { label: 'Wymagania', href: '/admin/offers/requirements' },
                { label: 'Oferujemy', href: '/admin/offers/perks' },
                { label: 'Oferty', href: '/admin/offers', exact: true },
            ],
        },
        {
            title: 'Zgody',
            items: [
                { label: 'Formularze', href: '/admin/consents/forms' },
                { label: 'Kontakty', href: '/admin/consents/contacts' },
            ],
        },
        { title: 'Partnerzy', items: [{ label: 'Partnerzy', href: '/admin/partners' }] },
        { title: 'Użytkownicy', items: [{ label: 'Strona główna', href: '/admin/users' }] },
    ]

    return (
        <aside className="hidden w-72 shrink-0 border-r bg-white/80 p-4 md:block">
            {groups.map((g) => (
                <Section key={g.title} title={g.title} items={g.items} />
            ))}
        </aside>
    )
}

/** ---------------- Pomocnicze ---------------- */
type NavItem = { label: string; href: string; badge?: number }
type NavGroup = { title: string; items: NavItem[] }

function Section({ title, items }: { title: string; items: NavItem[] }) {
    const { url } = usePage()
    const hasActive = useMemo(() => items.some((i) => isActive(url, i.href)), [url, items])
    const [open, setOpen] = useState<boolean>(hasActive || true)

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

            {open && <NavList items={items} />}
        </div>
    )
}

function NavList({
                     items,
                 }: {
    items: { label: string; href: string; badge?: number; exact?: boolean }[]
}) {
    const currentPath =
        typeof window !== 'undefined'
            ? window.location.pathname
            : (typeof location !== 'undefined' ? location.pathname : '');

    const isActive = (href: string, exact?: boolean) => {
        if (exact) return currentPath === href;                // tylko dokładny match
        return currentPath === href || currentPath.startsWith(href + '/'); // prefix dla podstron
    };

    return (
        <nav className="space-y-1 px-1">
            {items.map((item) => {
                const active = isActive(item.href, item.exact);
                return (
                    <Link
                        key={item.href + item.label}
                        href={item.href}
                        className={
                            `group flex items-center justify-between rounded-md px-2 py-2 text-sm hover:bg-slate-50 ` +
                            (active ? 'bg-slate-100 font-semibold text-green' : 'text-green')
                        }
                    >
                        <span>{item.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}


function isActive(currentUrl: string, href: string) {
    // wyróżnij gdy URL jest dokładnie na tej trasie lub w jej „pod-ścieżkach”
    return (
        currentUrl === href ||
        currentUrl.startsWith(`${href}/`) ||
        currentUrl.startsWith(`${href}?`)
    )
}
