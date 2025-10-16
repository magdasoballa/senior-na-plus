import AdminLayout from '@/layouts/admin-layout'
import { Link, useForm, usePage } from '@inertiajs/react'
import * as React from 'react'

type BasicItem = { id:number; name:string }
type SkillItem  = { id:number; name_pl:string; name_de:string; is_visible_pl:boolean; is_visible_de:boolean }
type MobilityItem = { id:number; name_pl:string; name_de:string; is_visible_pl:boolean; is_visible_de:boolean }
type GenderItem = { id:number; name_pl:string; name_de:string; is_visible_pl:boolean; is_visible_de:boolean }
type ExperienceItem = { id:number; name_pl:string; is_visible_pl:boolean; is_visible_de:boolean }
type CareTargetItem = { id:number; name_pl:string; name_de:string; is_visible_pl:boolean; is_visible_de:boolean }

type PageProps = {
    dict: {
        duties: BasicItem[];
        requirements: BasicItem[];
        perks: BasicItem[];
        skills: SkillItem[];
        care_targets: CareTargetItem[];
        mobilities: MobilityItem[];
        experience: ExperienceItem[];
        recruitment_requirements: BasicItem[];
        genders: GenderItem[];
    }
}

const BASE = '/admin/offers'

const labelOf = (it:any) => it?.name ?? it?.name_pl ?? ''

export default function Create(){
    const { dict } = usePage<PageProps>().props

    const form = useForm({
        // podstawowe
        title: '',
        description: '',
        country: '',
        city: '',
        postal_code: '',
        start_date: '',
        duration: '',
        language: '',
        wage: '',
        bonus: '',
        care_recipient_gender: '',
        mobility: '',
        lives_alone: false,
        hero_image: null as File | null,

        // nowe pola
        care_target: '',
        experience_id: null as number|null,
        experiences: '',

        // Array z nazwami (stringami) zamiast ID
        duties: [] as string[],
        requirements: [] as string[],
        perks: [] as string[],
    })

    const submit = (e:React.FormEvent)=>{
        e.preventDefault()
        console.log('Form data before submit:', form.data)
        form.post(`${BASE}`, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => console.log('Success!'),
            onError: (errors) => console.log('Errors:', errors)
        })
    }

    return (
        <AdminLayout>
            <div className="max-w-5xl p-6">
                <Link href="/dashboard" className="text-coral">&larr; Wróć</Link>

                <div className="mb-4 mt-5 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Nowa oferta</h1>
                    <Link href={`${BASE}`} className="rounded-full border px-4 py-2">Anuluj</Link>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    {/* Podstawowe */}
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
                                       placeholder="np. 2025-10-15"
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
                                       placeholder="np. 1900 €"
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

                            <Field label="Zdjęcie">
                                <input type="file" accept="image/*"
                                       onChange={e=>form.setData('hero_image', e.target.files?.[0] ?? null)} />
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

                    {/* Nowe: target / doświadczenia */}
                    <section className="rounded-xl border bg-white p-5">
                        <div className="grid gap-4 md:grid-cols-3">
                            <StringSelect
                                label="Osoba do opieki"
                                items={dict.care_targets}
                                value={form.data.care_target}
                                onChange={(val)=>form.setData('care_target', val)}
                                placeholder="—"
                            />
                            <Err msg={form.errors.care_target} />

                            <SingleSelect
                                label="Doświadczenie"
                                items={dict.experience}
                                value={form.data.experience_id}
                                onChange={(id)=>form.setData('experience_id', id)}
                                placeholder="—"
                            />

                            <Field label="Szczegóły doświadczenia">
                                <input className="w-full rounded border px-3 py-2"
                                       placeholder="np. 2 lata, praca z osobą leżącą"
                                       value={form.data.experiences}
                                       onChange={e=>form.setData('experiences', e.target.value)} />
                                <Err msg={form.errors.experiences} />
                            </Field>
                        </div>
                    </section>

                    {/* Parametry opieki */}
                    <section className="rounded-xl border bg-white p-5">
                        <div className="grid gap-4 md:grid-cols-3">
                            <Field label="Płeć podopiecznego">
                                <select
                                    className="w-full rounded border px-3 py-2"
                                    value={form.data.care_recipient_gender}
                                    onChange={e=>form.setData('care_recipient_gender', e.target.value)}
                                >
                                    <option value="">—</option>
                                    {dict.genders.map(g => (
                                        <option key={g.id} value={g.name_pl}>
                                            {g.name_pl}
                                        </option>
                                    ))}
                                </select>
                                <Err msg={form.errors.care_recipient_gender} />
                            </Field>

                            <Field label="Mobilność">
                                <select
                                    className="w-full rounded border px-3 py-2"
                                    value={form.data.mobility}
                                    onChange={e=>form.setData('mobility', e.target.value)}
                                >
                                    <option value="">—</option>
                                    {dict.mobilities.map((m)=>(
                                        <option key={m.id} value={m.name_pl}>
                                            {m.name_pl}
                                        </option>
                                    ))}
                                </select>
                                <Err msg={form.errors.mobility} />
                            </Field>

                            <Field label="Mieszka sam">
                                <select className="w-full rounded border px-3 py-2"
                                        value={form.data.lives_alone ? '1':'0'}
                                        onChange={e=>form.setData('lives_alone', e.target.value==='1')}>
                                    <option value="0">Nie</option>
                                    <option value="1">Tak</option>
                                </select>
                                <Err msg={form.errors.lives_alone} />
                            </Field>
                        </div>
                    </section>

                    {/* Słowniki: array z nazwami */}
                    <section className="rounded-xl border bg-white p-5">
                        <div className="grid gap-6 md:grid-cols-3">
                            <MultiSelect
                                label="Obowiązki"
                                items={dict.duties}
                                value={form.data.duties}
                                onChange={(names) => form.setData('duties', names)}
                            />

                            <MultiSelect
                                label="Wymagania"
                                items={dict.requirements}
                                value={form.data.requirements}
                                onChange={(names) => form.setData('requirements', names)}
                            />

                            <MultiSelect
                                label="Oferujemy"
                                items={dict.perks}
                                value={form.data.perks}
                                onChange={(names) => form.setData('perks', names)}
                            />
                        </div>
                    </section>

                    {/* Akcje */}
                    <div className="flex items-center justify-end gap-3">
                        <Link href={BASE} className="rounded-full border px-4 py-2">Anuluj</Link>
                        <button type="submit" disabled={form.processing}
                                className="rounded-full bg-coral px-5 py-2 font-semibold text-white">
                            {form.processing ? 'Zapisywanie...' : 'Zapisz'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    )
}

