import AppLayout from '@/layouts/app-layout';
import { Link, usePage, router } from '@inertiajs/react';
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

type PaginationLink = { url?: string; label: string; active: boolean };

type PageProps = {
    applications: { data: Application[]; links: PaginationLink[] };
    quick_applications: { data: Application[]; links: PaginationLink[] };
    filters: { search: string; status: string; sort: string; dir: 'asc'|'desc'; per_page: number };
    statuses: string[];
};

export default function Index() {
    const { applications, quick_applications, filters, statuses } = usePage<PageProps>().props;

    const [local, setLocal] = React.useState({
        search: filters?.search ?? '',
        status: filters?.status ?? '',
        sort: filters?.sort ?? 'created_at',
        dir: (filters?.dir as 'asc'|'desc') ?? 'desc',
        per_page: Number(filters?.per_page ?? 20),
    });

    const apply = (extra?: Partial<typeof local>) => {
        const params = { ...local, ...(extra ?? {}) };
        router.get('/admin/applications', params, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const toggleDir = () => {
        setLocal(prev => {
            const nextDir = prev.dir === 'asc' ? 'desc' : 'asc';
            const params  = { ...prev, dir: nextDir };
            router.get('/admin/applications', params, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
            return params;
        });
    };

    return (
        <AppLayout>
            <div className="max-w-5xl space-y-6 p-6">
                <Link href="/dashboard" className="text-coral">&larr; Wróć</Link>
                <h1 className="mt-5 text-2xl font-bold text-coral">Aplikacje</h1>

                {/* FILTRY */}
                <section className="rounded-lg bg-[#F5F5F4] p-4">
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                        <label className="block">
                            <span className="mb-1 block text-sm">Szukaj (imię/email/telefon)</span>
                            <input
                                className="w-full rounded border px-3 py-2"
                                value={local.search}
                                onChange={(e)=>setLocal(s=>({ ...s, search: e.target.value }))}
                                onKeyDown={(e)=> e.key==='Enter' && apply()}
                            />
                        </label>

                        <label className="block">
                            <span className="mb-1 block text-sm">Status</span>
                            <select
                                className="w-full rounded border px-3 py-2"
                                value={local.status}
                                onChange={(e)=> setLocal(s=>({ ...s, status: e.target.value }))}
                            >
                                <option value="">— dowolny —</option>
                                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </label>

                        <label className="block">
                            <span className="mb-1 block text-sm">Sortuj wg</span>
                            <select
                                className="w-full rounded border px-3 py-2"
                                value={local.sort}
                                onChange={(e)=> setLocal(s=>({ ...s, sort: e.target.value }))}
                            >
                                <option value="created_at">Data utworzenia</option>
                                <option value="name">Imię i nazwisko</option>
                                <option value="email">Email</option>
                                <option value="status">Status</option>
                            </select>
                        </label>

                        <label className="block">
                            <span className="mb-1 block text-sm">Kierunek</span>
                            <button
                                type="button"
                                onClick={toggleDir}
                                className="w-full rounded border px-3 py-2"
                                title="Zmień kierunek sortowania"
                            >
                                {local.dir === 'asc' ? 'Rosnąco ↑' : 'Malejąco ↓'}
                            </button>
                        </label>

                        <label className="block">
                            <span className="mb-1 block text-sm">Na stronę</span>
                            <select
                                className="w-full rounded border px-3 py-2"
                                value={local.per_page}
                                onChange={(e)=> setLocal(s=>({ ...s, per_page: Number(e.target.value) }))}
                            >
                                {[10,20,50,100].map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                        </label>
                    </div>

                    <div className="mt-3 flex gap-2">
                        <button
                            onClick={()=>apply()}
                            className="rounded-full bg-coral px-4 py-2 font-semibold text-white"
                        >
                            Zastosuj
                        </button>
                        <button
                            onClick={()=>{
                                const reset = { search:'', status:'', sort:'created_at', dir:'desc' as const, per_page:20 };
                                setLocal(reset);
                                apply(reset);
                            }}
                            className="rounded-full border px-4 py-2"
                        >
                            Wyczyść
                        </button>
                    </div>
                </section>

                {/* Pełne aplikacje */}
                <section className="space-y-4 rounded-lg bg-[#F5F5F4] p-6">
                    <h2 className="text-xl font-semibold">Pełne aplikacje</h2>
                    {applications.data.length ? (
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
                                            <p className="text-sm text-foreground/80">{app.email} · {app.phone}</p>
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

                    {/* paginacja pełnych */}
                    <div className="mt-4 flex justify-center gap-2">
                        {applications.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url || '#'}
                                preserveState
                                preserveScroll
                                className={`px-3 py-1 rounded ${link.active ? 'bg-coral text-white' : 'bg-gray-200 text-foreground/80'}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                </section>

                {/* Szybkie aplikacje */}
                <section className="space-y-4 rounded-lg bg-[#F5F5F4] p-6">
                    <h2 className="text-xl font-semibold">Szybkie aplikacje</h2>
                    {quick_applications.data.length ? (
                        <div className="space-y-4">
                            {quick_applications.data.map((q) => (
                                <div key={q.id} className="border-l-4 border-coral pl-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">
                                                <Link
                                                    href={`/admin/quick-applications/${q.id}`}
                                                    className="text-coral underline-offset-2 hover:underline"
                                                    prefetch
                                                >
                                                    Aplikacja #{q.id} — {q.name}
                                                </Link>
                                            </p>
                                            <p className="text-sm text-foreground/80">{q.email} · {q.phone}</p>
                                            <p className="text-sm text-foreground/80">
                                                Oferta:{' '}
                                                {(q.offer?.id ?? q.offer_id) ? (
                                                    <Link
                                                        href={`/offers/${encodeURIComponent(String(q.offer?.id ?? q.offer_id))}`}
                                                        className="text-coral underline-offset-2 hover:underline"
                                                        prefetch
                                                    >
                                                        {q.offer?.title ?? q.offer_title ?? '—'}
                                                    </Link>
                                                ) : (
                                                    <span>{q.offer?.title ?? q.offer_title ?? '—'}</span>
                                                )}
                                            </p>
                                            <p className="text-sm text-foreground/80">
                                                Status: {q.status} · Utworzono: {new Date(q.created_at).toLocaleString('pl-PL')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-foreground/80">Brak szybkich aplikacji.</p>
                    )}

                    {/* paginacja szybkich */}
                    <div className="mt-4 flex justify-center gap-2">
                        {quick_applications.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url || '#'}
                                preserveState
                                preserveScroll
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
