import AdminLayout from '@/layouts/admin-layout';
import AppLayout from '@/layouts/app-layout';
import { Link, usePage, router } from "@inertiajs/react";
import * as React from "react";

type Offer = {
    id: number | string;
    title: string;
    city?: string | null;
    country?: string | null;
    language?: string | null;
    wage?: string | null;
    created_at: string;
};

type PaginationLink = { url?: string; label: string; active: boolean };

type PageProps = {
    offers: { data: Offer[]; links: PaginationLink[] };
    filters: { search: string; sort: string; dir: 'asc'|'desc'; per_page: number };
};

export default function Index() {
    const { offers, filters } = usePage<PageProps>().props;

    const [local, setLocal] = React.useState({
        search:   filters?.search ?? '',
        sort:     filters?.sort   ?? 'created_at',
        dir:      (filters?.dir as 'asc'|'desc') ?? 'desc',
        per_page: Number(filters?.per_page ?? 20),
    });

    const apply = (extra?: Partial<typeof local>) => {
        const params = { ...local, ...(extra ?? {}) };
        router.get('/admin/offers', params, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const toggleDir = () => {
        setLocal(prev => {
            const nextDir = prev.dir === 'asc' ? 'desc' : 'asc';
            const params  = { ...prev, dir: nextDir };
            router.get('/admin/offers', params, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
            return params; // <-- od razu aktualizujemy lokalny state
        });
    };

    const del = (id: number | string) => {
        if (!confirm("Usunąć tę ofertę?")) return;
        router.delete(`/admin/offers/${encodeURIComponent(String(id))}`, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <AdminLayout>
            <div className="max-w-5xl p-6">
                <Link href="/dashboard" className="text-coral">&larr; Wróć</Link>

                <div className="mb-4 mt-5 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Oferty</h1>
                    <Link
                        href="/admin/offers/create"
                        className="rounded-full bg-coral px-4 py-2 font-bold text-white"
                    >
                        Dodaj ofertę
                    </Link>
                </div>

                {/* FILTRY */}
                <section className="mb-4 rounded-lg bg-[#F5F5F4] p-4">
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                        <label className="block">
                            <span className="mb-1 block text-sm">Szukaj (tytuł/miasto/kraj/język)</span>
                            <input
                                className="w-full rounded border px-3 py-2"
                                value={local.search}
                                onChange={(e)=>setLocal(s=>({ ...s, search: e.target.value }))}
                                onKeyDown={(e)=> e.key==='Enter' && apply()}
                            />
                        </label>

                        <label className="block">
                            <span className="mb-1 block text-sm">Sortuj wg</span>
                            <select
                                className="w-full rounded border px-3 py-2"
                                value={local.sort}
                                onChange={(e)=> setLocal(s=>({ ...s, sort: e.target.value }))}
                            >
                                <option value="created_at">Data utworzenia</option>
                                <option value="title">Tytuł</option>
                                <option value="city">Miasto</option>
                                <option value="country">Kraj</option>
                                <option value="language">Język</option>
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

                        <div className="flex items-end gap-2">
                            <button
                                onClick={()=>apply()}
                                className="h-[38px] rounded-full bg-coral px-4 py-2 font-semibold text-white"
                            >
                                Zastosuj
                            </button>
                            <button
                                onClick={()=>{
                                    const reset = { search:'', sort:'created_at', dir:'desc' as const, per_page:20 };
                                    setLocal(reset);
                                    apply(reset);
                                }}
                                className="h-[38px] rounded-full border px-4 py-2"
                            >
                                Wyczyść
                            </button>
                        </div>
                    </div>
                </section>

                <div className="overflow-hidden rounded-xl border bg-white">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-black">Tytuł</th>
                            <th className="px-4 py-3 text-black">Lokalizacja</th>
                            <th className="px-4 py-3 text-black">Język</th>
                            <th className="px-4 py-3 text-black">Stawka</th>
                            <th className="w-40 px-4 py-3 text-black"></th>
                        </tr>
                        </thead>
                        <tbody>
                        {offers.data.map((o) => (
                            <tr key={o.id} className="border-t">
                                <td className="px-4 py-3 text-black">{o.title}</td>
                                <td className="px-4 py-3 text-black">{[o.city, o.country].filter(Boolean).join(", ")}</td>
                                <td className="px-4 py-3 text-black">{o.language}</td>
                                <td className="px-4 py-3 text-black">{o.wage}</td>
                                <td className="px-4 py-3 text-black">
                                    <div className="flex gap-2">
                                        <Link
                                            href={`/admin/offers/${encodeURIComponent(String(o.id))}/edit`}
                                            className="rounded-full bg-mint px-3 py-1 text-sm font-bold"
                                        >
                                            Edytuj
                                        </Link>
                                        <button
                                            onClick={() => del(o.id)}
                                            className="rounded-full bg-red-500 px-3 py-1 text-sm font-bold text-white"
                                        >
                                            Usuń
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {offers.data.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                                    Brak ofert.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                {/* paginacja */}
                <div className="mt-4 flex justify-center gap-2">
                    {offers.links.map((link, i) => (
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
            </div>
        </AdminLayout>
    );
}
