import { Link, router, usePage } from '@inertiajs/react'
import { useState } from 'react'
import { Eye, Pencil, Trash2, Filter, CheckCircle2, XCircle, Plus } from 'lucide-react'
import AdminLayout from '@/layouts/admin-layout'
import { FilterPopover, FilterRow, Select, TriStateRead } from '@/components/admin/FilterPopover'

type Row = { id:number; link:string; image_url:string|null; is_visible:boolean; created_at:string|null }
type Paginated<T> = { data:T[]; links:{url:string|null; label:string; active:boolean}[]; current_page:number; last_page:number; per_page:number; total:number }

const BASE = '/admin/partners'

export default function Index(){
    const { partners, filters } = usePage<{ partners:Paginated<Row>, filters:any }>().props
    const [q,setQ] = useState<string>(filters?.q ?? '')
    const [visible, setVisible] = useState<'all'|'1'|'0'>(filters?.is_visible ?? 'all')
    const [perPage, setPerPage] = useState<number>(Number(filters?.per_page) || partners.per_page || 25)
    const [open, setOpen] = useState(false)

    const submit = (e?:React.FormEvent) => {
        e?.preventDefault()
        const params:Record<string,any> = { q, per_page: perPage }
        if (visible !== 'all') params.is_visible = visible
        router.get(BASE, params, { preserveState:true, replace:true })
    }

    const destroyRow = (id:number) => {
        if(!confirm('Usunąć partnera?')) return
        router.delete(`${BASE}/${id}`, { preserveScroll:true })
    }

    return (
        <AdminLayout>
            <main className="p-6">
                <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold">Partnerzy</p>
                    <Link href={`${BASE}/create`} className="inline-flex items-center gap-2 rounded-md bg-mint px-3 py-2 text-white text-sm">
                        <Plus className="h-4 w-4" /> Utwórz Partner
                    </Link>
                </div>

                <div className="mt-4 flex items-center gap-3">
                    <form onSubmit={submit} className="flex w-full max-w-xl items-center gap-3">
                        <div className="relative flex-1">
                            <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Szukaj" className="w-full rounded-full border bg-white px-4 py-2 pl-10"/>
                            <span className="pointer-events-none absolute left-3 top-2.5">🔎</span>
                        </div>
                    </form>

                    <div className="relative">
                        <button type="button" onClick={()=>setOpen(v=>!v)} className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-slate-50">
                            <Filter className="h-4 w-4"/><span>Filtry</span>
                        </button>

                        <FilterPopover open={open} setOpen={setOpen} onApply={()=>submit()} onReset={()=>{
                            setQ('')
                            setVisible('all')
                            setPerPage(25)
                            router.get(BASE, {}, { preserveState:true, replace:true })
                        }}>
                            <FilterRow label="Widoczny">
                                <TriStateRead value={visible} onChange={(v)=>setVisible(v as any)} map={{ all:'all', yes:'1', no:'0' }} />
                            </FilterRow>
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
                            <th className="px-4">Link</th>
                            <th className="px-4">Zdjęcie</th>
                            <th className="w-32 px-4 text-center">Widoczny</th>
                            <th className="w-28 px-4 text-right">Akcje</th>
                        </tr>
                        </thead>
                        <tbody>
                        {partners.data.map(p=>(
                            <tr key={p.id} className="border-t">
                                <td className="px-4">
                                    <div className="h-12 flex items-center">
                                        <Link href={`${BASE}/${p.id}`} className="font-mono text-teal-600">{p.id}</Link>
                                    </div>
                                </td>
                                <td className="px-4">
                                    <div className="h-12 flex items-center">
                                        <a className="text-sky-700 hover:underline" href={p.link} target="_blank" rel="noreferrer">{p.link}</a>
                                    </div>
                                </td>
                                <td className="px-4">
                                    <div className="h-12 flex items-center">
                                        {p.image_url ? <img src={p.image_url} alt="" className="h-8 object-contain"/> : '—'}
                                    </div>
                                </td>
                                <td className="px-4">
                                    <div className="h-12 flex items-center justify-center">
                                        {p.is_visible ? <CheckCircle2 className="h-5 w-5 text-emerald-600"/> : <XCircle className="h-5 w-5 text-rose-600"/>}
                                    </div>
                                </td>
                                <td className="px-4">
                                    <div className="h-12 flex items-center justify-end gap-2">
                                        <Link href={`${BASE}/${p.id}`} className="inline-flex h-8 w-8 items-center justify-center rounded border"><Eye className="h-4 w-4"/></Link>
                                        <Link href={`${BASE}/${p.id}/edit`} className="inline-flex h-8 w-8 items-center justify-center rounded border"><Pencil className="h-4 w-4"/></Link>
                                        <button onClick={()=>destroyRow(p.id)} className="inline-flex h-8 w-8 items-center justify-center rounded border"><Trash2 className="h-4 w-4"/></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {partners.data.length === 0 && (
                            <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500">Brak rekordów</td></tr>
                        )}
                        </tbody>
                    </table>

                    <div className="flex items-center justify-between border-t px-4 py-3 text-sm text-slate-600">
                        <span>{rangeInfo(partners)}</span>
                        <nav className="flex items-center gap-1">
                            {partners.links.map((l,i)=>(
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
