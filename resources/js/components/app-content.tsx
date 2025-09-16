import { SidebarInset } from '@/components/ui/sidebar';
import * as React from 'react';
import FooterCard from '@/components/footer';

interface AppContentProps extends React.ComponentProps<'main'> {
    variant?: 'header' | 'sidebar';
}

export function AppContent({ variant = 'header', children, ...props }: AppContentProps) {
    if (variant === 'sidebar') {
        return <SidebarInset {...props}>{children}</SidebarInset>;
    }

    return (
        <div className="flex flex-col min-h-screen">
            <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4 rounded-xl" {...props}>
                {children}
            </main>
            <FooterCard className="mt-auto" />
        </div>
    );
}
