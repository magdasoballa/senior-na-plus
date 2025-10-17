import AdminLayout from '@/layouts/admin-layout'
import { Link, usePage, router } from '@inertiajs/react'
import * as React from 'react'

type DictItem = { id:number; name?:string; name_pl?:string }

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
    duties:number[]
    requirements:number[]
    perks:number[]
    hero_image?: string|null
    // wymagane przez walidację
    experience_id?: number|null
    experiences?: string|null
    care_target?: string|null
}

type PageProps = {
    offer: Offer;
    dict: {
        duties:DictItem[];
        requirements:DictItem[];
        perks:DictItem[];
        experience:DictItem[];     // <— dodane
        care_targets:DictItem[];   // <— dodane
    }
}

const BASE = '/admin/offers'

export default function Edit(){
    const { offer, dict } = usePage<PageProps>().props

    const [form, setForm] = React.useState({
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

        // NOWE pola – pokazujemy w formularzu
        experience_id: offer.experience_id ?? null,
        experiences: offer.experiences ?? '',
        care_target: offer.care_target ?? '',

        processing: false,
        errors: {} as Record<string,string>,
    })

    const setData = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
        setForm(prev => ({ ...prev, [key]: value }))

    const toggleId = (field:'duties'|'requirements'|'perks', id:number, checked:boolean)=>{
        const set = new Set(form[field] as number[])
        checked ? set.add(id) : set.delete(id)
        setData(field, Array.from(set) as any)
    }

    const getName = (it:DictItem)=> it.name ?? it.name_pl ?? ''
    const namesFrom = (list: DictItem[], selected:number[]) =>
        list.filter(i => selected.includes(i.id)).map(getName)

    const submit = (e:React.FormEvent)=>{
        e.preventDefault()
        setData('processing', true)
        setData('errors', {})

        const dutiesNames       = namesFrom(dict.duties, form.duties)
        const requirementsNames = namesFrom(dict.requirements, form.requirements)
        const perksNames        = namesFrom(dict.perks, form.perks)

        const fd = new FormData()

        // proste stringi
        fd.append('title',        form.title ?? '')
        fd.append('description',  form.description ?? '')
        fd.append('country',      form.country ?? '')
        fd.append('city',         form.city ?? '')
        fd.append('postal_code',  form.postal_code ?? '')
        fd.append('start_date',   form.start_date ?? '')
        fd.append('duration',     form.duration ?? '')
        fd.append('language',     form.language ?? '')
        fd.append('wage',         form.wage ?? '')
        fd.append('bonus',        form.bonus ?? '')

        // wymagane przez walidację
        fd.append('care_recipient_gender', form.care_recipient_gender || '')
        fd.append('mobility',              form.mobility || '')
        fd.append('lives_alone',           form.lives_alone ? '1' : '0')

        // NOWE wymagane pola
        fd.append('experience_id', String(form.experience_id ?? ''))
        fd.append('experiences',   form.experiences ?? '')
        fd.append('care_target',   form.care_target ?? '')

        // tablice jako field[]
        dutiesNames.forEach(v       => fd.append('duties[]', v))
        requirementsNames.forEach(v => fd.append('requirements[]', v))
        perksNames.forEach(v        => fd.append('perks[]', v))

        // plik (opcjonalnie)
        if (form.hero_image) {
            fd.append('hero_image', form.hero_image)
        }

        // spoof PUT
        fd.append('_method', 'PUT')

        router.post(`${BASE}/${offer.id}`, fd, {
            preserveScroll: true,
            forceFormData: true,
            onError: (errors:any)=> setData('errors', errors),
            onFinish: ()=> setData('processing', false),
        })
    }

    return (
        <AdminLayout>
            <div className="max-w-5xl p-6">
                {/* --- Breadcrumbs --- */}
                <div className="text-sm text-slate-500">
                    <Link href={BASE} className="text-sky-700 hover:underline">
                        Oferty
                    </Link>
                    &nbsp;&rsaquo;&nbsp; Edycja oferty: {offer.title}
                </div>

                <div className="mb-4 mt-5 flex items-center justify-between">
                    <p className="text-2xl font-bold">Edycja oferty</p>
                    <Link href={`${BASE}`} className="rounded-full border px-4 py-2">Anuluj</Link>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    {/* Dane ogólne */}
                    <section className="rounded-xl border bg-white p-5">
                        <div className="grid gap-4 md:grid-cols-2">
                            <Field label="Tytuł" required>
                                <input className="w-full rounded border px-3 py-2"
                                       value={form.title}
                                       onChange={e=>setData('title', e.target.value)} />
                                <Err msg={form.errors.title} />
                            </Field>

                            <Field label="Język">
                                <input className="w-full rounded border px-3 py-2"
                                       value={form.language}
                                       onChange={e=>setData('language', e.target.value)} />
                                <Err msg={form.errors.language} />
                            </Field>

                            <Field label="Kraj">
                                <input className="w-full rounded border px-3 py-2"
                                       value={form.country}
                                       onChange={e=>setData('country', e.target.value)} />
                                <Err msg={form.errors.country} />
                            </Field>

                            <Field label="Miasto">
                                <input className="w-full rounded border px-3 py-2"
                                       value={form.city}
                                       onChange={e=>setData('city', e.target.value)} />
                                <Err msg={form.errors.city} />
                            </Field>

                            <Field label="Kod pocztowy">
                                <input className="w-full rounded border px-3 py-2"
                                       value={form.postal_code}
                                       onChange={e=>setData('postal_code', e.target.value)} />
                                <Err msg={form.errors.postal_code} />
                            </Field>

                            <Field label="Data wyjazdu">
                                <input className="w-full rounded border px-3 py-2"
                                       value={form.start_date}
                                       onChange={e=>setData('start_date', e.target.value)} />
                                <Err msg={form.errors.start_date} />
                            </Field>

                            <Field label="Czas trwania">
                                <input className="w-full rounded border px-3 py-2"
                                       value={form.duration}
                                       onChange={e=>setData('duration', e.target.value)} />
                                <Err msg={form.errors.duration} />
                            </Field>

                            <Field label="Stawka">
                                <input className="w-full rounded border px-3 py-2"
                                       value={form.wage}
                                       onChange={e=>setData('wage', e.target.value)} />
                                <Err msg={form.errors.wage} />
                            </Field>

                            <Field label="Premia">
                                <input className="w-full rounded border px-3 py-2"
                                       value={form.bonus}
                                       onChange={e=>setData('bonus', e.target.value)} />
                                <Err msg={form.errors.bonus} />
                            </Field>

                            <Field label="Zdjęcie (hero)">
                                <div className="flex items-center gap-3">
                                    {offer.hero_image && <img src={`/storage/${offer.hero_image}`} alt="" className="h-14 w-14 rounded object-cover" />}
                                    <input type="file" accept="image/*"
                                           onChange={e=>setData('hero_image', e.target.files?.[0] ?? null)} />
                                </div>
                                <Err msg={form.errors.hero_image} />
                            </Field>
                        </div>

                        <Field label="Opis" required wide>
              <textarea className="w-full rounded border px-3 py-2 min-h-[140px]"
                        value={form.description}
                        onChange={e=>setData('description', e.target.value)} />
                            <Err msg={form.errors.description} />
                        </Field>
                    </section>

                    {/* Opieka */}
                    <section className="rounded-xl border bg-white p-5">
                        <div className="grid gap-4 md:grid-cols-3">
                            <Field label="Płeć podopiecznego">
                                <div className="flex gap-3">
                                    <label className="inline-flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="care_recipient_gender"
                                            checked={form.care_recipient_gender==='female'}
                                            onChange={()=>setData('care_recipient_gender','female')}
                                        />
                                        kobieta
                                    </label>
                                    <label className="inline-flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="care_recipient_gender"
                                            checked={form.care_recipient_gender==='male'}
                                            onChange={()=>setData('care_recipient_gender','male')}
                                        />
                                        mężczyzna
                                    </label>
                                </div>
                                <Err msg={form.errors.care_recipient_gender} />
                            </Field>

                            <Field label="Mobilność">
                                <select className="w-full rounded border px-3 py-2"
                                        value={form.mobility}
                                        onChange={e=>setData('mobility', e.target.value as any)}>
                                    <option value="" disabled>— wybierz —</option>
                                    <option value="mobile">mobilny</option>
                                    <option value="limited">ograniczona</option>
                                    <option value="immobile">niemobilny</option>
                                </select>
                                <Err msg={form.errors.mobility} />
                            </Field>

                            <Field label="Mieszka sam">
                                <label className="inline-flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={form.lives_alone}
                                        onChange={e=>setData('lives_alone', e.target.checked)}
                                    />
                                    {form.lives_alone ? 'Tak' : 'Nie'}
                                </label>
                                <Err msg={form.errors.lives_alone} />
                            </Field>
                        </div>
                    </section>

                    {/* NOWE: Doświadczenie i cel opieki */}
                    <section className="rounded-xl border bg-white p-5">
                        <div className="grid gap-4 md:grid-cols-3">
                            <Field label="Poziom doświadczenia (experience)">
                                <select
                                    className="w-full rounded border px-3 py-2"
                                    value={form.experience_id ?? ''}
                                    onChange={e=>setData('experience_id', e.target.value ? Number(e.target.value) : null)}
                                >
                                    <option value="">— wybierz —</option>
                                    {dict.experience.map(it=>(
                                        <option key={it.id} value={it.id}>{getName(it)}</option>
                                    ))}
                                </select>
                                <Err msg={form.errors.experience_id} />
                            </Field>

                            <Field label="Doświadczenia (opis)">
                                <input
                                    className="w-full rounded border px-3 py-2"
                                    value={form.experiences}
                                    onChange={e=>setData('experiences', e.target.value)}
                                />
                                <Err msg={form.errors.experiences} />
                            </Field>

                            <Field label="Cel opieki (care target)">
                                <select
                                    className="w-full rounded border px-3 py-2"
                                    value={form.care_target ?? ''}
                                    onChange={e=>setData('care_target', e.target.value)}
                                >
                                    <option value="">— wybierz —</option>
                                    {dict.care_targets.map(it=>(
                                        <option key={it.id} value={getName(it)}>{getName(it)}</option>
                                    ))}
                                </select>
                                <Err msg={form.errors.care_target} />
                            </Field>
                        </div>
                    </section>

                    {/* Słowniki */}
                    <section className="rounded-xl border bg-white p-5">
                        <h2 className="mb-3 text-lg font-semibold">Obowiązki</h2>
                        <GridChecks list={dict.duties} selected={form.duties}
                                    onToggle={(id,checked)=>toggleId('duties',id,checked)} />

                        <h2 className="mt-6 mb-3 text-lg font-semibold">Wymagania</h2>
                        <GridChecks list={dict.requirements} selected={form.requirements}
                                    onToggle={(id,checked)=>toggleId('requirements',id,checked)} />

                        <h2 className="mt-6 mb-3 text-lg font-semibold">Oferujemy</h2>
                        <GridChecks list={dict.perks} selected={form.perks}
                                    onToggle={(id,checked)=>toggleId('perks',id,checked)} />
                    </section>

                    <div className="flex items-center justify-end gap-3">
                        <Link href={BASE} className="rounded-full border px-4 py-2">Anuluj</Link>
                        <button type="submit" disabled={form.processing}
                                className="rounded-full bg-mint px-5 py-2 font-semibold text-white">
                            {form.processing ? 'Zapisywanie...' : 'Zapisz zmiany'}
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

function GridChecks({list, selected, onToggle}:{list:DictItem[]; selected:number[]; onToggle:(id:number,checked:boolean)=>void}){
    const label = (it:DictItem)=> it.name ?? it.name_pl ?? ''
    return (
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {list.map(it=>(
                <label key={it.id} className="inline-flex items-center gap-2 rounded border bg-[#F5F5F4] px-3 py-2">
                    <input
                        type="checkbox"
                        checked={selected.includes(it.id)}
                        onChange={e=>onToggle(it.id, e.target.checked)} />
                    <span>{label(it)}</span>
                </label>
            ))}
            {list.length===0 && <p className="text-sm text-slate-500">Brak elementów</p>}
        </div>
    )
}
