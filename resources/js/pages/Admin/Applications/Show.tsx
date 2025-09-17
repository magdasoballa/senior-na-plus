import AppLayout from '@/layouts/app-layout';
import { Link, usePage } from '@inertiajs/react';

type Application = {
    id: number | string;
    name: string;
    email: string;
    phone: string;
    offer_id?: number | string;          // <—
    offer_title?: string | null;         // <— (z kolumny applications)
    offer?: { id?: number | string; title?: string | null } | null;
};

export default function Show() {
    const { application } = usePage<{ application: Application }>().props;

    console.log(application, 'test')
    return (
        <AppLayout>
            <div className="max-w-4xl mx-auto p-6 space-y-4">
                <Link href="/admin/applications" className="text-coral">&larr; Wróć</Link>

                <h1 className="text-2xl font-bold">Aplikacja #{application.id}</h1>

                <div className="space-y-1">
                    <div className="font-medium">
                        {application.name} —{" "}
                        { (application.offer?.id ?? application.offer_id) ? (
                            <Link
                                href={`/offers/${encodeURIComponent(String(application.offer?.id ?? application.offer_id))}`}
                                className="text-coral underline-offset-2 hover:underline"
                                prefetch
                            >
                                {application.offer?.title ?? application.offer_title ?? "Zobacz ofertę"}
                            </Link>
                        ) : (
                            <span className="text-muted-foreground">
      {application.offer?.title ?? application.offer_title ?? "—"}
    </span>
                        )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                        {application.email} · {application.phone}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
