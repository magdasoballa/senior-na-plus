import AdminLayout from '@/layouts/admin-layout';
import { Link, router, usePage } from '@inertiajs/react';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import * as React from 'react';

type Offer = {
    id: number | string;
    title: string;
    city?: string | null;
    country?: string | null;
    language?: string | null;
    wage?: string | null;
    created_at: string;
    duties_count?: number;
    requirements_count?: number;
    perks_count?: number;
};

type PaginationLink = { url?: string; label: string; active: boolean };

type PageProps = {
    offers: { data: Offer[]; links: PaginationLink[] };
    filters: { search: string; sort: string; dir: 'asc' | 'desc'; per_page: number };
};

export default function Index() {
    const { offers, filters } = usePage<PageProps>().props;

    const [local, setLocal] = React.useState({
        search: filters?.search ?? '',
        sort: filters?.sort ?? 'created_at',
        dir: (filters?.dir as 'asc' | 'desc') ?? 'desc',
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
        setLocal((prev) => {
            const nextDir = prev.dir === 'asc' ? 'desc' : 'asc';
            const params = { ...prev, dir: nextDir };
            router.get('/admin/offers', params, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
            return params;
        });
    };

    const del = (id: number | string) => {
        if (!confirm('Usunąć tę ofertę?')) return;
        router.delete(`/admin/offers/${encodeURIComponent(String(id))}`, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <AdminLayout>
            <div className="p-4 lg:p-6">
                <Link href="/dashboard" className="text-coral">
                    &larr; Wróć
                </Link>

                <div className="mt-5 mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <p className="text-2xl font-bold">Oferty</p>
                    <Link href="/admin/offers/create" className="rounded-full bg-coral px-4 py-2 font-bold text-white w-fit">
                        Dodaj ofertę
                    </Link>
                </div>

                {/* FILTRY - POPRAWIONE WYRÓWNANIE */}
                <section className="mb-6 rounded-lg bg-[#F5F5F4] p-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 items-end">
                        <label className="flex flex-col">
                            <span className="mb-1 block text-sm">Szukaj (tytuł/miasto/kraj/język)</span>
                            <input
                                className="h-[38px] w-full rounded border px-3 py-2"
                                value={local.search}
                                onChange={(e) => setLocal((s) => ({ ...s, search: e.target.value }))}
                                onKeyDown={(e) => e.key === 'Enter' && apply()}
                            />
                        </label>

                        <label className="flex flex-col">
                            <span className="mb-1 block text-sm">Sortuj wg</span>
                            <select
                                className="h-[38px] w-full rounded border px-3 py-2"
                                value={local.sort}
                                onChange={(e) => setLocal((s) => ({ ...s, sort: e.target.value }))}
                            >
                                <option value="created_at">Data utworzenia</option>
                                <option value="title">Tytuł</option>
                                <option value="city">Miasto</option>
                                <option value="country">Kraj</option>
                                <option value="language">Język</option>
                            </select>
                        </label>

                        <label className="flex flex-col">
                            <span className="mb-1 block text-sm">Kierunek</span>
                            <button
                                type="button"
                                onClick={toggleDir}
                                className="h-[38px] w-full rounded border px-3 py-2 bg-white text-left flex items-center"
                                title="Zmień kierunek sortowania"
                            >
                                {local.dir === 'asc' ? 'Rosnąco ↑' : 'Malejąco ↓'}
                            </button>
                        </label>

                        <label className="flex flex-col">
                            <span className="mb-1 block text-sm">Na stronę</span>
                            <select
                                className="h-[38px] rounded border px-3 py-2 bg-white"
                                value={local.per_page}
                                onChange={(e) => setLocal((s) => ({ ...s, per_page: Number(e.target.value) }))}
                            >
                                {[10, 20, 50, 100].map((n) => (
                                    <option key={n} value={n}>
                                        {n}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <div className="flex items-center gap-2 md:col-span-2 lg:col-span-1 h-[38px]">
                            <button
                                onClick={() => apply()}
                                className="h-full flex-1 rounded-full bg-coral px-4 py-2 font-semibold text-white whitespace-nowrap"
                            >
                                Zastosuj
                            </button>
                            <button
                                onClick={() => {
                                    const reset = {
                                        search: '',
                                        sort: 'created_at',
                                        dir: 'desc' as const,
                                        per_page: 20,
                                    };
                                    setLocal(reset);
                                    apply(reset);
                                }}
                                className="h-full flex-1 rounded-full border border-gray-300 bg-white px-4 py-2 whitespace-nowrap hover:bg-gray-50"
                            >
                                Wyczyść
                            </button>
                        </div>
                    </div>
                </section>

                {/* TABELA */}
                <div className="rounded-xl border bg-white overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full table-auto text-sm">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tytuł</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Lokalizacja</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Język</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">Stawka</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Obowiązki</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Wymagania</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Oferujemy</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Akcje</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                            {offers.data.map((o) => (
                                <tr key={o.id} className="hover:bg-gray-50">
                                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{o.id}</td>
                                    <td className="px-3 py-4 text-sm font-medium text-gray-900 max-w-xs truncate">{o.title}</td>
                                    <td className="px-3 py-4 text-sm text-gray-500 hidden md:table-cell">
                                        {[o.city, o.country].filter(Boolean).join(', ')}
                                    </td>
                                    <td className="px-3 py-4 text-sm text-gray-500 hidden lg:table-cell">{o.language}</td>
                                    <td className="px-3 py-4 text-sm text-gray-500 hidden xl:table-cell">{o.wage}</td>
                                    <td className="px-3 py-4 text-sm text-gray-500 hidden sm:table-cell text-center">{o.duties_count ?? 0}</td>
                                    <td className="px-3 py-4 text-sm text-gray-500 hidden sm:table-cell text-center">{o.requirements_count ?? 0}</td>
                                    <td className="px-3 py-4 text-sm text-gray-500 hidden sm:table-cell text-center">{o.perks_count ?? 0}</td>
                                    <td className="px-3 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex gap-1">
                                            <Link
                                                href={`/admin/offers/${encodeURIComponent(String(o.id))}`}
                                                className="inline-flex items-center rounded-md border border-gray-300 bg-white p-2 hover:bg-gray-50"
                                                aria-label="Podgląd"
                                                title="Podgląd"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Link>

                                            <Link
                                                href={`/admin/offers/${encodeURIComponent(String(o.id))}/edit`}
                                                className="inline-flex items-center rounded-md border border-gray-300 bg-white p-2 hover:bg-gray-50"
                                                aria-label="Edytuj"
                                                title="Edytuj"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Link>

                                            <button
                                                onClick={() => del(o.id)}
                                                className="inline-flex items-center rounded-md border border-gray-300 bg-white p-2 text-rose-600 hover:bg-rose-50"
                                                aria-label="Usuń"
                                                title="Usuń"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {offers.data.length === 0 && (
                                <tr>
                                    <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                                        Brak ofert.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* PAGINACJA */}
                <div className="mt-6 flex flex-wrap justify-center gap-1">
                    {offers.links.map((link, i) => (
                        <Link
                            key={i}
                            href={link.url || '#'}
                            preserveState
                            preserveScroll
                            className={`rounded px-3 py-1 text-sm ${link.active ? 'bg-coral text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}
