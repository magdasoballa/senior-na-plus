// resources/js/layouts/admin-layout.tsx
import AppLayout from '@/layouts/app-layout'
import { Link, usePage } from '@inertiajs/react'
import { useEffect, useMemo, useState } from 'react'
import * as React from 'react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <AppLayout>
            <div className="flex min-h-[calc(100vh-64px)]">
                <AdminSidebar />
                {/* <- to zmieniamy */}
                <main className="flex-1 min-w-0 overflow-x-hidden p-6">
                    {children}
                </main>
            </div>
        </AppLayout>
    )
}

/** ---------------- Sidebar ---------------- */
type NavItemBase = { label: string }
type NavItemLink = NavItemBase & { kind?: 'link'; href: string; exact?: boolean }
type NavItemLabel = NavItemBase & { kind: 'label' }
type NavItem = NavItemLink | NavItemLabel
type NavGroup = { title: string; items: NavItem[] }

function AdminSidebar() {
    const groups: NavGroup[] = [
        {
            title: 'Strona główna',
            items: [{ label: 'Strona główna', href: '/admin' }],
        },
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
                { label: 'Obowiązki', href: '/admin/dictionaries/duties' },
            ],
        },
        {
            title: 'Oferty',
            items: [
                { label: 'Obowiązki', href: '/admin/offers/duties' },
                { label: 'Wymagania', href: '/admin/offers/requirements' },
                { label: 'Oferujemy', href: '/admin/offers/perks' },
                { label: 'Oferty', href: '/admin/offers' },
            ],
        },
        {
            title: 'Zgody',
            items: [
                { label: 'Formularze', href: '/admin/consents/forms' },
                { label: 'Kontakty', href: '/admin/consents/contacts' },
            ],
        },
        {
            title: 'Wiadomości',
            items: [
                { kind: 'label', label: 'WERSJA PL' },
                // { label: 'Kontakty Front (pl)',  href: '/admin/messages/pl/front-contacts' },
                { label: 'Kontakty Strona (pl)', href: '/admin/messages/pl/site-contacts' },
                { label: 'Formularze (pl)',      href: '/admin/messages/pl/forms' },

                // { kind: 'label', label: 'WERSJA DE' },
                // { label: 'Kontakty Strona (de)', href: '/admin/messages/de/site-contacts' },
                // { label: 'Formularze (de)',      href: '/admin/messages/de/forms' },
            ],
        },
        { title: 'Partnerzy',   items: [{ label: 'Partnerzy',   href: '/admin/partners' }] },
        { title: 'Użytkownicy', items: [{ label: 'Użytkownicy', href: '/admin/users' }] },
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
function Section({ title, items }: { title: string; items: NavItem[] }) {
    const { url } = usePage()

    // Czy sekcja to „pojedynczy link” (bez caret)?
    const singleLink =
        items.length === 1 &&
        'href' in items[0] &&
        (items[0] as NavItemLink).label === title

    // hasActive: dla singleLink sprawdzamy pojedynczy href,
    // dla zwykłej sekcji — czy którykolwiek href jest prefiksem bieżącego URL
    const hasActive = useMemo(() => {
        if (singleLink) {
            const link = items[0] as NavItemLink
            return isActive(url, link.href)
        }
        return items.some((i) => 'href' in i && isActive(url, (i as NavItemLink).href))
    }, [url, items, singleLink])

    // stan rozwinięcia — hook zawsze wywołany
    const [open, setOpen] = useState<boolean>(hasActive)

    // auto-otwieranie po zmianie URL na pasujący — hook zawsze wywołany
    useEffect(() => {
        if (hasActive) setOpen(true)
    }, [hasActive])

    // render „pojedynczego linku”
    if (singleLink) {
        const link = items[0] as NavItemLink
        const active = isActive(url, link.href)
        return (
            <div className="mt-2">
                <Link
                    href={link.href}
                    className={
                        `group flex items-center justify-between rounded-md px-2 py-2 text-sm hover:bg-slate-50 ` +
                        (active ? 'bg-slate-100 font-semibold text-green' : 'text-green')
                    }
                >
                    <span>{title}</span>
                </Link>
            </div>
        )
    }

    // zwykła sekcja
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

function NavList({ items }: { items: NavItem[] }) {
    const { url, props } = usePage()
    const msg_badges = ((props as any)?.msg_badges ?? {}) as Record<string, number>

    return (
        <nav className="space-y-1 px-1">
            {items.map((item, idx) => {
                if ('kind' in item && item.kind === 'label') {
                    return (
                        <div
                            key={`label-${idx}`}
                            className="px-2 pt-3 text-[10px] font-semibold uppercase tracking-wide text-slate-400"
                        >
                            {item.label}
                        </div>
                    )
                }

                const link = item as NavItemLink
                const active = isActive(url, link.href)
                const badge = Number(msg_badges[link.href] ?? 0)

                return (
                    <Link
                        key={link.href + link.label}
                        href={link.href}
                        className={
                            `group flex items-center justify-between rounded-md px-2 py-2 text-sm hover:bg-slate-50 ` +
                            (active ? 'bg-slate-100 font-semibold text-green' : 'text-green')
                        }
                    >
                        <span>{link.label}</span>
                        {badge > 0 && (
                            <span className="ml-2 inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-rose-100 px-1.5 text-[11px] font-semibold text-rose-600">
                {badge}
              </span>
                        )}
                    </Link>
                )
            })}
        </nav>
    )
}

/** Aktywność linku: aktywny także dla /id, /id/edit, /create, query */
/** PROSTA funkcja - tylko dokładne dopasowanie */
function isActive(currentUrl: string, href: string) {
    const cur = currentUrl.split('?')[0].replace(/\/+$/, '')
    const base = href.split('?')[0].replace(/\/+$/, '')
    return cur === base
}

