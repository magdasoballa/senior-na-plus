// resources/js/pages/Admin/settings/portal/Form.tsx (i18n; saves both languages to *_pl/*_de)
import { Link, useForm, usePage } from '@inertiajs/react'
import AdminLayout from '@/layouts/admin-layout'
import { useEffect, useMemo, useState } from 'react'

// --- Types ---
type Lang = 'pl' | 'de'

// Backend props: osobne kolumny dla PL i DE
// Upewnij się, że kontroler zwraca te pola w propsach Inertii
// (phone_pl, phone_de, address_pl, address_de, email_pl, email_de)
type Setting = {
    id:number;
    phone_pl:string|null; phone_de:string|null;
    address_pl:string|null; address_de:string|null;
    email_pl:string|null; email_de:string|null;
}

const BASE = '/admin/settings/portal'

type Translated = { pl: string; de: string }
const toTranslated = (pl:string|null|undefined, de:string|null|undefined): Translated => ({ pl: pl ?? '', de: de ?? '' })

// normalizacja białych znaków – NBSP bez \u00A0 w źródle (bezpieczne dla edytora)
const NBSP = String.fromCharCode(160)
const normalizeWs = (s:string)=> (s ?? '').split(NBSP).join(' ').replace(/\s+/g, ' ').trim()

export default function Form(){
    const { setting } = usePage<{ setting: Setting }>().props

    const form = useForm({
        phone:   toTranslated(setting.phone_pl,   setting.phone_de),
        address: toTranslated(setting.address_pl, setting.address_de),
        email:   toTranslated(setting.email_pl,   setting.email_de),
        redirectTo: 'index' as 'index' | 'continue',
    })

    // niezależne przełączniki języka per pole
    const [langPhone, setLangPhone] = useState<Lang>('pl')
    const [langAddress, setLangAddress] = useState<Lang>('pl')
    const [langEmail, setLangEmail] = useState<Lang>('pl')

    useEffect(()=>{
        form.setData({
            phone:   toTranslated(setting.phone_pl,   setting.phone_de),
            address: toTranslated(setting.address_pl, setting.address_de),
            email:   toTranslated(setting.email_pl,   setting.email_de),
            redirectTo: 'index',
        })
        form.clearErrors()
        setLangPhone('pl'); setLangAddress('pl'); setLangEmail('pl')
    }, [setting.id])

    // walidacje klienta (dla aktualnie edytowanych wartości)
    const phoneOk = useMemo(()=> {
        const value = normalizeWs(form.data.phone[langPhone])
        return value === '' || /^[0-9][0-9\s]*$/.test(value)
    }, [form.data.phone, langPhone])

    const emailOk = useMemo(()=> {
        const v = form.data.email[langEmail]
        return !v || /.+@.+\..+/.test(v)
    }, [form.data.email, langEmail])

    const submit = (e:React.FormEvent)=>{
        e.preventDefault()
        form.transform(d=>({
            phone_pl:   normalizeWs(d.phone.pl),   phone_de:   normalizeWs(d.phone.de),
            address_pl: normalizeWs(d.address.pl), address_de: normalizeWs(d.address.de),
            email_pl:   normalizeWs(d.email.pl),   email_de:   normalizeWs(d.email.de),
            redirectTo: d.redirectTo,
        }))
        form.put(`${BASE}/${setting.id}`, { preserveScroll:true })
    }

    const submitAndContinue = ()=>{
        form.setData('redirectTo','continue')
        form.transform(d=>({
            phone_pl:   normalizeWs(d.phone.pl),   phone_de:   normalizeWs(d.phone.de),
            address_pl: normalizeWs(d.address.pl), address_de: normalizeWs(d.address.de),
            email_pl:   normalizeWs(d.email.pl),   email_de:   normalizeWs(d.email.de),
            redirectTo: 'continue',
        }))
        form.put(`${BASE}/${setting.id}?continue=1`, { preserveScroll:true, onSuccess(){ form.setData('redirectTo','index') } })
    }

    return (
        <AdminLayout>
            <main className="p-6">
                <div className="text-sm text-slate-500">Zasoby › Ustawienia portalu › Edycja #{setting.id}</div>
                <h1 className="mt-1 text-2xl font-bold">Aktualizacja Ustawienie portalu: {setting.id}</h1>

                <form onSubmit={submit} className="mt-6 rounded-xl border bg-white p-6">
                    <FieldI18n
                        label="Telefon"
                        hint="Użyj tylko cyfr i spacji między cyframi"
                        required
                        lang={langPhone}
                        onLangChange={setLangPhone}
                        value={form.data.phone}
                        onChange={v=>form.setData('phone', v)}
                        isInvalid={!phoneOk || !!(form.errors as any).phone}
                        error={(form.errors as any).phone as string | undefined}
                        placeholder={{ pl:'32 440 15 54', de:'032 440 15 54' }}
                        inputMode="tel"
                        validate={(v)=>{ const n=normalizeWs(v); return n==='' || /^[0-9][0-9\s]*$/.test(n) }}
                        invalidMsg="Dozwolone tylko cyfry i spacje."
                    />

                    <FieldI18n
                        label="Adres"
                        required
                        lang={langAddress}
                        onLangChange={setLangAddress}
                        value={form.data.address}
                        onChange={v=>form.setData('address', v)}
                        isInvalid={!!(form.errors as any).address}
                        error={(form.errors as any).address as string | undefined}
                        placeholder={{ pl:'Ul. Chorzowska 44c, 44-100 Gliwice', de:'Chorzowska-Straße 44c, 44-100 Gleiwitz' }}
                    />

                    <FieldI18n
                        label="Email"
                        required
                        lang={langEmail}
                        onLangChange={setLangEmail}
                        value={form.data.email}
                        onChange={v=>form.setData('email', v)}
                        isInvalid={!emailOk || !!(form.errors as any).email}
                        error={(form.errors as any).email as string | undefined}
                        placeholder={{ pl:'kontakt@seniornaplus.pl', de:'kontakt@seniornaplus.de' }}
                        type="email"
                        validate={(v)=> !v || /.+@.+\..+/.test(v) }
                        invalidMsg="Wygląda na niepoprawny adres e‑mail."
                    />

                    <div className="mt-8 flex flex-wrap items-center justify-end gap-3">
                        <Link href={`${BASE}`} className="rounded-lg border px-4 py-2 hover:bg-slate-50">Anuluj</Link>
                        <button
                            type="button"
                            onClick={submitAndContinue}
                            className="rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-white hover:brightness-110 disabled:opacity-60"
                            disabled={form.processing}
                        >
                            Aktualizuj i Kontynuuj Edycję
                        </button>
                        <button
                            type="submit"
                            className="rounded-lg bg-mint px-4 py-2 font-semibold text-white hover:brightness-110 disabled:opacity-60"
                            disabled={form.processing}
                        >
                            Aktualizacja Ustawienie portalu
                        </button>
                    </div>
                </form>
            </main>
        </AdminLayout>
    )
}

