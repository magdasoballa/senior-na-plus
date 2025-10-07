
import { Link, router } from '@inertiajs/react'
import { useState } from 'react'
import AdminLayout from '@/layouts/admin-layout';
import { CheckCircle2, Eye, Pencil, XCircle } from 'lucide-react';
import * as React from 'react';

type PageRow = {
  id: number
  name: string
  slug: string
  image_pl?: string | null
  image_de?: string | null
  visible_pl: boolean
  visible_de: boolean
}

type Pagination = {
  current_page: number
  last_page: number
  per_page: number
  total: number
  links: { url: string | null; label: string; active: boolean }[]
}

type Props = {
  pages: { data: PageRow[]; meta: Pagination }
  filters?: { q?: string }
}

export default function PagesIndex({ pages, filters }: Props) {
  const [q, setQ] = useState(filters?.q ?? '')

  function submitSearch(e: React.FormEvent) {
    e.preventDefault()
    router.get('/admin/settings/pages', { q }, { preserveState: true, replace: true })
  }

  return (
    <AdminLayout>
      <main className="p-6">
        {/* nagłówek */}
        <div className="text-sm text-green">Zasoby › Strony</div>
        <p className="mt-1 text-3xl font-bold">Strony</p>

        {/* wyszukiwarka */}
        <div className="mt-5">
          <form onSubmit={submitSearch} className="w-full max-w-xl">
            <div className="relative">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Szukaj"
                className="w-full rounded-full border bg-white px-4 py-2 pl-10 outline-none"
              />
              <span className="pointer-events-none absolute left-3 top-2.5">🔎</span>
            </div>
          </form>
        </div>

        {/* tabela */}
        <div className="mt-4 overflow-hidden rounded-xl border bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-green">
                <tr>
                  <Th className="w-16">ID</Th>
                  <Th>Nazwa</Th>
                  <Th className="w-40">Zdjęcie PL</Th>
                  <Th className="w-40">Zdjęcie DE</Th>
                  <Th className="w-64 text-center">Widoczny w menu na polskiej wersji</Th>
                  <Th className="w-64 text-center">Widoczny w menu na niemieckiej wersji</Th>
                  <Th className="w-32 text-right">Akcje</Th>
                </tr>
              </thead>
              <tbody>
                {pages.data.map((row) => (
                  <tr key={row.id} className="border-t">
                    <Td className="font-mono">{row.id}</Td>

                    <Td>
                      <Link
                        href={`/admin/settings/pages/${row.id}/edit`}
className="font-medium text-sky-700 hover:underline"
    >
    {row.name}
</Link>
<div className="text-xs text-green">{row.slug}</div>
</Td>

<Td>{row.image_pl ? <Thumb src={row.image_pl} /> : <span>—</span>}</Td>
<Td>{row.image_de ? <Thumb src={row.image_de} /> : <span>—</span>}</Td>

{/* WYŚRODKOWANE IKONY */}
<Td className="text-center"><Status ok={row.visible_pl} /></Td>
<Td className="text-center"><Status ok={row.visible_de} /></Td>

<Td className="text-right">
    <div className="inline-flex items-center gap-2">
        <Link
            href={`/admin/settings/pages/${row.id}`}
            className="rounded border px-2 py-1 hover:bg-slate-50"
            title="Podgląd"
        >
            <Eye className="h-4 w-4" />
        </Link>
        <Link
            href={`/admin/settings/pages/${row.id}/edit`}
            className="rounded-md px-2 py-1 hover:bg-slate-50 border"
            title="Edytuj"
        >
            <Pencil className="h-4 w-4" />
        </Link>
    </div>
</Td>
</tr>
))}

{pages.data.length === 0 && (
    <tr>
        <Td colSpan={7} className="py-10 text-center text-green">
            Brak wyników.
        </Td>
    </tr>
)}
</tbody>
</table>
</div>

{/* paginacja */}
<div className="flex items-center justify-between border-t px-4 py-3 text-sm text-green">
    <div>{rangeInfo(pages.meta)}</div>
    <nav className="flex items-center gap-1">
        {pages.meta.links.map((l, i) => (
            <Link
                key={i}
                href={l.url ?? '#'}
                className={[
                    'rounded-md px-3 py-1',
                    l.active ? 'bg-slate-200 font-semibold' : 'hover:bg-slate-50',
                    !l.url && 'pointer-events-none opacity-40',
                ].join(' ')}
                preserveScroll
            >
                {sanitizeLabel(l.label)}
            </Link>
        ))}
    </nav>
</div>
</div>

{/* stopka */}
<div className="py-6 text-center text-xs text-green">
    Senior na plus {new Date().getFullYear()}
</div>
</main>
</AdminLayout>
)
}

/* ——— helpers / małe komponenty ——— */

function Th({ children, className = '' }: React.PropsWithChildren<{ className?: string }>) {
    return (
        <th className={`px-4 py-3 text-xs font-semibold uppercase ${className}`}>{children}</th>
    )
}

function Td({
                children,
                className = '',
                colSpan,
            }: React.PropsWithChildren<{ className?: string; colSpan?: number }>) {
    return (
        <td colSpan={colSpan} className={`px-4 py-3 align-middle ${className}`}>{children}</td>
    )
}

function Thumb({ src }: { src: string }) {
    return (
        <img
            src={src}
            alt=""
            className="h-6 w-16 rounded object-cover ring-1 ring-slate-200"
            loading="lazy"
        />
    )
}

function Status({ ok }: { ok: boolean }) {
    return (
        <span className="inline-flex items-center justify-center">
      {ok ? (
          <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-hidden />
      ) : (
          <XCircle className="h-5 w-5 text-rose-600" aria-hidden />
      )}
            <span className="sr-only">{ok ? 'Widoczny' : 'Niewidoczny'}</span>
    </span>
    )
}

function sanitizeLabel(label: string) {
    // „« Poprzedni” / „Następny »” -> usuwamy HTML
    return label.replace(/&laquo;|&raquo;/g, '').trim()
}

function rangeInfo(meta: Pagination) {
    const start = (meta.current_page - 1) * meta.per_page + 1
    const end = Math.min(meta.current_page * meta.per_page, meta.total)
    return `${start}-${end} z ${meta.total}`
}

