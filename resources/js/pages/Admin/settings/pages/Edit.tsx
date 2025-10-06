import { useState } from 'react'
import { Link, useForm } from '@inertiajs/react'
import AdminLayout from '@/layouts/admin-layout'
import { CheckCircle2 } from 'lucide-react'

type PageDto = {
    id: number
    name: string
    slug: string
    image_pl?: string | null
    image_de?: string | null
    visible_pl: boolean
    visible_de: boolean

    meta_title_pl?: string | null
    meta_title_de?: string | null
    meta_description_pl?: string | null
    meta_description_de?: string | null
    meta_keywords_pl?: string | null
    meta_keywords_de?: string | null
    meta_copyright_pl?: string | null
    meta_copyright_de?: string | null
}

type FieldType = 'meta_title' | 'meta_description' | 'meta_keywords' | 'meta_copyright'

export default function Edit({ page }: { page: PageDto }) {
    // Osobny stan języka dla każdej sekcji
    const [fieldLang, setFieldLang] = useState<Record<FieldType, 'pl' | 'de'>>({
        meta_title: 'pl',
        meta_description: 'pl',
        meta_keywords: 'pl',
        meta_copyright: 'pl',
    })

    // Lokalny „toast” po zapisie z pozostaniem na edycji
    const [saved, setSaved] = useState(false)

    const form = useForm({
        name: page.name ?? '',
        slug: page.slug ?? '',

        meta_title_pl: page.meta_title_pl ?? '',
        meta_title_de: page.meta_title_de ?? '',
        meta_description_pl: page.meta_description_pl ?? '',
        meta_description_de: page.meta_description_de ?? '',
        meta_keywords_pl: page.meta_keywords_pl ?? '',
        meta_keywords_de: page.meta_keywords_de ?? '',
        meta_copyright_pl: page.meta_copyright_pl ?? '',
        meta_copyright_de: page.meta_copyright_de ?? '',

        visible_pl: !!page.visible_pl,
        visible_de: !!page.visible_de,

        image_pl: null as File | null,
        image_de: null as File | null,
    })

    const submit = (stay = false) => {
        form.transform((d: any) => {
            const payload: any = {
                ...d,
                stay,
                visible_pl: d.visible_pl ? 1 : 0,
                visible_de: d.visible_de ? 1 : 0,
                _method: 'put',
            }

            if (!(d.image_pl instanceof File)) delete payload.image_pl
            if (!(d.image_de instanceof File)) delete payload.image_de

            return payload
        })

        form.post(`/admin/settings/pages/${page.id}`, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                if (stay) {
                    setSaved(true)
                    window.setTimeout(() => setSaved(false), 2500)
                }
            },
            onFinish: () => {
                // przywróć transform do domyślnego, żeby kolejne submitty nie niosły 'stay'
                form.transform((d: any) => d)
            },
        })
    }

    const setFile =
        (key: 'image_pl' | 'image_de') =>
            (e: React.ChangeEvent<HTMLInputElement>) => {
                const f = e.target.files?.[0] ?? null
                form.setData(key, f)
            }

    const handleLangChange = (field: FieldType, lang: 'pl' | 'de') => {
        setFieldLang((prev) => ({ ...prev, [field]: lang }))
    }

    return (
        <AdminLayout>
            <main className="p-6">
                <p className="text-2xl font-bold">Aktualizacja Strona: {page.name}</p>

                {saved && (
                    <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-800">
                        <CheckCircle2 className="h-4 w-4" />
                        Zapisano zmiany
                    </div>
                )}

                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        submit(false)
                    }}
                    encType="multipart/form-data"
                    className="mt-6 rounded-xl border bg-white p-6"
                >
                    {/* NAZWA */}
                    <div className="mt-4">
                        <label className="block text-sm font-medium">
                            Nazwa <span className="text-rose-600">*</span>
                        </label>
                        <input
                            className="mt-2 w-full rounded-lg border bg-white px-3 py-2"
                            value={form.data.name}
                            onChange={(e) => form.setData('name', e.target.value)}
                            required
                        />
                        <Error msg={form.errors.name} />
                    </div>

                    {/* TYTUŁ META */}
                    <Field
                        label="Tytuł meta"
                        required
                        lang={fieldLang.meta_title}
                        onLangChange={(l) => handleLangChange('meta_title', l)}
                    >
                        <input
                            className="mt-2 w-full rounded-lg border bg-white px-3 py-2"
                            value={form.data[`meta_title_${fieldLang.meta_title}`]}
                            onChange={(e) => form.setData(`meta_title_${fieldLang.meta_title}`, e.target.value)}
                            required
                        />
                        <Error msg={form.errors[`meta_title_${fieldLang.meta_title}`]} />
                    </Field>

                    {/* OPIS META */}
                    <Field
                        label="Opis meta"
                        required
                        lang={fieldLang.meta_description}
                        onLangChange={(l) => handleLangChange('meta_description', l)}
                    >
            <textarea
                className="mt-2 w-full rounded-lg border bg-white px-3 py-2"
                rows={3}
                value={form.data[`meta_description_${fieldLang.meta_description}`]}
                onChange={(e) =>
                    form.setData(`meta_description_${fieldLang.meta_description}`, e.target.value)
                }
                required
            />
                        <Error msg={form.errors[`meta_description_${fieldLang.meta_description}`]} />
                    </Field>

                    {/* SŁOWA KLUCZOWE META */}
                    <Field
                        label="Słowa kluczowe meta"
                        required
                        lang={fieldLang.meta_keywords}
                        onLangChange={(l) => handleLangChange('meta_keywords', l)}
                    >
                        <input
                            className="mt-2 w-full rounded-lg border bg-white px-3 py-2"
                            value={form.data[`meta_keywords_${fieldLang.meta_keywords}`]}
                            onChange={(e) =>
                                form.setData(`meta_keywords_${fieldLang.meta_keywords}`, e.target.value)
                            }
                            required
                        />
                        <Error msg={form.errors[`meta_keywords_${fieldLang.meta_keywords}`]} />
                    </Field>

                    {/* FIRMA META */}
                    <Field
                        label="Firma meta"
                        required
                        lang={fieldLang.meta_copyright}
                        onLangChange={(l) => handleLangChange('meta_copyright', l)}
                    >
                        <input
                            className="mt-2 w-full rounded-lg border bg-white px-3 py-2"
                            value={form.data[`meta_copyright_${fieldLang.meta_copyright}`]}
                            onChange={(e) =>
                                form.setData(`meta_copyright_${fieldLang.meta_copyright}`, e.target.value)
                            }
                            required
                        />
                        <Error msg={form.errors[`meta_copyright_${fieldLang.meta_copyright}`]} />
                    </Field>

                    {/* LINK (slug) */}
                    <div className="mt-6">
                        <label className="block text-sm font-medium">Link</label>
                        <input
                            className="mt-2 w-full rounded-lg border bg-white px-3 py-2 font-mono"
                            value={form.data.slug}
                            onChange={(e) => form.setData('slug', e.target.value)}
                            placeholder="/"
                        />
                        <Error msg={form.errors.slug} />
                    </div>

                    {/* ZDJĘCIA */}
                    <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                        <UploadBox
                            label="Zdjęcie PL"
                            onChange={setFile('image_pl')}
                            preview={page.image_pl}
                            error={form.errors.image_pl}
                        />
                        <UploadBox
                            label="Zdjęcie DE"
                            onChange={setFile('image_de')}
                            preview={page.image_de}
                            error={form.errors.image_de}
                        />
                    </div>

                    {/* CHECKBOXY */}
                    <div className="mt-6 space-y-3">
                        <label className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={form.data.visible_pl}
                                onChange={(e) => form.setData('visible_pl', e.target.checked)}
                            />
                            <span>Widoczny w menu na polskiej wersji</span>
                        </label>
                        <label className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={form.data.visible_de}
                                onChange={(e) => form.setData('visible_de', e.target.checked)}
                            />
                            <span>Widoczny w menu na niemieckiej wersji</span>
                        </label>
                    </div>

                    {/* ACTIONS */}
                    <div className="mt-8 flex items-center justify-end gap-3">
                        <Link
                            href="/admin/settings/pages"
                            className="rounded-lg border px-4 py-2 hover:bg-slate-50"
                        >
                            Anuluj
                        </Link>
                        <button
                            type="button"
                            onClick={() => submit(true)}
                            className="rounded-lg bg-mint px-4 py-2 font-semibold cursor-pointer"
                            disabled={form.processing}
                        >
                            Aktualizuj i Kontynuuj Edycję
                        </button>
                        <button
                            type="submit"
                            className="rounded-lg bg-mint px-4 py-2 font-semibold cursor-pointer"
                            disabled={form.processing}
                        >
                            Aktualizuj Strona
                        </button>
                    </div>
                </form>
            </main>
        </AdminLayout>
    )
}