function FieldI18n({
                       label, hint, required=false,
                       lang, onLangChange,
                       value, onChange,
                       placeholder,
                       inputMode,
                       type='text',
                       isInvalid=false,
                       error,
                       validate,
                       invalidMsg,
                   }:{
    label:string;
    hint?:string;
    required?:boolean;
    lang:Lang;
    onLangChange:(l:Lang)=>void;
    value:Translated;
    onChange:(v:Translated)=>void;
    placeholder?: Partial<Record<Lang,string>>;
    inputMode?: 'tel' | 'numeric' | 'text';
    type?: 'text'|'email';
    isInvalid?: boolean;
    error?: string;
    validate?: (v:string)=>boolean;
    invalidMsg?: string;
}){
    const current = value[lang] ?? ''
    const setCurrent = (val:string)=> onChange({ ...value, [lang]: val })
    const clientInvalid = validate ? !validate(current) : false
    const showInvalid = clientInvalid || !!error || isInvalid

    return (
        <div className="mt-4">
            <div className="flex items-center justify-between">
                <label className="block text-sm font-medium">
                    {label}{required && <span className="text-rose-600"> *</span>}
                </label>
                <div className="space-x-3 text-sm">
                    <button type="button" onClick={()=>onLangChange('pl')} className={`${lang==='pl' ? 'underline decoration-cyan-400 text-cyan-700' : 'text-slate-500 hover:underline'} underline-offset-2`}>Polski</button>
                    <button type="button" onClick={()=>onLangChange('de')} className={`${lang==='de' ? 'underline decoration-cyan-400 text-cyan-700' : 'text-slate-500 hover:underline'} underline-offset-2`}>Niemiecki</button>
                </div>
            </div>

            <input
                type={type}
                className={`mt-2 w-full rounded-lg border bg-white px-3 py-2 ${showInvalid ? 'border-rose-400 focus:outline-rose-500' : ''}`}
                value={current}
                onChange={e=> setCurrent(e.target.value)}
                inputMode={inputMode}
                placeholder={placeholder?.[lang]}
                aria-invalid={showInvalid}
            />

            {showInvalid && (
                <p className="mt-1 text-sm text-rose-600">{error || invalidMsg}</p>
            )}
            {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
        </div>
    )
}

function Err({msg}:{msg?:string}){ return msg ? <p className="mt-1 text-sm text-rose-600">{msg}</p> : null }
