import * as React from 'react'
import { AtSign, ChevronsRight, Phone } from 'lucide-react'
import { useForm, usePage } from '@inertiajs/react'
import MapCard from '@/components/mapCard'

type FormData = {
    name: string
    email: string
    phone: string
    message: string
    consent1: boolean
    consent2: boolean
    consent3: boolean
}

export default function ContactFormCard() {
    const { flash } = usePage<{ flash?: { success?: string } }>().props as any

    const { data, setData, post, processing, errors, reset } = useForm<FormData>({
        name: '',
        email: '',
        phone: '',
        message: '',
        consent1: false,
        consent2: false,
        consent3: false,
    })

    const acceptAll = () => setData(prev => ({ ...prev, consent1: true, consent2: true, consent3: true }))


    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        post('/kontakt', {
            preserveScroll: true,
            onSuccess: () => {
                reset()
            },
        })
    }
    const isDarkMode = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;

    return (
        <section className="mx-auto w-full max-w-lg px-2">
            <div className="text-center">
                <h2 className={`text-4xl  tracking-tight  sm:text-6xl ${isDarkMode ? 'text-white' : ''}`}>Kontakt</h2>
            </div>
            <form
                onSubmit={onSubmit}
                className="rounded-[2.5rem] bg-card p-6 md:p-8 shadow-2xl shadow-black/30 border mt-5"
            >
                <p className={`text-center text-3xl md:text-4xl font-semibold ${isDarkMode ? 'text-white' : 'text-black'}`}>
                    Formularz <br/> <span className="">kontaktowy</span>
                </p>

                {/* komunikat sukcesu */}
                {flash?.success && (
                    <p className="mt-4 rounded-md bg-emerald-50 text-emerald-700 px-3 py-2 text-sm">
                        {flash.success}
                    </p>
                )}

                {/* Pola */}
                <div className="mt-6 space-y-6">
                    <FieldUnderline
                        placeholder="imię i nazwisko"
                        value={data.name}
                        onChange={(v) => setData('name', v)}
                        type="text"
                        error={errors.name}
                    />
                    <FieldUnderline
                        placeholder="e-mail"
                        value={data.email}
                        onChange={(v) => setData('email', v)}
                        type="email"
                        error={errors.email}
                    />
                    <FieldUnderline
                        placeholder="numer kontaktowy"
                        value={data.phone}
                        onChange={(v) => setData('phone', v)}
                        type="tel"
                        error={errors.phone}
                    />
                    <FieldUnderline
                        placeholder="wpisz treść wiadomości"
                        value={data.message}
                        onChange={(v) => setData('message', v)}
                        textarea
                        error={errors.message}
                    />
                </div>

                {/* Zgody */}
                <div className="mt-4 space-y-2">
                    <ConsentRow
                        checked={data.consent1}
                        onChange={(v) => setData('consent1', v)}
                        label="Wyrażam zgodę na przetwarzanie moich danych..."
                        error={errors.consent1}
                    />
                    <ConsentRow
                        checked={data.consent2}
                        onChange={(v) => setData('consent2', v)}
                        label="Wyrażam zgodę na przetwarzanie moich danych..."
                        error={errors.consent2}
                    />
                    <ConsentRow
                        checked={data.consent3}
                        onChange={(v) => setData('consent3', v)}
                        label="Wyrażam zgodę na przetwarzanie moich danych..."
                        error={errors.consent3}
                    />

                    <button
                        type="button"
                        onClick={acceptAll}
                        className="mt-1 text-xs font-extrabold tracking-wide text-coral hover:underline"
                    >
                        AKCEPTUJ WSZYSTKIE
                    </button>
                </div>

                {/* CTA */}
                <div className="mt-6 flex justify-center">
                    <button
                        type="submit"
                        disabled={processing}
                        className="group inline-flex items-center rounded-full bg-coral px-4 py-2 font-extrabold text-white shadow-md ring-1 ring-black/10 transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral text-xl disabled:opacity-60"
                    >
                        {processing ? 'Wysyłanie…' : 'WYŚLIJ'}
                        <span className="ml-3 grid h-9 w-9 place-items-center rounded-full bg-black/10 ring-1 ring-black/10 transition-transform group-hover:translate-x-0.5">
              <ChevronsRight className="h-7 w-7 !text-white" />
            </span>
                    </button>
                </div>
            </form>

            <div className="mt-20">
                {/* kafelki kontaktowe */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 auto-rows-fr">
                    {/* E-MAIL */}
                    <a
                        href="mailto:kontakt@seniornaplus.pl"
                        className="group flex h-full flex-col items-center justify-center gap-2
               rounded-[28px] bg-sea text-white ring-1 ring-black/10 shadow-sm
               p-6 md:p-8 text-center transition hover:brightness-105
               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                    >
                        <AtSign className="h-12 w-12 opacity-95" aria-hidden />
                        <div className="mt-1 font-semibold tracking-wide text-xl">E-MAIL</div>
                        <div className="underline underline-offset-4 group-hover:opacity-90 text-xl">
                            kontakt@seniornaplus.pl
                        </div>
                    </a>

                    {/* TELEFON */}
                    <a
                        href="tel:324401554"
                        className="group flex h-full flex-col items-center justify-center gap-2
               rounded-[28px] bg-sea text-white ring-1 ring-black/10 shadow-sm
               p-6 md:p-8 text-center transition hover:brightness-105
               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                    >
                        <Phone className="h-12 w-12 opacity-95" aria-hidden />
                        <div className="mt-1 font-semibold tracking-wide text-xl">TELEFON</div>
                        <div className="underline underline-offset-4 group-hover:opacity-90 text-xl">
                            32 440 15 54
                        </div>
                    </a>
                </div>


                <div className="mt-20">
                    <MapCard address="Senior na Plus, Gliwice" />
                </div>
            </div>
        </section>
    )
}

