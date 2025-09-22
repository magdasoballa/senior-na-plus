import { Link, router } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import { useState } from 'react'

type Row = { id:number; name:string; icon?:string|null; url:string; visible_pl:boolean; visible_de:boolean }
type Paginator<T> = { data:T[]; links:{url:string|null; label:string; active:boolean}[] }
export default function Index({ records, filters }: { records:Paginator<Row>, filters:{ q?:string } }) {
    const [q,setQ] = useState(filters?.q ?? '')
    const submit = () => router.get('/admin/settings/social-links', q?{q}:{}, { preserveState:true, replace:true })
    return (
        <AppLayout>
            <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Linki społecznościowe</h1>
                    <Link href="/admin/settings/social-links/create" className="rounded-full bg-mint px-4 py-2 font-semibold">Utwórz Link społecznościowy</Link>
                </div>

                <div className="mb-3">
                    <input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==='Enter'&&submit()}
                           placeholder="Szukaj" className="w-80 rounded-full border bg-white px-4 py-2"/>
                </div>

                <div className="overflow-hidden rounded-xl border bg-white">
                    <table className="min-w-full text-sm">
                        <thead className="bg-slate-50">
                        <tr>
                            <th className="px-4 py-3">ID</th>
                            <th className="px-4 py-3">Nazwa</th>
                            <th className="px-4 py-3">Ikona</th>
                            <th className="px-4 py-3">Widoczność PL</th>
                            <th className="px-4 py-3">Widoczność DE</th>
                            <th className="px-4 py-3 text-right">Akcje</th>
                        </tr>
                        </thead>
                        <tbody>
                        {records.data.map(r => (
                            <tr key={r.id} className="border-t">
                                <td className="px-4 py-3">{r.id}</td>
                                <td className="px-4 py-3">{r.name}</td>
                                <td className="px-4 py-3">{r.icon ?? '—'}</td>
                                <td className="px-4 py-3">{r.visible_pl ? '✓' : '✗'}</td>
                                <td className="px-4 py-3">{r.visible_de ? '✓' : '✗'}</td>
                                <td className="px-4 py-3 text-right space-x-2">
                                    <Link href={`/admin/settings/social-links/${r.id}`} className="rounded px-2 py-1 hover:bg-slate-50">Podgląd</Link>
                                    <Link href={`/admin/settings/social-links/${r.id}/edit`} className="rounded px-2 py-1 hover:bg-slate-50">Edytuj</Link>
                                    <Link as="button" method="delete" href={`/admin/settings/social-links/${r.id}`}
                                          className="rounded px-2 py-1 text-rose-600 hover:bg-rose-50">Usuń</Link>
                                </td>
                            </tr>
                        ))}
                        {records.data.length===0 && <tr><td className="px-4 py-8 text-center" colSpan={6}>Brak danych</td></tr>}
                        </tbody>
                    </table>
                </div>

                {/* prosta paginacja */}
                <nav className="mt-3 flex justify-center gap-1">
                    {records.links?.map((l,i)=> l.url
                        ? <Link key={i} href={l.url} preserveScroll className={`rounded px-3 py-1 ${l.active?'bg-slate-200':''}`} dangerouslySetInnerHTML={{__html:l.label}}/>
                        : <span key={i} className="rounded px-3 py-1 opacity-40" dangerouslySetInnerHTML={{__html:l.label}}/>
                    )}
                </nav>
            </div>
        </AppLayout>
    )
}
