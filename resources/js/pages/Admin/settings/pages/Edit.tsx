import AppLayout from '@/layouts/app-layout'
import { Link, useForm } from '@inertiajs/react'
import { useMemo, useState } from 'react'
import AdminLayout from '@/layouts/admin-layout';

type PageDto = {
  id: number
  name: string
  slug: string // link
  image_pl?: string | null
  image_de?: string | null
  visible_pl: boolean
  visible_de: boolean

  // meta (PL/DE)
  meta_title_pl?: string | null
  meta_title_de?: string | null
  meta_description_pl?: string | null
  meta_description_de?: string | null
  meta_keywords_pl?: string | null
  meta_keywords_de?: string | null
  meta_copyright_pl?: string | null
  meta_copyright_de?: string | null
}

export default function Edit({ page }: { page: PageDto }) {
  const [lang, setLang] = useState<'pl' | 'de'>('pl')

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
                _method: 'put', // method spoofing
            };

            // ⬇️ kluczowe: nie wysyłaj pustych "plików"
            if (!(d.image_pl instanceof File)) delete payload.image_pl;
            if (!(d.image_de instanceof File)) delete payload.image_de;

            return payload;
        });

        form.post(`/admin/settings/pages/${page.id}`, {
            forceFormData: true,      // multipart/form-data
            preserveScroll: true,
        });
    };




  const setFile = (key: 'image_pl' | 'image_de') =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0] ?? null
      form.setData(key, f)
    }

  return (
    <AdminLayout>
      <main className="p-6">
        <h1 className="text-2xl font-bold">Aktualizacja Strona: {page.name}</h1>

        <form
          onSubmit={(e) => { e.preventDefault(); submit(false) }}
          encType="multipart/form-data"
          className="mt-6 rounded-xl border bg-white p-6"
        >
          {/* NAZWA */}
          <Field label="Nazwa" required lang={lang} onLangChange={setLang}>
            <input
              className="mt-2 w-full rounded-lg border bg-white px-3 py-2"
              value={form.data.name}
              onChange={(e) => form.setData('name', e.target.value)}
              required
            />
            <Error msg={form.errors.name} />
          </Field>

          {/* TYTUŁ META */}
          <Field label="Tytuł meta" required lang={lang} onLangChange={setLang}>
            <input
              className="mt-2 w-full rounded-lg border bg-white px-3 py-2"
              value={form.data[`meta_title_${lang}`]}
              onChange={(e) => form.setData(`meta_title_${lang}`, e.target.value)}
              required
            />
            <Error msg={form.errors[`meta_title_${lang}`]} />
          </Field>

          {/* OPIS META */}
          <Field label="Opis meta" required lang={lang} onLangChange={setLang}>
            <textarea
              className="mt-2 w-full rounded-lg border bg-white px-3 py-2"
              rows={3}
              value={form.data[`meta_description_${lang}`]}
              onChange={(e) => form.setData(`meta_description_${lang}`, e.target.value)}
              required
            />
            <Error msg={form.errors[`meta_description_${lang}`]} />
          </Field>

          {/* SŁOWA KLUCZOWE META */}
          <Field label="Słowa kluczowe meta" required lang={lang} onLangChange={setLang}>
            <input
              className="mt-2 w-full rounded-lg border bg-white px-3 py-2"
              value={form.data[`meta_keywords_${lang}`]}
              onChange={(e) => form.setData(`meta_keywords_${lang}`, e.target.value)}
              required
            />
            <Error msg={form.errors[`meta_keywords_${lang}`]} />
          </Field>

          {/* FIRMA META */}
          <Field label="Firma meta" required lang={lang} onLangChange={setLang}>
            <input
              className="mt-2 w-full rounded-lg border bg-white px-3 py-2"
              value={form.data[`meta_copyright_${lang}`]}
              onChange={(e) => form.setData(`meta_copyright_${lang}`, e.target.value)}
              required
            />
            <Error msg={form.errors[`meta_copyright_${lang}`]} />
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
            <Link href="/admin/settings/pages" className="rounded-lg px-4 py-2 hover:bg-slate-50 border">
              Anuluj
            </Link>
            <button
              type="button"
              onClick={() => submit(true)}
              className="rounded-lg bg-mint px-4 py-2 font-semibold"
              disabled={form.processing}
            >
              Aktualizuj i Kontynuuj Edycję
            </button>
            <button
              type="submit"
              className="rounded-lg bg-mint px-4 py-2 font-semibold"
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

/* ------- helpers ------- */

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
            <img src={preview} className="h-10 w-24 rounded object-cover ring-1 ring-slate-200" />
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
