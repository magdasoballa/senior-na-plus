import { useForm } from "@inertiajs/react";
import * as React from "react";

type Props = {
    mode: "create" | "edit";
    offer?: any;
    onSaved?: () => void;
};

export default function OfferForm({ mode, offer }: Props) {
    const { data, setData, post, processing, errors, transform, put } = useForm({
        title: offer?.title ?? "",
        description: offer?.description ?? "",
        duties_text: offer?.duties_text ?? "",
        requirements_text: offer?.requirements_text ?? "",
        benefits_text: offer?.benefits_text ?? "",
        country: offer?.country ?? "",
        city: offer?.city ?? "",
        postal_code: offer?.postal_code ?? "",
        start_date: offer?.start_date ?? "",
        duration: offer?.duration ?? "",
        language: offer?.language ?? "",
        wage: offer?.wage ?? "",
        bonus: offer?.bonus ?? "",
        hero_image: null as File | null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        // zbuduj payload i usuń klucze, których nie chcemy wysyłać
        transform((d) => {
            const payload: any = { ...d };

            // jeśli nie ma nowego pliku – w ogóle nie wysyłaj tego klucza
            if (!d.hero_image) delete payload.hero_image;

            // (opcjonalnie) przytnij spacje
            if (typeof d.title === 'string') payload.title = d.title.trim();
            if (typeof d.description === 'string') payload.description = d.description.trim();

            return payload;
        });

        // tylko gdy jest plik — wysyłamy multipart/FormData
        const options = {
            preserveScroll: true,
            ...(data.hero_image ? { forceFormData: true } : {}),
        };

        if (mode === "create") {
            post("/admin/offers", options);
        } else {
            put(`/admin/offers/${encodeURIComponent(offer.id)}`, options);
        }
    };


    return (
        <form onSubmit={submit} className="grid grid-cols-1 gap-4">
            {/* podstawowe */}
            <Input label="Tytuł*" value={data.title} onChange={(v) => setData("title", v)} error={errors.title} required />
            <TextArea label="Opis*" value={data.description} onChange={(v) => setData("description", v)} error={errors.description} rows={6} required />

            {/* listy jako textarea */}
            <TextArea label="Obowiązki (1 wiersz = 1 pozycja)"
                      value={data.duties_text} onChange={(v) => setData("duties_text", v)} error={errors.duties_text} rows={4} />
            <TextArea label="Wymagania (1 wiersz = 1 pozycja)"
                      value={data.requirements_text} onChange={(v) => setData("requirements_text", v)} error={errors.requirements_text} rows={4} />
            <TextArea label="Oferujemy (1 wiersz = 1 pozycja)"
                      value={data.benefits_text} onChange={(v) => setData("benefits_text", v)} error={errors.benefits_text} rows={4} />

            {/* meta */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Kraj" value={data.country} onChange={(v) => setData("country", v)} />
                <Input label="Miasto" value={data.city} onChange={(v) => setData("city", v)} />
                <Input label="Kod pocztowy" value={data.postal_code} onChange={(v) => setData("postal_code", v)} />
                <Input label="Data startu" value={data.start_date} onChange={(v) => setData("start_date", v)} />
                <Input label="Czas trwania" value={data.duration} onChange={(v) => setData("duration", v)} />
                <Input label="Język" value={data.language} onChange={(v) => setData("language", v)} />
                <Input label="Stawka" value={data.wage} onChange={(v) => setData("wage", v)} />
                <Input label="Premia" value={data.bonus} onChange={(v) => setData("bonus", v)} />
            </div>

            {/* hero image */}
            <div>
                <label className="mb-1 block text-sm font-medium">Zdjęcie (hero)</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setData("hero_image", e.currentTarget.files?.[0] ?? null)}
                />
                {errors.hero_image && <p className="mt-1 text-sm text-red-600">{errors.hero_image}</p>}

                {offer?.hero_image && (
                    <img
                        src={`/storage/${offer.hero_image}`}
                        className="mt-2 h-24 w-auto rounded-md border object-cover"
                    />
                )}
            </div>

            <div className="mt-2">
                <button
                    type="submit"
                    disabled={processing}
                    className="rounded-full bg-coral px-6 py-2 font-bold text-white disabled:opacity-60"
                >
                    {processing ? "Zapisywanie..." : mode === "create" ? "Dodaj ofertę" : "Zapisz zmiany"}
                </button>
            </div>
        </form>
    );
}

function Input({
                   label, value, onChange, error, required,
               }: { label: string; value: string; onChange: (v: string)=>void; error?: string; required?: boolean }) {
    return (
        <label className="block">
            <span className="mb-1 block text-sm font-medium">{label}</span>
            <input
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-mint focus:border-transparent"
                value={value}
                onChange={(e)=>onChange(e.currentTarget.value)}
                required={required}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </label>
    );
}

function TextArea({
                      label, value, onChange, error, rows=4, required,
                  }: { label: string; value: string; onChange:(v:string)=>void; error?: string; rows?: number; required?: boolean }) {
    return (
        <label className="block">
            <span className="mb-1 block text-sm font-medium">{label}</span>
            <textarea
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-mint focus:border-transparent"
                rows={rows}
                value={value}
                onChange={(e)=>onChange(e.currentTarget.value)}
                required={required}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </label>
    );
}
