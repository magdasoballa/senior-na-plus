import { Link, router, usePage } from '@inertiajs/react'
import AdminLayout from '@/layouts/admin-layout'
import { useState } from 'react'
import { CheckCircle2, Eye, Pencil, XCircle, Trash2 } from 'lucide-react' // ⬅️ + Trash2
import * as React from 'react'

type Row = { id:number; name:string; link:string|null; image_url:string|null; is_visible:boolean }
type Paginated<T> = {
    data:T[]; links:{url:string|null;label:string;active:boolean}[];
    current_page:number; last_page:number; per_page:number; total:number
}

const BASE = '/admin/settings/popups'

export default function Index(){
    const { popups, filters } = usePage<{ popups:Paginated<Row>; filters:{q?:string} }>().props
    const [q,setQ] = useState(filters?.q ?? '')
    const [deletingId, setDeletingId] = useState<number|null>(null)   // ⬅️

    const submit = (e:React.FormEvent)=>{ e.preventDefault(); router.get(BASE,{q},{preserveState:true,replace:true}) }

    const handleDelete = (row: Row) => {                              // ⬅️
        if (!confirm(`Na pewno usunąć popup "${row.name}" (ID: ${row.id})?`)) return
        setDeletingId(row.id)
        router.delete(`${BASE}/${row.id}`, {
            preserveScroll: true,
            onFinish: () => setDeletingId(null),
        })
    }

    return (
        <AdminLayout>
            <main className="p-6">
                <div className="mt-1 flex items-center justify-between">
                    <p className="text-2xl font-bold">Popup</p>
                    <Link href={`${BASE}/create`} className="rounded-lg bg-mint px-3 py-1 font-semibold text-white hover:brightness-110">+ Dodaj</Link>
                </div>

                <form onSubmit={submit} className="mt-4 max-w-md">
                    <div className="relative w-80">
                        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Szukaj"
                               className="w-full rounded-full border bg-white px-4 py-2 pl-10" />
                        <span className="pointer-events-none absolute left-3 top-2.5">🔎</span>
                    </div>
                </form>

                <div className="mt-4 overflow-hidden rounded-xl border bg-white">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 text-slate-600">
                        <tr>
                            <th className="w-16 px-4 py-3">ID</th>
                            <th className="px-4 py-3">NAZWA</th>
                            <th className="px-4 py-3">LINK</th>
                            <th className="px-4 py-3">ZDJĘCIE</th>
                            <th className="px-4 py-3">WIDOCZNY</th>
                            <th className="w-40 px-4 py-3 text-right">AKCJE</th> {/* ⬅️ szersza kolumna */}
                        </tr>
                        </thead>
                        <tbody>
                        {popups.data.map(r=>(
                            <tr key={r.id} className="border-t">
                                <td className="px-4 py-3 font-mono text-teal-600"><Link href={`${BASE}/${r.id}`}>{r.id}</Link></td>
                                <td className="px-4 py-3">{r.name}</td>
                                <td className="px-4 py-3">
                                    {r.link ? <a href={r.link} target="_blank" rel="noreferrer" className="text-sky-600 hover:underline">{r.link}</a> : '—'}
                                </td>
                                <td className="px-4 py-3">{r.image_url ? <img src={r.image_url} alt="" className="h-8 w-8 rounded object-cover" /> : '—'}</td>
                                <td className="px-4 py-3">
                                    <div className="flex justify-center">
                                        {r.is_visible ?  <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-hidden />
                                            : <XCircle className="h-5 w-5 text-rose-600" aria-hidden />}
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex justify-end gap-2">
                                        <Link href={`${BASE}/${r.id}`} className="rounded border px-2 py-1" title="Podgląd">
                                            <Eye className="h-4 w-4" />
                                        </Link>
                                        <Link href={`${BASE}/${r.id}/edit`} className="rounded border px-2 py-1" title="Edytuj">
                                            <Pencil className="h-4 w-4" />
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={()=>handleDelete(r)}
                                            disabled={deletingId === r.id}
                                            title="Usuń"
                                            className={`rounded border px-2 py-1 text-rose-600 hover:bg-rose-50 ${deletingId===r.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {popups.data.length===0 && (
                            <tr><td className="px-4 py-8 text-center text-slate-500" colSpan={6}>Brak rekordów</td></tr>
                        )}
                        </tbody>
                    </table>

                    <div className="flex items-center justify-between border-t px-4 py-3 text-sm text-slate-600">
                        <span>{rangeInfo(popups)}</span>
                        <nav className="flex items-center gap-1">
                            {popups.links.map((l,i)=>(
                                <Link key={i} href={l.url ?? '#'} preserveScroll
                                      className={`rounded-md px-3 py-1 ${l.active ? 'bg-slate-200 font-semibold' : 'hover:bg-slate-50'} ${!l.url && 'pointer-events-none opacity-40'}`}>
                                    {sanitize(l.label)}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>
            </main>
        </AdminLayout>
    )
}

function sanitize(s:string){return s.replace(/&laquo;|&raquo;/g,'').trim()}
function rangeInfo(p:Paginated<any>){
    if(p.total===0) return '0-0 z 0'
    const start=(p.current_page-1)*p.per_page+1
    const end=Math.min(p.current_page*p.per_page,p.total)
    return `${start}-${end} z ${p.total}`
}
