import { Link, router, usePage } from '@inertiajs/react'
import AdminLayout from '@/layouts/admin-layout'
import { CheckCircle2, Eye, Pencil, XCircle, Trash2 } from 'lucide-react'
import { useState } from 'react'

type Row = { id:number; name:string; is_visible:boolean }
type PageProps = {
    duties: {
        data: Row[]
        current_page: number
        last_page: number
        links: { url:string|null; label:string; active:boolean }[]
    }
    filters: { q: string }
}

const BASE = '/admin/offers/duties'

export default function Index(){
    const { duties, filters } = usePage<PageProps>().props
    const [q, setQ] = useState(filters.q ?? '')
    const [deletingId, setDeletingId] = useState<number|null>(null)

    const search = (e:React.FormEvent)=>{
        e.preventDefault()
        router.get(BASE, { q }, { preserveState:true, replace:true })
    }

    const handleDelete = (id:number) => {
        if (!confirm('Na pewno usunąć ten obowiązek?')) return
        setDeletingId(id)
        router.delete(`${BASE}/${id}`, {
            data: q ? { q } : {},
            preserveScroll: true,
            onFinish: () => setDeletingId(null),
        })
    }

    return (
        <AdminLayout>
            <main className="p-6">
                {/* nagłówek + CTA */}
                <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold">Obowiązki</p>
                    <Link
                        href={`${BASE}/create`}
                        className="rounded-lg bg-mint px-4 py-2 font-semibold text-white hover:brightness-110"
                    >
                        Utwórz Obowiązek
                    </Link>
                </div>

                {/* search „pill” */}
                <form onSubmit={search} className="mt-4">
                    <div className="relative w-80">
                        <input
                            placeholder="Szukaj"
                            className="w-full rounded-full border border-slate-200 bg-white px-4 py-2 pl-10 outline-none focus:ring-2 focus:ring-emerald-300"
                            value={q}
                            onChange={(e)=>setQ(e.target.value)}
                        />
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔎</span>
                    </div>
                </form>

                {/* tabela */}
                <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                        <tr>
                            <th className="px-4 py-3">ID</th>
                            <th className="px-4 py-3">NAZWA</th>
                            <th className="px-4 py-3">WIDOCZNOŚĆ</th>
                            <th className="px-4 py-3 text-right">AKCJE</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                        {duties.data.map(row=>(
                            <tr key={row.id}>
                                <td className="px-4 py-3">
                                    <Link href={`${BASE}/${row.id}`} className="text-emerald-700 hover:underline">
                                        {row.id}
                                    </Link>
                                </td>
                                <td className="px-4 py-3">{row.name}</td>
                                <td className="px-4 py-3">
                                    {row.is_visible
                                        ? <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-hidden />
                                        : <XCircle className="h-5 w-5 text-rose-600" aria-hidden />}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center justify-end gap-2">
                                        {/* PODGLĄD */}
                                        <Link
                                            href={`${BASE}/${row.id}`}
                                            className="rounded-md border border-slate-200 bg-white p-2 hover:bg-slate-50"
                                            aria-label="Podgląd"
                                            title="Podgląd"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Link>
                                        {/* EDYCJA */}
                                        <Link
                                            href={`${BASE}/${row.id}/edit`}
                                            className="rounded-md border border-slate-200 bg-white p-2 hover:bg-slate-50"
                                            aria-label="Edytuj"
                                            title="Edytuj"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Link>
                                        {/* USUŃ */}
                                        <button
                                            type="button"
                                            onClick={()=>handleDelete(row.id)}
                                            disabled={deletingId===row.id}
                                            className="rounded-md border border-slate-200 bg-white p-2 text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                                            aria-label="Usuń"
                                            title="Usuń"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {duties.data.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-4 py-8 text-center text-slate-500">Brak danych</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                {/* paginacja „1–1 z N” + pager */}
                <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
                    <div>
                        {duties.data.length > 0
                            ? `${(duties.current_page-1)*duties.data.length+1}–${(duties.current_page-1)*duties.data.length + duties.data.length} z ${duties.data.length}`
                            : '0 z 0'}
                    </div>
                    <div className="flex items-center gap-2">
                        {duties.links.map((l,i)=>(
                            <button
                                key={i}
                                disabled={!l.url}
                                onClick={()=> l.url && router.get(l.url, {}, { preserveState:true, replace:true })}
                                className={`rounded-md px-3 py-1 ${l.active ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'} disabled:opacity-50`}
                            >
                                <span dangerouslySetInnerHTML={{__html:l.label}} />
                            </button>
                        ))}
                    </div>
                </div>
            </main>
        </AdminLayout>
    )
}