// ==== Pomocnicze komponenty ====

function Field({
                   label,
                   children,
                   required,
                   lang,
                   onLangChange,
               }: {
    label: string
    children: React.ReactNode
    required?: boolean
    lang: 'pl' | 'de'
    onLangChange: (l: 'pl' | 'de') => void
}) {
    return (
        <div className="mt-4">
            <div className="flex items-center justify-between">
                <label className="block text-sm font-medium">
                    {label} {required && <span className="text-rose-600">*</span>}
                </label>
                <LangSwitch lang={lang} onChange={onLangChange} />
            </div>
            {children}
        </div>
    )
}

function LangSwitch({
                        lang,
                        onChange,
                    }: {
    lang: 'pl' | 'de'
    onChange: (l: 'pl' | 'de') => void
}) {
    return (
        <div className="text-sm">
            <button
                type="button"
                onClick={() => onChange('pl')}
                className={`mr-3 hover:underline ${lang === 'pl' ? 'text-sky-600 font-semibold' : ''}`}
            >
                Polski
            </button>
            <button
                type="button"
                onClick={() => onChange('de')}
                className={`hover:underline ${lang === 'de' ? 'text-sky-600 font-semibold' : ''}`}
            >
                Niemiecki
            </button>
        </div>
    )
}

function UploadBox({
                       label,
                       onChange,
                       preview,
                       error,
                   }: {
    label: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    preview?: string | null
    error?: string
}) {
    return (
        <div>
            <label className="block text-sm font-medium">{label}</label>
            <label className="mt-2 block cursor-pointer rounded-lg border-2 border-dashed px-4 py-6 text-center hover:bg-slate-50">
                <span className="rounded bg-mint px-3 py-1 font-semibold">Wybierz Plik</span>
                <input type="file" accept="image/*" className="hidden" onChange={onChange} />
                {preview && (
                    <div className="mt-3">
                        <img
                            src={preview}
                            className="h-10 w-24 rounded object-cover ring-1 ring-slate-200"
                        />
                    </div>
                )}
            </label>
            <Error msg={error} />
        </div>
    )
}

function Error({ msg }: { msg?: string }) {
    if (!msg) return null
    return <p className="mt-1 text-sm text-rose-600">{msg}</p>
}
