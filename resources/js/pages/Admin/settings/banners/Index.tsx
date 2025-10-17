import { Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { useState } from 'react';
import { CheckCircle2, XCircle, Pencil, Trash2, MoveUpRight, MoveDownLeft, Filter, Eye, Search, X } from 'lucide-react';
import * as React from 'react';

type Banner = {
    id: number;
    name: string;
    image_url?: string | null;
    visible: boolean;
    position: number;
};
type Paginated<T> = {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
};

const BASE = '/admin/settings/banners';

export default function Index() {
    const { banners, filters } = usePage<{ banners: Paginated<Banner>; filters: { q?: string } }>().props;
    const [q, setQ] = useState(filters?.q ?? '');
    const [preview, setPreview] = useState<Banner | null>(null);

    const rows = banners.data;

    const submitSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(BASE, { q }, { preserveState: true, replace: true });
    };

    const clearSearch = () => {
        setQ('');
        router.get(BASE, {}, { preserveState: true, replace: true });
    };

    const toggle = (id: number) => {
        router.patch(`${BASE}/${id}/toggle`, {}, { preserveScroll: true });
    };

    const destroy = (id: number) => {
        if (!confirm('Usunąć baner?')) return;
        router.delete(`${BASE}/${id}`, { preserveScroll: true });
    };

    const move = (idx: number, dir: 'up' | 'down') => {
        const arr = rows.map(r => r.id);
        if (dir === 'up' && idx > 0) [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
        if (dir === 'down' && idx < arr.length - 1) [arr[idx + 1], arr[idx]] = [arr[idx], arr[idx + 1]];
        router.post(`${BASE}/reorder`, { ids: arr }, { preserveScroll: true });
    };

    const copy = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            alert('Skopiowano do schowka.');
        } catch {
            alert('Nie udało się skopiować.');
        }
    };

    return (
        <AdminLayout>
            <main className="p-6">
                <div className="mt-1 flex items-center justify-between">
                    <p className="text-2xl font-bold">Banery</p>
                    <Link href={`${BASE}/create`} className="rounded-lg bg-mint px-4 py-2 font-semibold">
                        Utwórz Baner
                    </Link>
                </div>

                {/* WYSZUKIWARKA - krótsza i z lupką */}
                <form onSubmit={submitSearch} className="mt-4">
                    <div className="relative w-80">
                        <input
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="Szukaj"
                            className="w-full rounded-full border bg-white px-4 py-2 pl-10 pr-10 outline-none"
                        />
                        <span className="pointer-events-none absolute left-3 top-2.5">🔎</span>
                        {/* Przycisk czyszczenia */}
                        {q && (
                            <button
                                type="button"
                                onClick={clearSearch}
                                className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
                                title="Wyczyść wyszukiwanie"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </form>

                <div className="mt-4 overflow-hidden rounded-xl border bg-white">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 text-slate-600">
                        <tr>
                            <th className="p-3 w-12"></th>
                            <th className="p-3">ID</th>
                            <th className="p-3">NAZWA</th>
                            <th className="p-3">ZDJĘCIE</th>
                            <th className="p-3">WIDOCZNY</th>
                            <th className="p-3 w-56 text-right">AKCJE</th>
                        </tr>
                        </thead>
                        <tbody>
                        {rows.map((b, i) => (
                            <tr key={b.id} className="border-t">
                                <td className="p-3">
                                    <div className="flex gap-1">
                                        <button className="rounded border p-1" onClick={() => move(i, 'up')} disabled={i === 0} title="Góra">
                                            <MoveUpRight className="h-4 w-4" />
                                        </button>
                                        <button
                                            className="rounded border p-1"
                                            onClick={() => move(i, 'down')}
                                            disabled={i === rows.length - 1}
                                            title="Dół"
                                        >
                                            <MoveDownLeft className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                                <td className="p-3">{b.id}</td>
                                <td className="p-3">{b.name}</td>
                                <td className="p-3">
                                    {b.image_url ? (
                                        <img src={b.image_url} className="h-8 w-24 rounded object-cover ring-1 ring-slate-200" />
                                    ) : (
                                        '—'
                                    )}
                                </td>
                                <td className="p-3">
                                    <div className="flex justify-center">
                                        {b.visible ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : <XCircle className="h-5 w-5 text-rose-600" />}
                                    </div>
                                </td>

                                <td className="p-3">
                                    <div className="flex justify-end gap-2">
                                        {/* PODGLĄD */}
                                        <Link href={`${BASE}/${b.id}`} className="rounded border px-2 py-1" title="Szczegóły">
                                            <Eye className="h-4 w-4" />
                                        </Link>

                                        {/* EDYCJA */}
                                        <Link href={`${BASE}/${b.id}/edit`} className="rounded border px-2 py-1" title="Edytuj">
                                            <Pencil className="h-4 w-4" />
                                        </Link>

                                        {/* USUŃ */}
                                        <button onClick={() => destroy(b.id)} className="rounded border px-2 py-1" title="Usuń">
                                            <Trash2 className="h-4 w-4 text-rose-600" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {rows.length === 0 && (
                            <tr>
                                <td className="p-6 text-center text-slate-500" colSpan={6}>
                                    Brak banerów
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                {/* MODAL PODGLĄDU */}
                {preview && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
                        onClick={() => setPreview(null)}
                    >
                        <div
                            className="w-full max-w-3xl rounded-xl bg-white shadow-xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between border-b px-4 py-3">
                                <div className="font-semibold">
                                    Podgląd banera #{preview.id} — {preview.name}
                                </div>
                                <button className="rounded-md px-2 py-1 hover:bg-slate-100" onClick={() => setPreview(null)}>
                                    ✕
                                </button>
                            </div>

                            <div className="max-h-[75vh] overflow-auto p-4">
                                {preview.image_url ? (
                                    <img
                                        src={preview.image_url}
                                        alt={preview.name}
                                        className="mx-auto max-h-[65vh] w-auto max-w-full rounded-lg object-contain ring-1 ring-slate-200"
                                    />
                                ) : (
                                    <div className="p-8 text-center text-slate-500">Brak obrazu</div>
                                )}
                            </div>

                            <div className="flex items-center justify-end gap-2 border-t px-4 py-3">
                                {preview.image_url && (
                                    <>
                                        <a
                                            href={preview.image_url}
                                            target="_blank"
                                            rel="noopener"
                                            className="rounded-lg border px-3 py-1.5 hover:bg-slate-50"
                                        >
                                            Otwórz grafikę
                                        </a>
                                        <button
                                            className="rounded-lg border px-3 py-1.5 hover:bg-slate-50"
                                            onClick={() => copy(preview.image_url!)}
                                        >
                                            Kopiuj link do grafiki
                                        </button>
                                    </>
                                )}
                                <button className="rounded-lg bg-mint px-3 py-1.5 font-semibold" onClick={() => setPreview(null)}>
                                    Zamknij
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </AdminLayout>
    );
}
