import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';

type Application = {
    id: number | string;
    name: string;
    email: string;
    phone: string;
    offer?: { title?: string };
};

type ApplicationsProp =
    | Application[]
    | { data?: Application[] }    // dla paginate()
    | undefined;

export default function Index({ applications }: { applications?: ApplicationsProp }) {
    const items: Application[] = Array.isArray(applications)
        ? applications
        : applications?.data ?? [];
    return (
        <AppLayout>
            <div className="max-w-5xl  p-6">
                <Link href="/dashboard" className="text-coral">&larr; Wróć</Link>

                <h1 className="text-2xl font-bold mb-4 mt-5">Aplikacje</h1>

                {items.length === 0 ? (
                    <p>Brak aplikacji.</p>
                ) : (
                    <ul className="divide-y">
                        {items.map((a) => (
                            <li key={a.id} className="py-3 flex justify-between">
                                <div>
                                    <div className="font-medium">
                                        {a.name} — {a.offer?.title}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {a.email} · {a.phone}
                                    </div>
                                </div>

                                <Link
                                    href={`/admin/applications/${encodeURIComponent(a.id)}`}
                                    className="text-coral font-semibold ml-4"
                                >
                                    Szczegóły
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </AppLayout>
    );
}
