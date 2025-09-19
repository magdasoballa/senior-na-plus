import AppLayout from '@/layouts/app-layout';
import { Link, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import * as React from 'react';

type Application = {
    id: number | string;
    name: string;
    email: string;
    phone: string;
    offer_id?: number | string;
    offer_title?: string | null;
    offer?: { id?: number | string; title?: string | null } | null;
    status: string;
    created_at: string;
    type: 'application' | 'quick_application';
    url?: string;
    ip?: string;
    user_agent?: string;
    consent1?: boolean;
    consent2?: boolean;
    consent3?: boolean;
};

type PageProps = {
    applications: {
        data: Application[];
        links: Array<{ url?: string; label: string; active: boolean }>;
    };
    quick_applications: {
        data: Application[];
        links: Array<{ url?: string; label: string; active: boolean }>;
    };
};

export default function Index() {
    const { applications, quick_applications } = usePage<PageProps>().props;

    console.log({ applications, quick_applications }); // Dla debugowania

    return (
        <AppLayout>
            <div className="max-w-5xl space-y-6 p-6">
                <Link href="/dashboard" className="text-coral ">&larr; Wróć</Link>

                <h1 className="text-2xl font-bold text-coral mt-5">Aplikacje</h1>

                {/* Lista zwykłych aplikacji */}
                <section className="space-y-4 rounded-lg bg-[#F5F5F4] p-6">
                    <h2 className="text-xl font-semibold">Pełne aplikacje</h2>
                    {applications.data.length > 0 ? (
                        <div className="space-y-4">
                            {applications.data.map((app) => (
                                <div key={app.id} className="border-l-4 border-coral pl-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">
                                                <Link
                                                    href={`/admin/applications/${app.id}`}
                                                    className="text-coral underline-offset-2 hover:underline"
                                                    prefetch
                                                >
                                                    Aplikacja #{app.id} — {app.name}
                                                </Link>
                                            </p>
                                            <p className="text-sm text-foreground/80">
                                                {app.email} · {app.phone}
                                            </p>
                                            <p className="text-sm text-foreground/80">
                                                Oferta:{' '}
                                                {(app.offer?.id ?? app.offer_id) ? (
                                                    <Link
                                                        href={`/offers/${encodeURIComponent(String(app.offer?.id ?? app.offer_id))}`}
                                                        className="text-coral underline-offset-2 hover:underline"
                                                        prefetch
                                                    >
                                                        {app.offer?.title ?? app.offer_title ?? '—'}
                                                    </Link>
                                                ) : (
                                                    <span>{app.offer?.title ?? app.offer_title ?? '—'}</span>
                                                )}
                                            </p>
                                            <p className="text-sm text-foreground/80">
                                                Status: {app.status} · Utworzono: {new Date(app.created_at).toLocaleString('pl-PL')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-foreground/80">Brak zwykłych aplikacji.</p>
                    )}
                    {/* Paginacja dla zwykłych aplikacji */}
                    <div className="mt-4 flex justify-center space-x-2">
                        {applications.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url || '#'}
                                className={`px-3 py-1 rounded ${link.active ? 'bg-coral text-white' : 'bg-gray-200 text-foreground/80'}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                </section>

                {/* Lista szybkich aplikacji */}
                <section className="space-y-4 rounded-lg bg-[#F5F5F4] p-6">
                    <h2 className="text-xl font-semibold">Szybkie aplikacje</h2>
                    {quick_applications.data.length > 0 ? (
                        <div className="space-y-4">
                            {quick_applications.data.map((quickApp) => (
                                <div key={quickApp.id} className="border-l-4 border-coral pl-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">
                                                <Link
                                                    href={`/admin/quick-applications/${quickApp.id}`}
                                                    className="text-coral underline-offset-2 hover:underline"
                                                    prefetch
                                                >
                                                    Aplikacja #{quickApp.id} — {quickApp.name}
                                                </Link>
                                            </p>
                                            <p className="text-sm text-foreground/80">
                                                {quickApp.email} · {quickApp.phone}
                                            </p>
                                            <p className="text-sm text-foreground/80">
                                                Oferta:{' '}
                                                {(quickApp.offer?.id ?? quickApp.offer_id) ? (
                                                    <Link
                                                        href={`/offers/${encodeURIComponent(String(quickApp.offer?.id ?? quickApp.offer_id))}`}
                                                        className="text-coral underline-offset-2 hover:underline"
                                                        prefetch
                                                    >
                                                        {quickApp.offer?.title ?? quickApp.offer_title ?? '—'}
                                                    </Link>
                                                ) : (
                                                    <span>{quickApp.offer?.title ?? quickApp.offer_title ?? '—'}</span>
                                                )}
                                            </p>
                                            <p className="text-sm text-foreground/80">
                                                Status: {quickApp.status} · Utworzono: {new Date(quickApp.created_at).toLocaleString('pl-PL')}
                                            </p>





                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-foreground/80">Brak szybkich aplikacji.</p>
                    )}
                    {/* Paginacja dla szybkich aplikacji */}
                    <div className="mt-4 flex justify-center space-x-2">
                        {quick_applications.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url || '#'}
                                className={`px-3 py-1 rounded ${link.active ? 'bg-coral text-white' : 'bg-gray-200 text-foreground/80'}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}
