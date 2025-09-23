import AppLayout from '@/layouts/app-layout'
import { Link } from '@inertiajs/react'
import { useState } from 'react'
import AdminLayout from '@/layouts/admin-layout';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function Show({ page }: any) {
    const [lang, setLang] = useState<'pl' | 'de'>('pl')

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


    return (
        <AdminLayout>
            <main className="p-6">
                <div className="text-sm text-green">Zasoby › Strony › Szczegóły Strona: {page.name}</div>
                <div className="mt-1 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Szczegóły Strona: {page.name}</h1>
                    <Link
                        href={`/admin/settings/pages/${page.id}/edit`}
                        className="rounded-lg border px-3 py-1 hover:bg-slate-50"
                    >
                        ✎
                    </Link>
                </div>

                <div className="mt-6 rounded-xl border bg-white">
                    <dl className="divide-y">
                        <Row label="ID">{page.id}</Row>
                        <Row label="Nazwa">{page.name}</Row>

                        <Row label="Tytuł meta" right={<LangSwitch lang={lang} onChange={setLang} />}>
                            {page[`meta_title_${lang}`] ?? '—'}
                        </Row>

                        <Row label="Opis meta" right={<LangSwitch lang={lang} onChange={setLang} />}>
                            {page[`meta_description_${lang}`] ?? '—'}
                        </Row>

                        <Row label="Słowa kluczowe meta" right={<LangSwitch lang={lang} onChange={setLang} />}>
                            {page[`meta_keywords_${lang}`] ?? '—'}
                        </Row>

                        <Row label="Firma meta" right={<LangSwitch lang={lang} onChange={setLang} />}>
                            {page[`meta_copyright_${lang}`] ?? '—'}
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

                        <Row label="Widoczny w menu na polskiej wersji"><Status ok={!!page.visible_pl} /></Row>
                        <Row label="Widoczny w menu na niemieckiej wersji"><Status ok={!!page.visible_de} /></Row>
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
