import AppLayout from '@/layouts/app-layout'
import { Link } from '@inertiajs/react'
import { useState } from 'react'
import AdminLayout from '@/layouts/admin-layout';
import { CheckCircle2, Pencil, XCircle } from 'lucide-react';

type FieldType = 'meta_title' | 'meta_description' | 'meta_keywords' | 'meta_copyright'

export default function Show({ page }: any) {
    // Osobny stan języka dla każdej sekcji
    const [fieldLang, setFieldLang] = useState<Record<FieldType, 'pl' | 'de'>>({
        meta_title: 'pl',
        meta_description: 'pl',
        meta_keywords: 'pl',
        meta_copyright: 'pl',
    })

    function Status({ ok }: { ok: boolean }) {
        return (
            <span className="inline-flex items-center gap-2">
                {ok ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-hidden />
                ) : (
                    <XCircle className="h-5 w-5 text-rose-600" aria-hidden />
                )}
                <span className="sr-only">{ok ? 'Widoczny' : 'Niewidoczny'}</span>
            </span>
        )
    }

    const handleLangChange = (field: FieldType, lang: 'pl' | 'de') => {
        setFieldLang(prev => ({ ...prev, [field]: lang }))
    }

    const BASE = '/admin/settings/pages'


    return (
        <AdminLayout>
            <main className="p-6">
                <div className="text-sm text-green">Zasoby › Strony › Szczegóły Strona: {page.name}</div>
                <div className="mt-1 flex items-center justify-between">
                    <p className="text-2xl font-bold">Szczegóły Strona: {page.name}</p>
                    <div className="flex gap-2">
                        <Link href={`${BASE}/${page.id}/edit`} className="rounded-lg border px-3 py-1 hover:bg-slate-50">
                            <Pencil/>
                        </Link>

                        <Link href={BASE} className="rounded-lg border px-3 py-1 hover:bg-slate-50">↩︎</Link>
                    </div>
                </div>

                <div className="mt-6 rounded-xl border bg-white">
                    <dl className="divide-y">
                        <Row label="ID">{page.id}</Row>
                        <Row label="Nazwa">{page.name}</Row>

                        {/* TYTUŁ META - osobny przełącznik */}
                        <Row label="Tytuł meta" right={
                            <LangSwitch
                                lang={fieldLang.meta_title}
                                onChange={(l) => handleLangChange('meta_title', l)}
                            />
                        }>
                            {page[`meta_title_${fieldLang.meta_title}`] ?? '—'}
                        </Row>

                        {/* OPIS META - osobny przełącznik */}
                        <Row label="Opis meta" right={
                            <LangSwitch
                                lang={fieldLang.meta_description}
                                onChange={(l) => handleLangChange('meta_description', l)}
                            />
                        }>
                            {page[`meta_description_${fieldLang.meta_description}`] ?? '—'}
                        </Row>

                        {/* SŁOWA KLUCZOWE META - osobny przełącznik */}
                        <Row label="Słowa kluczowe meta" right={
                            <LangSwitch
                                lang={fieldLang.meta_keywords}
                                onChange={(l) => handleLangChange('meta_keywords', l)}
                            />
                        }>
                            {page[`meta_keywords_${fieldLang.meta_keywords}`] ?? '—'}
                        </Row>

                        {/* FIRMA META - osobny przełącznik */}
                        <Row label="Firma meta" right={
                            <LangSwitch
                                lang={fieldLang.meta_copyright}
                                onChange={(l) => handleLangChange('meta_copyright', l)}
                            />
                        }>
                            {page[`meta_copyright_${fieldLang.meta_copyright}`] ?? '—'}
                        </Row>

                        <Row label="Link">{page.slug || '—'}</Row>

                        <Row label="Zdjęcie PL">
                            {page.image_pl ? (
                                <div className="flex items-center gap-3">
                                    <img src={page.image_pl} className="h-10 w-24 rounded object-cover ring-1 ring-slate-200" />
                                    <a href={page.image_pl} target="_blank" className="text-sky-700 hover:underline">Pobierz</a>
                                </div>
                            ) : '—'}
                        </Row>

                        <Row label="Zdjęcie DE">
                            {page.image_de ? (
                                <div className="flex items-center gap-3">
                                    <img src={page.image_de} className="h-10 w-24 rounded object-cover ring-1 ring-slate-200" />
                                    <a href={page.image_de} target="_blank" className="text-sky-700 hover:underline">Pobierz</a>
                                </div>
                            ) : '—'}
                        </Row>

                        <Row label="Widoczny w menu na polskiej wersji">
                            <Status ok={!!page.visible_pl} />
                        </Row>
                        <Row label="Widoczny w menu na niemieckiej wersji">
                            <Status ok={!!page.visible_de} />
                        </Row>
                    </dl>
                </div>

                {/* Sekcje na stronie – placeholder jak na screenie */}
                <div className="mt-6">
                    <div className="mb-2 flex items-center justify-between">
                        <h2 className="text-lg font-semibold">Sekcje na stronie</h2>
                        <div className="flex items-center gap-2">
                            <button className="rounded-md border px-2 py-1">▾</button>
                            <button className="rounded-md border px-2 py-1">⏷</button>
                        </div>
                    </div>
                    <div className="rounded-xl border bg-white p-6 text-green">
                        {/* tu dorobimy listing sekcji */}
                        Brak sekcji.
                    </div>
                </div>
            </main>
        </AdminLayout>
    )
}

function Row({
                 label,
                 children,
                 right,
             }: {
    label: string
    children: React.ReactNode
    right?: React.ReactNode
}) {
    return (
        <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-3">
            <dt className="text-sm font-medium">{label}</dt>
            <dd className="md:col-span-2 flex items-center justify-between">
                <div>{children}</div>
                {right}
            </dd>
        </div>
    )
}

function LangSwitch({ lang, onChange }: { lang: 'pl' | 'de'; onChange: (l: 'pl' | 'de') => void }) {
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
