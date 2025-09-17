import { Link, useForm, router } from "@inertiajs/react";
import * as React from "react";
import AppLayout from '@/layouts/app-layout';

export default function Index({ offers }: { offers: any[] }) {
    const del = (id: number) => {
        if (!confirm("Usunąć tę ofertę?")) return;
        router.delete(`/admin/offers/${encodeURIComponent(id)}`, {
            preserveScroll: true,
        });    };

    return (
        <AppLayout>
        <div className="mx-auto max-w-5xl p-6">
            <div className="mb-4 flex items-center justify-between">
                <h1 className="text-2xl font-bold">Oferty</h1>
                <Link
                    href="/admin/offers/create"
                    className="rounded-full bg-coral px-4 py-2 font-bold text-white"
                >
                    Dodaj ofertę
                </Link>
            </div>

            <div className="overflow-hidden rounded-xl border bg-white">
                <table className="w-full text-left">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-3 text-black">Tytuł</th>
                        <th className="px-4 py-3 text-black">Lokalizacja</th>
                        <th className="px-4 py-3 text-black">Język</th>
                        <th className="px-4 py-3 text-black">Stawka</th>
                        <th className="px-4 py-3 w-40 text-black"></th>
                    </tr>
                    </thead>
                    <tbody>
                    {offers.map((o) => (
                        <tr key={o.id} className="border-t">
                            <td className="px-4 py-3 text-black">{o.title}</td>
                            <td className="px-4 py-3 text-black">{[o.city, o.country].filter(Boolean).join(", ")}</td>
                            <td className="px-4 py-3 text-black">{o.language}</td>
                            <td className="px-4 py-3 text-black">{o.wage}</td>
                            <td className="px-4 py-3 text-black">
                                <div className="flex gap-2">
                                    <Link
                                        href={`/admin/offers/${encodeURIComponent(o.id)}/edit`}
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
                    {offers.length === 0 && (
                        <tr>
                            <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                                Brak ofert.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
        </AppLayout>
    );
}
