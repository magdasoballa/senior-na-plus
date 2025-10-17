// AppContent.tsx
import { SidebarInset } from '@/components/ui/sidebar'
import * as React from 'react'
import FooterCard from '@/components/footer'
import CookieConsentModal from '@/components/ui/cookie-consent-modal';
import ActivePopupModal from '@/components/ActivePopupModal';       // ⬅️
import useCookieConsent from '@/hooks/useCookieConsent';            // ⬅️
import { usePage } from '@inertiajs/react';

interface AppContentProps extends React.ComponentProps<'main'> {
    variant?: 'header' | 'sidebar'
}

export function AppContent({ variant = 'header', children, ...props }: AppContentProps) {
    if (variant === 'sidebar') {
        return <SidebarInset {...props}>{children}</SidebarInset>
    }

    const { activePopup } = usePage().props as {
        activePopup?: { id:number; name:string; link:string|null; image_url:string|null } | null
    };

    const cookiesAccepted = useCookieConsent(); // false dopóki user nie zaakceptuje

    return (
        <div className="flex min-h-screen flex-col">
            <main className="mx-auto flex w-full max-w-8xl flex-1 flex-col gap-4 rounded-xl" {...props}>
                {children}
            </main>

            <FooterCard className="mt-auto" />

            {/* 1) Najpierw cookie modal */}
            <CookieConsentModal />

            {/* 2) Dopiero PO akceptacji cookies pokazujemy popup (i tylko jeśli backend go zwrócił) */}
            {cookiesAccepted && activePopup && (
                <ActivePopupModal popup={activePopup} muteDays={7} />
            )}
        </div>
    )
}