/* ————— helpers ————— */

function Field({label, children, required=false, wide=false}:{label:string; children:React.ReactNode; required?:boolean; wide?:boolean}){
    return (
        <div className={wide ? 'md:col-span-2' : ''}>
            <div className="text-sm font-medium">{label}{required && <span className="text-rose-600"> *</span>}</div>
            <div className="mt-2">{children}</div>
        </div>
    )
}

function Err({msg}:{msg?:string}){ return msg ? <p className="mt-1 text-sm text-rose-600">{msg}</p> : null }

function MultiSelect({
                         label, items, value, onChange, hint
                     }:{
    label: string;
    items: any[];
    value: string[];
    onChange: (names:string[])=>void;
    hint?: string;
}) {
    return (
        <Field label={label}>
            <select
                multiple
                className="w-full rounded border px-3 py-2 min-h-[120px]"
                value={value}
                onChange={e => {
                    const selected = Array.from(e.target.selectedOptions, o => o.text)
                    onChange(selected)
                }}
            >
                {items.map(it => (
                    <option key={it.id} value={labelOf(it)}>
                        {labelOf(it)}
                    </option>
                ))}
            </select>
            <div className="mt-1 text-xs text-gray-500">
                {hint ?? 'Przytrzymaj Ctrl (Cmd na Mac), aby wybrać wiele.'}
            </div>
        </Field>
    )
}

function SingleSelect({
                          label, items, value, onChange, placeholder='—'
                      }:{
    label: string;
    items: any[];
    value: number|null;
    onChange: (id:number|null)=>void;
    placeholder?: string;
}) {
    const v = value===null ? '' : String(value)
    return (
        <Field label={label}>
            <select
                className="w-full rounded border px-3 py-2"
                value={v}
                onChange={e=>{
                    const val = e.target.value
                    onChange(val === '' ? null : parseInt(val))
                }}
            >
                <option value="">{placeholder}</option>
                {items.map(it=>(
                    <option key={it.id} value={it.id}>{labelOf(it)}</option>
                ))}
            </select>
        </Field>
    )
}

function StringSelect({
                          label, items, value, onChange, placeholder='—'
                      }:{
    label: string;
    items: any[];
    value: string;
    onChange: (val:string)=>void;
    placeholder?: string;
}) {
    return (
        <Field label={label}>
            <select
                className="w-full rounded border px-3 py-2"
                value={value ?? ''}
                onChange={e=>onChange(e.target.value)}
            >
                <option value="">{placeholder}</option>
                {items.map(it=>{
                    const lbl = labelOf(it)
                    return <option key={it.id} value={lbl}>{lbl}</option>
                })}
            </select>
        </Field>
    )
}
