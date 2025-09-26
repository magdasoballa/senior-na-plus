import { Link, router, usePage } from '@inertiajs/react'
import AdminLayout from '@/layouts/admin-layout'
import { useState } from 'react'
import { CheckCircle2, Pencil, XCircle } from 'lucide-react';
import * as React from 'react';

type Row = { id:number; title:string; image_url:string|null; is_visible:boolean }
type Paginated<T> = { data:T[]; links:{url:string|null;label:string;active:boolean}[]; current_page:number; per_page:number; total:number }

const BASE = '/admin/dictionaries/recruitment-reqs'

export default function Index(){
    const { requirements, filters } = usePage<{ requirements:Paginated<Row>; filters:{q?:string} }>().props
    const [q,setQ] = useState(filters?.q ?? '')

    const submit = (e:React.FormEvent)=>{ e.preventDefault(); router.get(BASE,{q},{preserveState:true,replace:true}) }

    return (
        <AdminLayout>
            <main className="p-6">
                <div className="text-sm text-slate-500">Zasoby › Wymagania rekrutacyjne</div>
                <div className="mt-1 flex items-center justify-between">
                    <p className="text-2xl font-bold">Wymagania rekrutacyjne</p>
                    <Link href={`${BASE}/create`} className="rounded-lg bg-mint px-3 py-1 font-semibold text-white hover:brightness-110">
                        Utwórz Wymaganie rekrutacyjne
                    </Link>
                </div>

                <form onSubmit={submit} className="mt-4 max-w-md">
                    <div className="relative">
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
                            <th className="px-4 py-3">TYTUŁ</th>
                            <th className="w-36 px-4 py-3">ZDJĘCIE</th>
                            <th className="w-36 px-4 py-3">WIDOCZNY</th>
                            <th className="w-28 px-4 py-3 text-right">AKCJE</th>
                        </tr>
                        </thead>
                        <tbody>
                        {requirements.data.map(r=>(
                            <tr key={r.id} className="border-t">
                                <td className="px-4 py-3 font-mono text-teal-600"><Link href={`${BASE}/${r.id}`}>{r.id}</Link></td>
                                <td className="px-4 py-3">{r.title}</td>
                                <td className="px-4 py-3">
                                    {r.image_url ? <img src={r.image_url} className="h-8 w-12 rounded object-cover" /> : '—'}
                                </td>
                                <td className="px-4 py-3">{r.is_visible ?  <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-hidden /> : <XCircle className="h-5 w-5 text-rose-600" aria-hidden />}</td>
                                <td className="px-4 py-3">
                                    <div className="flex justify-end gap-2">
                                        <Link href={`${BASE}/${r.id}`} className="rounded border px-2 py-1" title="Podgląd">👁</Link>
                                        <Link href={`${BASE}/${r.id}/edit`} className="rounded border px-2 py-1" title="Edytuj"><Pencil className="h-4 w-4" /></Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {requirements.data.length===0 && (
                            <tr><td className="px-4 py-8 text-center text-slate-500" colSpan={5}>Brak rekordów</td></tr>
                        )}
                        </tbody>
                    </table>

                    <div className="flex items-center justify-between border-t px-4 py-3 text-sm text-slate-600">
                        <span>{rangeInfo(requirements)}</span>
                        <nav className="flex items-center gap-1">
                            {requirements.links.map((l,i)=>(
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
