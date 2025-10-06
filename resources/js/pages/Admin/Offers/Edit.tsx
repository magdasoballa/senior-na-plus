import AdminLayout from '@/layouts/admin-layout'
import { Link, useForm, usePage } from '@inertiajs/react'
import * as React from 'react'

type DictItem = { id:number; name:string }
type Offer = {
    id:number|string
    title:string
    description:string
    country?:string|null
    city?:string|null
    postal_code?:string|null
    start_date?:string|null
    duration?:string|null
    language?:string|null
    wage?:string|null
    bonus?:string|null
    care_recipient_gender?: ''|'female'|'male'
    mobility?: ''|'mobile'|'limited'|'immobile'
    lives_alone?: boolean
    // relacje jako tablice ID
    duties:number[]
    requirements:number[]
    perks:number[]
    hero_image?: string|null
}
type PageProps = { offer: Offer; dict: { duties:DictItem[]; requirements:DictItem[]; perks:DictItem[] } }

const BASE = '/admin/offers'

export default function Edit(){
    const { offer, dict } = usePage<PageProps>().props

    const form = useForm({
        title: offer.title ?? '',
        description: offer.description ?? '',
        country: offer.country ?? '',
        city: offer.city ?? '',
        postal_code: offer.postal_code ?? '',
        start_date: offer.start_date ?? '',
        duration: offer.duration ?? '',
        language: offer.language ?? '',
        wage: offer.wage ?? '',
        bonus: offer.bonus ?? '',
        care_recipient_gender: offer.care_recipient_gender ?? '',
        mobility: offer.mobility ?? '',
        lives_alone: !!offer.lives_alone,
        hero_image: null as File | null,

        duties: [...(offer.duties ?? [])],
        requirements: [...(offer.requirements ?? [])],
        perks: [...(offer.perks ?? [])],
    })

    const submit = (e:React.FormEvent)=>{
        e.preventDefault()
        form.post(`${BASE}/${offer.id}`, { method:'put', forceFormData:true, preserveScroll:true })
    }

    const toggleId = (field:'duties'|'requirements'|'perks', id:number, checked:boolean)=>{
        const set = new Set(form.data[field])
        checked ? set.add(id) : set.delete(id)
        form.setData(field, Array.from(set))
    }

    return (
        <AdminLayout>
            <div className="max-w-5xl p-6">
                <Link href={BASE} className="text-coral">&larr; Wróć</Link>

                <div className="mb-4 mt-5 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Edycja oferty</h1>
                    <Link href={`${BASE}`} className="rounded-full border px-4 py-2">Anuluj</Link>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <section className="rounded-xl border bg-white p-5">
                        <div className="grid gap-4 md:grid-cols-2">
                            <Field label="Tytuł" required>
                                <input className="w-full rounded border px-3 py-2"
                                       value={form.data.title}
                                       onChange={e=>form.setData('title', e.target.value)} />
                                <Err msg={form.errors.title} />
                            </Field>

                            <Field label="Język">
                                <input className="w-full rounded border px-3 py-2"
                                       value={form.data.language ?? ''}
                                       onChange={e=>form.setData('language', e.target.value)} />
                                <Err msg={form.errors.language} />
                            </Field>

                            <Field label="Kraj">
                                <input className="w-full rounded border px-3 py-2"
                                       value={form.data.country ?? ''}
                                       onChange={e=>form.setData('country', e.target.value)} />
                                <Err msg={form.errors.country} />
                            </Field>

                            <Field label="Miasto">
                                <input className="w-full rounded border px-3 py-2"
                                       value={form.data.city ?? ''}
                                       onChange={e=>form.setData('city', e.target.value)} />
                                <Err msg={form.errors.city} />
                            </Field>

                            <Field label="Kod pocztowy">
                                <input className="w-full rounded border px-3 py-2"
                                       value={form.data.postal_code ?? ''}
                                       onChange={e=>form.setData('postal_code', e.target.value)} />
                                <Err msg={form.errors.postal_code} />
                            </Field>

                            <Field label="Data wyjazdu">
                                <input className="w-full rounded border px-3 py-2"
                                       value={form.data.start_date ?? ''}
                                       onChange={e=>form.setData('start_date', e.target.value)} />
                                <Err msg={form.errors.start_date} />
                            </Field>

                            <Field label="Czas trwania">
                                <input className="w-full rounded border px-3 py-2"
                                       value={form.data.duration ?? ''}
                                       onChange={e=>form.setData('duration', e.target.value)} />
                                <Err msg={form.errors.duration} />
                            </Field>

                            <Field label="Stawka">
                                <input className="w-full rounded border px-3 py-2"
                                       value={form.data.wage ?? ''}
                                       onChange={e=>form.setData('wage', e.target.value)} />
                                <Err msg={form.errors.wage} />
                            </Field>

                            <Field label="Premia">
                                <input className="w-full rounded border px-3 py-2"
                                       value={form.data.bonus ?? ''}
                                       onChange={e=>form.setData('bonus', e.target.value)} />
                                <Err msg={form.errors.bonus} />
                            </Field>

                            <Field label="Zdjęcie (hero)">
                                <div className="flex items-center gap-3">
                                    {offer.hero_image && <img src={`/storage/${offer.hero_image}`} alt="" className="h-14 w-14 rounded object-cover" />}
                                    <input type="file" accept="image/*"
                                           onChange={e=>form.setData('hero_image', e.target.files?.[0] ?? null)} />
                                </div>
                                <Err msg={form.errors.hero_image} />
                            </Field>
                        </div>

                        <Field label="Opis" required wide>
              <textarea className="w-full rounded border px-3 py-2 min-h-[140px]"
                        value={form.data.description}
                        onChange={e=>form.setData('description', e.target.value)} />
                            <Err msg={form.errors.description} />
                        </Field>
                    </section>

                    <section className="rounded-xl border bg-white p-5">
                        <div className="grid gap-4 md:grid-cols-3">
                            <Field label="Płeć podopiecznego">
                                <div className="flex gap-3">
                                    <label className="inline-flex items-center gap-2">
                                        <input type="radio" name="gender"
                                               checked={form.data.care_recipient_gender==='female'}
                                               onChange={()=>form.setData('care_recipient_gender','female')} />
                                        kobieta
                                    </label>
                                    <label className="inline-flex items-center gap-2">
                                        <input type="radio" name="gender"
                                               checked={form.data.care_recipient_gender==='male'}
                                               onChange={()=>form.setData('care_recipient_gender','male')} />
                                        mężczyzna
                                    </label>
                                </div>
                                <Err msg={form.errors.care_recipient_gender} />
                            </Field>

                            <Field label="Mobilność">
                                <select className="w-full rounded border px-3 py-2"
                                        value={form.data.mobility}
                                        onChange={e=>form.setData('mobility', e.target.value as any)}>
                                    <option value="">—</option>
                                    <option value="mobile">mobilny</option>
                                    <option value="limited">ograniczona</option>
                                    <option value="immobile">niemobilny</option>
                                </select>
                                <Err msg={form.errors.mobility} />
                            </Field>

                            <Field label="Mieszka sam">
                                <label className="inline-flex items-center gap-2">
                                    <input type="checkbox"
                                           checked={form.data.lives_alone}
                                           onChange={e=>form.setData('lives_alone', e.target.checked)} />
                                    {form.data.lives_alone ? 'Tak' : 'Nie'}
                                </label>
                                <Err msg={form.errors.lives_alone} />
                            </Field>
                        </div>
                    </section>

                    <section className="rounded-xl border bg-white p-5">
                        <h2 className="mb-3 text-lg font-semibold">Obowiązki</h2>
                        <GridChecks list={dict.duties} selected={form.data.duties}
                                    onToggle={(id,checked)=>toggleId('duties',id,checked)} />

                        <h2 className="mt-6 mb-3 text-lg font-semibold">Wymagania</h2>
                        <GridChecks list={dict.requirements} selected={form.data.requirements}
                                    onToggle={(id,checked)=>toggleId('requirements',id,checked)} />

                        <h2 className="mt-6 mb-3 text-lg font-semibold">Oferujemy</h2>
                        <GridChecks list={dict.perks} selected={form.data.perks}
                                    onToggle={(id,checked)=>toggleId('perks',id,checked)} />
                    </section>

                    <div className="flex items-center justify-end gap-3">
                        <Link href={BASE} className="rounded-full border px-4 py-2">Anuluj</Link>
                        <button type="submit" disabled={form.processing}
                                className="rounded-full bg-mint px-5 py-2 font-semibold text-white">
                            Zapisz zmiany
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    )
}

function Field({label, children, required=false, wide=false}:{label:string; children:React.ReactNode; required?:boolean; wide?:boolean}){
    return (
        <div className={wide ? 'md:col-span-2' : ''}>
            <div className="text-sm font-medium">{label}{required && <span className="text-rose-600"> *</span>}</div>
            <div className="mt-2">{children}</div>
        </div>
    )
}
function Err({msg}:{msg?:string}){ return msg ? <p className="mt-1 text-sm text-rose-600">{msg}</p> : null }

function GridChecks({list, selected, onToggle}:{list:{id:number;name:string}[]; selected:number[]; onToggle:(id:number,checked:boolean)=>void}){
    return (
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {list.map(it=>(
                <label key={it.id} className="inline-flex items-center gap-2 rounded border bg-[#F5F5F4] px-3 py-2">
                    <input type="checkbox"
                           checked={selected.includes(it.id)}
                           onChange={e=>onToggle(it.id, e.target.checked)} />
                    <span>{it.name}</span>
                </label>
            ))}
            {list.length===0 && <p className="text-sm text-slate-500">Brak elementów</p>}
        </div>
    )
}
