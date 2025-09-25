import { Link, usePage } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { CheckCircle2, XCircle } from 'lucide-react';

type BannerShow = {
    id: number;
    name: string;
    image_url?: string | null;
    visible: boolean;
    position: number;
    link?: string | null;
    scope?: 'home'|'offers'|'both'|null;
    starts_at?: string | null; // sformatowane 'YYYY-MM-DD HH:mm'
    ends_at?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
};

const BASE = '/admin/settings/banners';

export default function Show() {
    const { banner } = usePage<{ banner: BannerShow }>().props;

    return (
        <AdminLayout>
            <main className="p-6">
                <div className="text-sm text-slate-500">
                    Zasoby › Banery › Szczegóły #{banner.id}
                </div>
                <div className="mt-1 flex items-center justify-between">
                    <p className="text-2xl font-bold">Szczegóły banera</p>
                    <div className="flex gap-2">
                        <Link href={`${BASE}/${banner.id}/edit`} className="rounded-lg border px-3 py-1 hover:bg-slate-50">✎ Edytuj</Link>
                        <Link href={BASE} className="rounded-lg border px-3 py-1 hover:bg-slate-50">↩︎ Wróć do listy</Link>
                    </div>
                </div>

                <div className="mt-6 overflow-hidden rounded-xl border bg-white">
                    <dl className="divide-y">
                        <Row label="ID">{banner.id}</Row>
                        <Row label="Nazwa">{banner.name || '—'}</Row>
                        <Row label="Widoczny">
              <span className="inline-flex items-center gap-2">
                {banner.visible ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                ) : (
                    <XCircle className="h-5 w-5 text-rose-600" />
                )}
              </span>
                        </Row>
                        <Row label="Pozycja">{banner.position}</Row>
                        <Row label="Widoczność w sekcjach">
                            {banner.scope === 'home' ? 'Strona główna'
                                : banner.scope === 'offers' ? 'Lista ofert'
                                    : banner.scope === 'both' ? 'Obie opcje'
                                        : '—'}
                        </Row>
                        <Row label="Data rozpoczęcia">{banner.starts_at || '—'}</Row>
                        <Row label="Data końcowa">{banner.ends_at || '—'}</Row>
                        <Row label="Link docelowy">
                            {banner.link ? (
                                <a href={banner.link} target="_blank" rel="noopener" className="text-sky-700 hover:underline">
                                    {banner.link}
                                </a>
                            ) : '—'}
                        </Row>
                        <Row label="Zdjęcie">
                            {banner.image_url ? (
                                <div className="flex items-center gap-3">
                                    <img src={banner.image_url} className="h-12 w-28 rounded object-cover ring-1 ring-slate-200" />
                                    <a href={banner.image_url} target="_blank" className="text-sky-700 hover:underline">Otwórz obraz</a>
                                </div>
                            ) : '—'}
                        </Row>
                        <Row label="Utworzono">{banner.created_at || '—'}</Row>
                        <Row label="Zaktualizowano">{banner.updated_at || '—'}</Row>
                    </dl>
                </div>
            </main>
        </AdminLayout>
    );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-3">
            <dt className="text-sm font-medium">{label}</dt>
            <dd className="md:col-span-2">{children}</dd>
        </div>
    );
}
