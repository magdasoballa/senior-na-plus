import { Link, router, usePage } from '@inertiajs/react'
import { useState } from 'react'
import AdminLayout from '@/layouts/admin-layout'
import { Eye, Pencil, Trash2, Plus, Filter } from 'lucide-react';
import { FilterPopover, FilterRow, Select } from '@/components/admin/FilterPopover'
import * as React from 'react';

type Row = { id:number; name:string|null; email:string; avatar_url:string; created_at:string|null }
type Paginated<T> = { data:T[]; links:{url:string|null; label:string; active:boolean}[]; current_page:number; last_page:number; per_page:number; total:number }

const BASE = '/admin/users'

export default function Index(){
    const { users, filters } = usePage<{ users:Paginated<Row>, filters:any }>().props
    const [q, setQ] = useState<string>(filters?.q ?? '')
    const [perPage, setPerPage] = useState<number>(Number(filters?.per_page) || users.per_page || 25)
    const [open, setOpen] = useState(false)

    const submit = (e?:React.FormEvent) => {
        e?.preventDefault()
        router.get(BASE, { q, per_page: perPage }, { preserveState:true, replace:true })
    }

    const destroyRow = (id:number) => {
        if (!confirm('Usunąć użytkownika?')) return
        router.delete(`${BASE}/${id}`, { preserveScroll:true })
    }

    return (
        <AdminLayout>
            <main className="p-6">
                <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold">Użytkownicy</p>
                    <Link href={`${BASE}/create`} className="rounded-lg bg-mint px-4 py-2 font-semibold text-white">
                        Utwórz Użytkownika
                    </Link>
                </div>

                <div className="mt-4 flex items-center gap-3">
                    <form onSubmit={submit} className="flex  items-center gap-3">
                        <div className="relative w-80">
                            <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Szukaj" className="w-full rounded-full border bg-white px-4 py-2 pl-10"/>
                            <span className="pointer-events-none absolute left-3 top-2.5">🔎</span>
                        </div>
                    </form>

                    <div className="relative">
                        <button onClick={() => setOpen((v) => !v)} aria-expanded={open} className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-slate-50">
                            <Filter className="h-4 w-4" />
                            <span>Filtry</span>
                        </button>

                        <FilterPopover open={open} setOpen={setOpen} onApply={()=>submit()} onReset={()=>{
                            setQ('')
                            setPerPage(25)
                            router.get(BASE, {}, { preserveState:true, replace:true })
                        }}>
                            <FilterRow label="Na stronę">
                                <Select value={String(perPage)} onChange={(e)=>setPerPage(Number(e.target.value))}>
                                    {[10,25,50,100].map(n => <option key={n} value={n}>{n}</option>)}
                                </Select>
                            </FilterRow>
                        </FilterPopover>
                    </div>
                </div>

                <div className="mt-4 overflow-x-auto rounded-xl border bg-white">
                    <table className="w-full table-auto text-sm min-w-[900px]">
                        <thead className="bg-slate-50 text-slate-600">
                        <tr>
                            <th className="w-12 px-4">ID</th>
                            <th className="px-4">Avatar</th>
                            <th className="px-4">Imię</th>
                            <th className="px-4">Email</th>
                            <th className="w-28 px-4 text-right">Akcje</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.data.map(u=>(
                            <tr key={u.id} className="border-t">
                                <td className="px-4">
                                    <div className="h-12 flex items-center">
                                        <Link href={`${BASE}/${u.id}`} className="font-mono text-teal-600">{u.id}</Link>
                                    </div>
                                </td>
                                <td className="px-4">
                                    <div className="h-12 flex items-center">
                                        <img src={u.avatar_url} alt="" className="h-8 w-8 rounded-full"/>
                                    </div>
                                </td>
                                <td className="px-4"><div className="h-12 flex items-center">{u.name || '—'}</div></td>
                                <td className="px-4"><div className="h-12 flex items-center">{u.email}</div></td>
                                <td className="px-4">
                                    <div className="h-12 flex items-center justify-end gap-2">
                                        <Link href={`${BASE}/${u.id}`} className="inline-flex h-8 w-8 items-center justify-center rounded border"><Eye className="h-4 w-4"/></Link>
                                        <Link href={`${BASE}/${u.id}/edit`} className="inline-flex h-8 w-8 items-center justify-center rounded border"><Pencil className="h-4 w-4"/></Link>
                                        <button onClick={()=>destroyRow(u.id)} className="inline-flex h-8 w-8 items-center justify-center rounded border"><Trash2 className="h-4 w-4"/></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {users.data.length === 0 && (
                            <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500">Brak rekordów</td></tr>
                        )}
                        </tbody>
                    </table>

                    <div className="flex items-center justify-between border-t px-4 py-3 text-sm text-slate-600">
                        <span>{rangeInfo(users)}</span>
                        <nav className="flex items-center gap-1">
                            {users.links.map((l,i)=>(
                                <Link key={i} href={l.url ?? '#'} preserveScroll className={`rounded-md px-3 py-1 ${l.active?'bg-slate-200 font-semibold':'hover:bg-slate-50'} ${!l.url && 'pointer-events-none opacity-40'}`}>{sanitize(l.label)}</Link>
                            ))}
                        </nav>
                    </div>
                </div>
            </main>
        </AdminLayout>
    )
}

function sanitize(s:string){ return s.replace(/&laquo;|&raquo;/g,'').trim() }
function rangeInfo(p:Paginated<any>){ if(p.total===0) return '0-0 z 0'; const a=(p.current_page-1)*p.per_page+1; const b=Math.min(p.current_page*p.per_page,p.total); return `${a}-${b} z ${p.total}` }
