import { Link, useForm, usePage } from '@inertiajs/react'
import AdminLayout from '@/layouts/admin-layout'
import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'

type Skill = { id?:number; name_pl?:string; name_de?:string|null; is_visible_pl?:boolean; is_visible_de?:boolean }
type Lang = 'pl'|'de'
const BASE = '/admin/dictionaries/skills'

export default function Form(){
    const { skill, flash } = usePage<{ skill: Skill | null; flash?: { success?: string } }>().props
    const isEdit = !!skill?.id

    const form = useForm({
        name_pl: skill?.name_pl ?? '',
        name_de: skill?.name_de ?? '',
        is_visible_pl: skill?.is_visible_pl ?? true,
        is_visible_de: skill?.is_visible_de ?? false,
        redirectTo: 'index' as 'index'|'continue',
    })

    const [lang,setLang] = useState<Lang>('pl')
    const [saved, setSaved] = useState(false)

    const submit = (e:React.FormEvent)=>{
        e.preventDefault()
        if (isEdit) {
            form.put(`${BASE}/${skill!.id}`, { preserveScroll:true })
        } else {
            form.post(`${BASE}`, { preserveScroll:true })
        }
    }

    // pokaż lokalny komunikat po „kontynuuj edycję”
    const submitAndContinue = ()=>{
        form.transform(d => ({ ...d, redirectTo: 'continue' as const }))
        const resetTransform = () => form.transform(d => d)

        const onSuccess = () => {
            setSaved(true)
            window.setTimeout(()=>setSaved(false), 2500)
        }

        if (isEdit) {
            form.put(`${BASE}/${skill!.id}`, {
                preserveScroll:true,
                onSuccess,
                onFinish: resetTransform,
            })
        } else {
            form.post(`${BASE}`, {
                preserveScroll:true,
                onSuccess,
                onFinish: resetTransform,
            })
        }
    }

    return (
        <AdminLayout>
            <main className="p-6">
                <div className="text-sm text-slate-500">
                    {isEdit ? `Aktualizacja Umiejętność: ${skill!.id}` : 'Nowa Umiejętność'}
                </div>
                <p className="mt-1 text-2xl font-bold">
                    {isEdit ? `Aktualizacja Umiejętność: ${skill!.id}` : 'Utwórz Umiejętność'}
                </p>

                {/* komunikat sukcesu (lokalny albo z flash) */}
                {(saved || flash?.success) && (
                    <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-800">
                        <CheckCircle2 className="h-4 w-4" />
                        {flash?.success ?? 'Zapisano'}
                    </div>
                )}

                <form onSubmit={submit} className="mt-6 overflow-hidden rounded-xl border bg-white">
                    {/* Nazwa z przełącznikiem języka */}
                    <div className="border-b p-6">
                        <div className="mb-2 flex items-center justify-between">
                            <label className="text-sm font-medium">
                                Nazwa <span className="text-rose-600">*</span>
                            </label>
                            <div className="space-x-3 text-sm">
                                <button
                                    type="button"
                                    onClick={()=>setLang('pl')}
                                    className={`${lang==='pl' ? 'text-cyan-600 underline decoration-cyan-400' : 'text-slate-500 hover:underline'} underline-offset-2`}
                                >
                                    Polski
                                </button>
                                <button
                                    type="button"
                                    onClick={()=>setLang('de')}
                                    className={`${lang==='de' ? 'text-cyan-600 underline decoration-cyan-400' : 'text-slate-500 hover:underline'} underline-offset-2`}
                                >
                                    Niemiecki
                                </button>
                            </div>
                        </div>

                        <input
                            className={`mt-2 w-full rounded-lg border bg-white px-3 py-2 ${form.errors.name_pl || form.errors.name_de ? 'border-rose-400' : ''}`}
                            value={lang==='pl' ? form.data.name_pl : form.data.name_de ?? ''}
                            onChange={e => lang==='pl' ? form.setData('name_pl', e.target.value) : form.setData('name_de', e.target.value)}
                            placeholder={lang==='pl' ? 'np. kurs pierwszej pomocy' : 'z. B. Erste-Hilfe-Kurs'}
                        />
                        {lang==='pl' && form.errors.name_pl && <Err msg={form.errors.name_pl} />}
                        {lang==='de' && form.errors.name_de && <Err msg={form.errors.name_de} />}
                    </div>

                    {/* Widoczności */}
                    <div className="grid gap-0 md:grid-cols-2">
                        <div className="border-b p-6 md:border-r">
                            <label className="text-sm font-medium">Widoczność na polskiej stronie</label>
                            <div className="mt-2">
                                <label className="inline-flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={form.data.is_visible_pl}
                                        onChange={e=>form.setData('is_visible_pl', e.target.checked)}
                                    />
                                    {form.data.is_visible_pl ? 'Tak' : 'Nie'}
                                </label>
                            </div>
                        </div>
                        <div className="border-b p-6">
                            <label className="text-sm font-medium">Widoczność na niemieckiej stronie</label>
                            <div className="mt-2">
                                <label className="inline-flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={form.data.is_visible_de}
                                        onChange={e=>form.setData('is_visible_de', e.target.checked)}
                                    />
                                    {form.data.is_visible_de ? 'Tak' : 'Nie'}
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 p-6">
                        <Link href={`${BASE}`} className="rounded-lg border px-4 py-2 hover:bg-slate-50">
                            Anuluj
                        </Link>
                        <button
                            type="button"
                            onClick={submitAndContinue}
                            className="rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-white"
                            disabled={form.processing}
                        >
                            {isEdit ? 'Aktualizuj i Kontynuuj Edycję' : 'Utwórz i Kontynuuj Edycję'}
                        </button>
                        <button
                            type="submit"
                            className="rounded-lg bg-mint px-4 py-2 font-semibold text-white"
                            disabled={form.processing}
                        >
                            {isEdit ? 'Aktualizacja Umiejętność' : 'Utwórz Umiejętność'}
                        </button>
                    </div>
                </form>
            </main>
        </AdminLayout>
    )
}

function Err({msg}:{msg?:string}){ return msg ? <p className="mt-1 text-sm text-rose-600">{msg}</p> : null }
