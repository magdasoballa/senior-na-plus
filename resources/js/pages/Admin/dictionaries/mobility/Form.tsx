import { Link, useForm, usePage } from '@inertiajs/react'
import AdminLayout from '@/layouts/admin-layout'
import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'

type Row = { id?:number; name_pl?:string; name_de?:string|null; is_visible_pl?:boolean; is_visible_de?:boolean }
type Lang = 'pl'|'de'
const BASE = '/admin/dictionaries/mobility'

export default function Form(){
    const { row, flash } = usePage<{ row: Row | null; flash?: { success?: string } }>().props
    const isEdit = !!row?.id

    const form = useForm({
        name_pl: row?.name_pl ?? '',
        name_de: row?.name_de ?? '',
        is_visible_pl: row?.is_visible_pl ?? false,
        is_visible_de: row?.is_visible_de ?? false,
        redirectTo: 'index' as 'index'|'continue',
    })

    const [lang,setLang] = useState<Lang>('pl')
    const [saved, setSaved] = useState(false)

    const submit = (e:React.FormEvent)=>{
        e.preventDefault()
        if (isEdit) form.put(`${BASE}/${row!.id}`, { preserveScroll:true })
        else        form.post(`${BASE}`, { preserveScroll:true })
    }

    const submitAndContinue = ()=>{
        // 3 sygnały „zostań”: redirectTo, stay i query ?continue=1
        form.setData('redirectTo','continue')
        form.transform(d => ({ ...d, stay: true }))

        if (isEdit) {
            form.put(`${BASE}/${row!.id}?continue=1`, {
                preserveScroll:true,
                onSuccess:()=> {
                    form.setData('redirectTo','index')
                    setSaved(true); window.setTimeout(()=>setSaved(false), 2500)
                },
                onFinish:()=> form.transform(d=>d),
            })
        } else {
            form.post(`${BASE}?continue=1`, {
                preserveScroll:true,
                onSuccess:()=> {
                    form.setData('redirectTo','index')
                    setSaved(true); window.setTimeout(()=>setSaved(false), 2500)
                },
                onFinish:()=> form.transform(d=>d),
            })
        }
    }

    return (
        <AdminLayout>
            <main className="p-6">
                 <div className="text-sm text-slate-500">
               <Link href={BASE} >Mobilność podopiecznych</Link>
                  &nbsp;&rsaquo;&nbsp; {isEdit ? `Aktualizacja: ${row!.name_pl}` : 'Utwórz'}
                 </div>
                <p className="mt-1 text-2xl font-bold">
                    {isEdit ? `Aktualizacja Mobilność podopiecznego: ${row!.name_pl}` : 'Utwórz Mobilność podopiecznego'}
                </p>

                {(saved || flash?.success) && (
                    <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-800">
                        <CheckCircle2 className="h-4 w-4" />
                        {flash?.success ?? 'Zapisano'}
                    </div>
                )}

                <form onSubmit={submit} className="mt-6 overflow-hidden rounded-xl border bg-white">
                    {/* Nazwa + przełącznik PL/DE */}
                    <div className="border-b p-6">
                        <div className="mb-2 flex items-center justify-between">
                            <label className="text-sm font-medium">Nazwa <span className="text-rose-600">*</span></label>
                            <div className="space-x-3 text-sm">
                                <button type="button" onClick={()=>setLang('pl')}
                                        className={`${lang==='pl' ? 'text-cyan-600 underline decoration-cyan-400' : 'text-slate-500 hover:underline'} underline-offset-2`}>
                                    Polski
                                </button>
                                <button type="button" onClick={()=>setLang('de')}
                                        className={`${lang==='de' ? 'text-cyan-600 underline decoration-cyan-400' : 'text-slate-500 hover:underline'} underline-offset-2`}>
                                    Niemiecki
                                </button>
                            </div>
                        </div>

                        <input
                            className={`mt-2 w-full rounded-lg border bg-white px-3 py-2 ${form.errors.name_pl || form.errors.name_de ? 'border-rose-400' : ''}`}
                            value={lang==='pl' ? form.data.name_pl : form.data.name_de}
                            onChange={e => lang==='pl' ? form.setData('name_pl', e.target.value) : form.setData('name_de', e.target.value)}
                            placeholder={lang==='pl' ? 'np. w pełni mobilny' : 'z. B. voll mobil'}
                        />
                        {lang==='pl' && form.errors.name_pl && <Err msg={form.errors.name_pl} />}
                        {lang==='de' && form.errors.name_de && <Err msg={form.errors.name_de} />}
                    </div>

                    {/* Widoczności */}
                    <div className="grid gap-0 md:grid-cols-2">
                        <div className="border-b md:border-r p-6">
                            <label className="text-sm font-medium">Widoczność na polskiej stronie</label>
                            <div className="mt-2">
                                <label className="inline-flex items-center gap-2 text-sm">
                                    <input type="checkbox" checked={form.data.is_visible_pl}
                                           onChange={e=>form.setData('is_visible_pl', e.target.checked)} />
                                    {form.data.is_visible_pl ? 'Tak' : 'Nie'}
                                </label>
                            </div>
                        </div>
                        <div className="border-b p-6">
                            <label className="text-sm font-medium">Widoczność na niemieckiej stronie</label>
                            <div className="mt-2">
                                <label className="inline-flex items-center gap-2 text-sm">
                                    <input type="checkbox" checked={form.data.is_visible_de}
                                           onChange={e=>form.setData('is_visible_de', e.target.checked)} />
                                    {form.data.is_visible_de ? 'Tak' : 'Nie'}
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 p-6">
                        <Link href={`${BASE}`} className="rounded-lg border px-4 py-2 hover:bg-slate-50">Anuluj</Link>
                        <button type="button" onClick={submitAndContinue}
                                className="rounded-lg bg-mint px-4 py-2 font-semibold cursor-pointer" disabled={form.processing}>
                            {isEdit ? 'Aktualizuj i Kontynuuj Edycję' : 'Utwórz i Dodaj Kolejną'}
                        </button>
                        <button type="submit" className="rounded-lg bg-mint px-4 py-2 font-semibold cursor-pointer" disabled={form.processing}>
                            {isEdit ? 'Aktualizacja Mobilność podopiecznego' : 'Utwórz Mobilność podopiecznego'}
                        </button>
                    </div>
                </form>
            </main>
        </AdminLayout>
    )
}

function Err({msg}:{msg?:string}){ return msg ? <p className="mt-1 text-sm text-rose-600">{msg}</p> : null }