/* -------------------------------- sub-komponenty ------------------------------- */

function FieldUnderline({
                            label,
                            value,
                            onChange,
                            type = "text",
                            textarea = false,
                            placeholder,
                            error,
                        }: {
    label?: string;
    value: string;
    onChange: (v: string) => void;
    type?: React.HTMLInputTypeAttribute;
    textarea?: boolean;
    placeholder?: string;
    error?: string;
}) {
    const base =
        "mt-1 block w-full bg-transparent pb-2 outline-none border-0 border-b-2 " +
        "transition-colors duration-200 text-foreground caret-foreground " +
        "placeholder:text-muted-foreground/70 dark:placeholder:text-muted-foreground/60 " +
        "focus:outline-none";

    const border = error
        ? // błąd – czerwone w obu trybach
        "border-red-500 dark:border-red-400 focus:border-red-500 dark:focus:border-red-400"
        : // normalnie – delikatna linia, jaśniejsza w dark
        "border-foreground/40 hover:border-foreground/60 focus:border-coral " +
        "dark:border-white/30 dark:hover:border-white/50 dark:focus:border-coral";

    return (
        <label className="block">
            {label && (
                <span className="text-[15px] text-muted-foreground">{label}</span>
            )}

            {textarea ? (
                <textarea
                    rows={4}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={`${base} ${border}`}
                />
            ) : (
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={`${base} ${border}`}
                />
            )}

            {error && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>}
        </label>
    );
}


function ConsentRow({
                        checked,
                        onChange,
                        label,
                        error,
                    }: {
    checked: boolean
    onChange: (v: boolean) => void
    label: string
    error?: string
}) {
    const [open, setOpen] = React.useState(false)

    return (
        <div className="text-sm">
            {/* klik w label (w tym tekst) zaznacza checkbox, bo input jest w środku */}
            <label className="flex items-start gap-2 cursor-pointer select-none">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded-full border-2 border-blush"
                    style={{ accentColor: 'var(--coral)' }}
                />
                <span className="text-foreground/80">{label}</span>
            </label>

            {/* przycisk poza <label>, więc nie zmienia checkboxa */}
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="ml-6 text-coral text-sm font-semibold hover:underline"
            >
                {open ? 'zwiń' : 'rozwiń'}
            </button>

            {open && (
                <p className="mt-1 ml-6 text-xs text-muted-foreground">
                   tresc zgody
                </p>
            )}

            {error && <p className="mt-1 ml-6 text-xs text-red-600">{error}</p>}
        </div>
    )
}
