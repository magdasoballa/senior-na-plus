import { SidebarInset } from '@/components/ui/sidebar'
import * as React from 'react'
import FooterCard from '@/components/footer'
import CookieConsentModal from '@/components/ui/cookie-consent-modal';

interface AppContentProps extends React.ComponentProps<'main'> {
    variant?: 'header' | 'sidebar'
}

export function AppContent({ variant = 'header', children, ...props }: AppContentProps) {
    if (variant === 'sidebar') {
        // widoki z bocznym menu (np. admin) – bez modala
        return <SidebarInset {...props}>{children}</SidebarInset>
    }

    // widoki publiczne – modal zamontowany globalnie
    return (
        <div className="flex min-h-screen flex-col">
            <main className="mx-auto flex w-full max-w-8xl flex-1 flex-col gap-4 rounded-xl" {...props}>
                {children}
            </main>

            <FooterCard className="mt-auto" />

            {/* Cookie modal pokaże się tylko jeśli nie ma zapisanej zgody w localStorage */}
            <CookieConsentModal />
        </div>
    )
}
