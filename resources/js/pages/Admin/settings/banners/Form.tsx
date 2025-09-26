import { Link, useForm, usePage } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import AdminLayout from '@/layouts/admin-layout';
import { CheckCircle2 } from 'lucide-react';

type BannerDto = {
    id: number | null;
    name: string;
    image_url?: string | null;
    visible: boolean;
    starts_at?: string | null;
    ends_at?: string | null;
    link?: string | null;
    scope?: 'home' | 'offers' | 'both';
};

const BASE = '/admin/settings/banners';

export default function Form() {
    const { banner, isCreate, flash } = usePage<{ banner: BannerDto; isCreate: boolean; flash?: { success?: string } }>().props;
    const [file, setFile] = useState<File | null>(null);
    const [saved, setSaved] = useState(false);

    const form = useForm({
        name: banner.name ?? '',
        starts_at: (banner.starts_at ?? '') as string,
        ends_at: (banner.ends_at ?? '') as string,
        link: banner.link ?? '',
        scope: (banner.scope ?? 'both') as 'home' | 'offers' | 'both',
        visible: !!banner.visible,
        image: null as File | null,
    });

    // reset przy zmianie rekordu
    useEffect(() => {
        setFile(null);
        form.setData({
            name: banner.name ?? '',
            starts_at: (banner.starts_at ?? '') as string,
            ends_at: (banner.ends_at ?? '') as string,
            link: banner.link ?? '',
            scope: (banner.scope ?? 'both') as 'home' | 'offers' | 'both',
            visible: !!banner.visible,
            image: null,
        });
        form.clearErrors();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [banner.id]);

    const setImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0] ?? null;
        setFile(f);
        form.setData('image', f);
    };

    // wspólna funkcja zapisu – param stay steruje pozostaniem na edycji
    const save = (stay: boolean) => {
        form.transform((d: any) => {
            const payload: any = {
                ...d,
                visible: d.visible ? 1 : 0,
            };
            if (!(d.image instanceof File)) delete payload.image;
            if (!isCreate) payload._method = 'put';
            if (stay) payload.stay = true;
            return payload;
        });

        const url = isCreate ? `${BASE}` : `${BASE}/${banner.id}`;

        form.post(url, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                if (stay) {
                    setSaved(true);
                    window.setTimeout(() => setSaved(false), 2500);
                }
            },
            onFinish: () => {
                // przywróć transform do domyślnego
                form.transform((d: any) => d);
            },
        });
    };

    const onSubmit = (e: React.FormEvent) => { e.preventDefault(); save(false); };

    const previewUrl = file ? URL.createObjectURL(file) : (banner.image_url || null);

    useEffect(() => {
        return () => {
            if (file && previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [file, previewUrl]);

    return (
        <AdminLayout>
            <main className="p-6">
                <p className="text-2xl font-bold">
                    {isCreate ? 'Utwórz Baner' : `Aktualizacja Baner: ${banner.id}`}
                </p>

                {(saved || flash?.success) && (
                    <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-800">
                        <CheckCircle2 className="h-4 w-4" />
                        {flash?.success ?? 'Zapisano zmiany'}
                    </div>
                )}

                <form onSubmit={onSubmit} encType="multipart/form-data" className="mt-4 overflow-hidden rounded-xl border bg-white">
                    <Row label="Nazwa" required>
                        <input
                            className="mt-1 w-full rounded-lg border bg-white px-3 py-2"
                            value={form.data.name}
                            onChange={(e) => form.setData('name', e.target.value)}
                            required
                            placeholder="Nazwa"
                        />
                    </Row>
                    {form.errors.name && <p className="px-4 pb-2 text-sm text-rose-600">{form.errors.name}</p>}

                    <Row label="Data rozpoczęcia" required right={<TZ />}>
                        <input
                            type="datetime-local"
                            className="mt-1 w-full rounded-lg border bg-white px-3 py-2"
                            value={form.data.starts_at ?? ''}
                            onChange={(e) => form.setData('starts_at', e.target.value)}
                            required
                        />
                    </Row>
                    {form.errors.starts_at && <p className="px-4 pb-2 text-sm text-rose-600">{form.errors.starts_at}</p>}

                    <Row label="Data końcowa" required right={<TZ />}>
                        <input
                            type="datetime-local"
                            className="mt-1 w-full rounded-lg border bg-white px-3 py-2"
                            value={form.data.ends_at ?? ''}
                            onChange={(e) => form.setData('ends_at', e.target.value)}
                            required
                        />
                    </Row>
                    {form.errors.ends_at && <p className="px-4 pb-2 text-sm text-rose-600">{form.errors.ends_at}</p>}

                    <Row label="Link">
                        <input
                            type="url"
                            className="mt-1 w-full rounded-lg border bg-white px-3 py-2"
                            value={form.data.link ?? ''}
                            onChange={(e) => form.setData('link', e.target.value)}
                            placeholder="https://…"
                        />
                    </Row>
                    {form.errors.link && <p className="px-4 pb-2 text-sm text-rose-600">{form.errors.link}</p>}

                    <Row label="Zdjęcie" required>
                        <label className="mt-1 block w-full cursor-pointer rounded-lg border-2 border-dashed px-4 py-6 text-center hover:bg-slate-50">
                            <span className="rounded bg-mint px-3 py-1 font-semibold">Wybierz Plik</span>
                            <input type="file" accept="image/*" className="hidden" onChange={setImage} />
                            {previewUrl && (
                                <div className="mt-3">
                                    <img src={previewUrl} className="h-10 w-24 rounded object-cover ring-1 ring-slate-200" />
                                </div>
                            )}
                        </label>
                    </Row>
                    {form.errors.image && <p className="px-4 pb-4 text-sm text-rose-600">{form.errors.image}</p>}

                    <Row label="Widoczność w sekcjach" required>
                        <select
                            className="mt-1 w-full rounded-lg border bg-white px-3 py-2"
                            value={form.data.scope}
                            onChange={(e) => form.setData('scope', e.target.value as 'home' | 'offers' | 'both')}
                            required
                        >
                            <option value="both">Obie opcje</option>
                            <option value="home">Strona główna</option>
                            <option value="offers">Lista ofert</option>
                        </select>
                    </Row>
                    {form.errors.scope && <p className="px-4 pb-2 text-sm text-rose-600">{form.errors.scope}</p>}

                    <Row label="Widoczny">
                        <label className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={form.data.visible}
                                onChange={(e) => form.setData('visible', e.target.checked)}
                            />
                        </label>
                    </Row>

                    <div className="flex items-center justify-end gap-3 p-4">
                        <Link href={BASE} className="rounded-lg border px-4 py-2 hover:bg-slate-50">
                            Anuluj
                        </Link>
                        <button
                            type="button"
                            onClick={() => save(true)}  // ← Zapisz i zostań na edycji
                            className="rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-white"
                            disabled={form.processing}
                        >
                            {isCreate ? 'Utwórz i Kontynuuj Edycję' : 'Zapisz i Kontynuuj Edycję'}
                        </button>
                        <button
                            type="submit"
                            className="rounded-lg bg-mint px-4 py-2 font-semibold"
                            disabled={form.processing}
                        >
                            {isCreate ? 'Utwórz' : 'Zapisz zmiany'}
                        </button>
                    </div>
                </form>
            </main>
        </AdminLayout>
    );
}

/* --- POMOCNICZE --- */

type RowProps = {
    label: React.ReactNode;
    required?: boolean;
    right?: React.ReactNode;
    children: React.ReactNode;
};

const Row = React.memo(function Row({ label, required, right, children }: RowProps) {
    return (
        <div className="grid grid-cols-1 gap-4 border-b p-4 last:border-b-0 md:grid-cols-3 md:items-center">
            <div className="text-sm font-medium">
                {label} {required && <span className="text-rose-600">*</span>}
            </div>
            <div className="md:col-span-2">
                <div className="flex items-center gap-3">
                    {children}
                    {right}
                </div>
            </div>
        </div>
    );
});

const TZ = () => <span className="text-xs text-slate-500">Europe/Warsaw</span>;
