import * as React from 'react'
import { AtSign, ChevronsRight, Phone, ChevronDown, ChevronUp } from 'lucide-react'
import { useForm, usePage } from '@inertiajs/react'
import MapCard from '@/components/mapCard'

type FormData = {
    name: string
    email: string
    phone: string
    subject: string
    message: string
    consent1: boolean
    consent2: boolean
    consent3: boolean
    consent4: boolean
    consent5: boolean
    consent6: boolean
    consent7: boolean
    consent8: boolean
    consent9: boolean
    consent10: boolean
}

export default function ContactFormCard() {
    const { flash } = usePage<{ flash?: { success?: string } }>().props as any
    const [openSections, setOpenSections] = React.useState<number[]>([])

    const { data, setData, post, processing, errors, reset } = useForm<FormData>({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        consent1: false,
        consent2: false,
        consent3: false,
        consent4: false,
        consent5: false,
        consent6: false,
        consent7: false,
        consent8: false,
        consent9: false,
        consent10: false,
    })

    const acceptAll = () => setData(prev => ({
        ...prev,
        consent1: true,
        consent2: true,
        consent3: true,
        consent4: true,
        consent5: true,
        consent6: true,
        consent7: true,
        consent8: true,
        consent9: true,
        consent10: true
    }))

    const toggleSection = (sectionId: number) => {
        setOpenSections(prev =>
            prev.includes(sectionId)
                ? prev.filter(id => id !== sectionId)
                : [...prev, sectionId]
        )
    }

    const isSectionOpen = (sectionId: number) => openSections.includes(sectionId)

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        post('/kontakt', {
            preserveScroll: true,
            onSuccess: () => {
                setData({
                    name: '',
                    email: '',
                    phone: '',
                    subject: '',
                    message: '',
                    consent1: false,
                    consent2: false,
                    consent3: false,
                    consent4: false,
                    consent5: false,
                    consent6: false,
                    consent7: false,
                    consent8: false,
                    consent9: false,
                    consent10: false,
                })
                setOpenSections([])
            },
        })
    }

    const isDarkMode = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;

    return (
        <section className="mx-auto w-full max-w-lg px-2">
            <div className="text-center">
                <h2 className={`text-4xl tracking-tight sm:text-6xl ${isDarkMode ? 'text-white' : ''}`}>Kontakt</h2>
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
                        placeholder="Imię i nazwisko*"
                        value={data.name}
                        onChange={(v) => setData('name', v)}
                        type="text"
                        error={errors.name}
                        required
                    />
                    <FieldUnderline
                        placeholder="E-mail*"
                        value={data.email}
                        onChange={(v) => setData('email', v)}
                        type="email"
                        error={errors.email}
                        required
                    />
                    <FieldUnderline
                        placeholder="Numer telefonu"
                        value={data.phone}
                        onChange={(v) => setData('phone', v)}
                        type="tel"
                        error={errors.phone}
                    />
                    <FieldUnderline
                        placeholder="Temat zapytania*"
                        value={data.subject}
                        onChange={(v) => setData('subject', v)}
                        type="text"
                        error={errors.subject}
                        required
                    />
                    <FieldUnderline
                        placeholder="Wiadomość*"
                        value={data.message}
                        onChange={(v) => setData('message', v)}
                        textarea
                        error={errors.message}
                        required
                    />
                </div>

                {/* Zgody */}
                <div className="mt-8 space-y-4">
                    <button
                        type="button"
                        onClick={acceptAll}
                        className="text-sm font-semibold text-coral hover:underline"
                    >
                        ZAZNACZ WSZYSTKO.
                    </button>

                    <ConsentRow
                        checked={data.consent1}
                        onChange={(v) => setData('consent1', v)}
                        label={
                            <span>
                                Akceptuję{' '}
                                <a href="/terms-of-use" target="_blank" rel="noopener noreferrer" className="text-coral underline hover:no-underline">
                                    Warunki Korzystania
                                </a>{' '}
                                i{' '}
                                <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-coral underline hover:no-underline">
                                    Politykę Prywatności
                                </a>
                                *
                            </span>
                        }
                        error={errors.consent1}
                        required
                    />

                    <ConsentRow
                        checked={data.consent2}
                        onChange={(v) => setData('consent2', v)}
                        label="Wyrażam zgodę na przetwarzanie przez Senior na Plus Pflege sp. z o.o. podanych danych osobowych w celu kontaktu, analizy potrzeb i udzielenia odpowiedzi na zapytanie. Wiem, że zgodę mogę wycofać w dowolnym momencie.*"
                        error={errors.consent2}
                        required
                    />

                    {/* Akordeon - Marketing Senior na Plus */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <button
                            type="button"
                            onClick={() => toggleSection(1)}
                            className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between text-left"
                        >
                            <span className="font-medium text-sm">
                                Marketing Senior na Plus Pflege sp. z o.o.
                            </span>
                            {isSectionOpen(1) ? (
                                <ChevronUp className="h-4 w-4 text-gray-600" />
                            ) : (
                                <ChevronDown className="h-4 w-4 text-gray-600" />
                            )}
                        </button>

                        {isSectionOpen(1) && (
                            <div className="px-4 py-3 space-y-2 bg-white">
                                <ConsentRow
                                    checked={data.consent3}
                                    onChange={(v) => setData('consent3', v)}
                                    label="Wyrażam zgodę na otrzymywanie od Senior na Plus Pflege sp. z o.o. informacji handlowych i innych treści marketingowych (newsletter, oferty, promocje, informacje o nowościach, informacje branżowe itp.):"
                                    error={errors.consent3}
                                />
                                <div className="ml-6 space-y-1">
                                    <ConsentRow
                                        checked={data.consent4}
                                        onChange={(v) => setData('consent4', v)}
                                        label="na mój adres e-mail (w tym również z użyciem systemów do automatycznej wysyłki e-maili),"
                                        error={errors.consent4}
                                        indent={true}
                                    />
                                    <ConsentRow
                                        checked={data.consent5}
                                        onChange={(v) => setData('consent5', v)}
                                        label="na mój numer telefonu w formie SMS/MMS (w tym również z użyciem systemów do automatycznej wysyłki SMS-ów),"
                                        error={errors.consent5}
                                        indent={true}
                                    />
                                    <ConsentRow
                                        checked={data.consent6}
                                        onChange={(v) => setData('consent6', v)}
                                        label="w formie połączeń telefonicznych na mój numer telefonu (w tym również z użyciem systemów do automatycznego nawiązywania połączeń (automatycznych systemów wywołujących))."
                                        error={errors.consent6}
                                        indent={true}
                                    />
                                </div>
                                <p className="ml-6 text-xs text-foreground/70">
                                    W tym celu zgadzam się też na przetwarzanie przez Senior na Plus Pflege sp. z o.o. moich danych osobowych podanych powyżej. Wiem, że każdą zgodę mogę wycofać w dowolnym momencie.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Akordeon - Marketing partnerów handlowych */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <button
                            type="button"
                            onClick={() => toggleSection(2)}
                            className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between text-left"
                        >
                            <span className="font-medium text-sm">
                                Marketing partnerów handlowych
                            </span>
                            {isSectionOpen(2) ? (
                                <ChevronUp className="h-4 w-4 text-gray-600" />
                            ) : (
                                <ChevronDown className="h-4 w-4 text-gray-600" />
                            )}
                        </button>

                        {isSectionOpen(2) && (
                            <div className="px-4 py-3 space-y-2 bg-white">
                                <ConsentRow
                                    checked={data.consent7}
                                    onChange={(v) => setData('consent7', v)}
                                    label={
                                        <span>
                                            Wyrażam zgodę na otrzymywanie od{' '}
                                            <a href="/partnerzy" target="_blank" rel="noopener noreferrer" className="text-coral underline hover:no-underline">
                                                partnerów handlowych
                                            </a>{' '}
                                            i Senior na Plus Pflege sp. z o.o. informacji handlowych i innych treści marketingowych (newsletter, oferty, promocje, informacje o nowościach, informacje branżowe itp.):
                                        </span>
                                    }
                                    error={errors.consent7}
                                />
                                <div className="ml-6 space-y-1">
                                    <ConsentRow
                                        checked={data.consent8}
                                        onChange={(v) => setData('consent8', v)}
                                        label="na mój adres e-mail (w tym również z użyciem systemów do automatycznej wysyłki e-maili),"
                                        error={errors.consent8}
                                        indent={true}
                                    />
                                    <ConsentRow
                                        checked={data.consent9}
                                        onChange={(v) => setData('consent9', v)}
                                        label="na mój numer telefonu w formie SMS/MMS (w tym również z użyciem systemów do automatycznej wysyłki SMS-ów),"
                                        error={errors.consent9}
                                        indent={true}
                                    />
                                    <ConsentRow
                                        checked={data.consent10}
                                        onChange={(v) => setData('consent10', v)}
                                        label="w formie połączeń telefonicznych na mój numer telefonu (w tym również z użyciem systemów do automatycznego nawiązywania połączeń (automatycznych systemów wywołujących))."
                                        error={errors.consent10}
                                        indent={true}
                                    />
                                </div>
                                <p className="ml-6 text-xs text-foreground/70">
                                    W tym celu zgadzam się też na przetwarzanie przez partnerów handlowych i Senior na Plus Pflege sp. z o.o. moich danych osobowych podanych powyżej. Wiem, że każdą zgodę mogę wycofać w dowolnym momencie.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="mt-4 rounded-lg bg-gray-50 p-3 text-xs text-foreground/70">
                        <p>
                            Administratorem podanych danych osobowych jest Senior na Plus Pflege sp. z o.o. z siedzibą w Warszawie (02-662) przy ul. Świeradowskiej 47, zarejestrowana w rejestrze przedsiębiorców Krajowego Rejestru Sądowego prowadzonego przez Sąd Rejonowy dla m.st. Warszawy w Warszawie, XIII Wydział Gospodarczy Krajowego Rejestru Sądowego pod numerem KRS: 0001155432, posiadająca NIP: 5214105615 oraz REGON: 540911002, o kapitale zakładowym 5.000 zł. Pełna treść obowiązku informacyjnego dostępna w{' '}
                            <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-coral underline hover:no-underline">
                                Polityce Prywatności
                            </a>
                            .
                        </p>
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-8 flex justify-center">
                    <button
                        type="submit"
                        disabled={processing}
                        className="group inline-flex items-center rounded-full bg-coral px-6 py-3 font-extrabold text-white shadow-md ring-1 ring-black/10 transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral text-lg disabled:opacity-60"
                    >
                        {processing ? 'Wysyłanie…' : 'WYŚLIJ'}
                        <span className="ml-3 grid h-10 w-10 place-items-center rounded-full bg-black/10 ring-1 ring-black/10 transition-transform group-hover:translate-x-0.5">
                            <ChevronsRight className="h-6 w-6 !text-white" />
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
                            required = false,
                        }: {
    label?: string;
    value: string;
    onChange: (v: string) => void;
    type?: React.HTMLInputTypeAttribute;
    textarea?: boolean;
    placeholder?: string;
    error?: string;
    required?: boolean;
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
                    required={required}
                />
            ) : (
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={`${base} ${border}`}
                    required={required}
                />
            )}

            {error && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>}
        </label>
    );
}

// Zaktualizowany komponent ConsentRow do obsługi JSX w label
function ConsentRow({
                        checked,
                        onChange,
                        label,
                        error,
                        indent = false,
                        required = false
                    }: {
    checked: boolean
    onChange: (v: boolean) => void
    label: string | React.ReactNode
    error?: string
    indent?: boolean
    required?: boolean
}) {
    return (
        <div className={`text-sm ${indent ? 'ml-6' : ''} ${error ? 'rounded-lg bg-red-50 p-3 border border-red-200' : ''}`}>
            <label className={`flex cursor-pointer items-start gap-2 select-none ${error ? 'text-red-800' : 'text-foreground/80'}`}>
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    className={`h-4 w-4 rounded border-2 focus:ring-coral mt-0.5 ${
                        error ? 'border-red-500 text-red-600' : 'border-gray-300 text-coral'
                    }`}
                    required={required}
                />
                <span className={error ? 'text-red-800 font-medium' : (required ? 'font-semibold' : '')}>
                    {label}
                </span>
            </label>
            {error && (
                <p className="mt-1 text-xs text-red-600 font-medium flex items-center gap-1">
                    <span>⚠</span>
                    {error}
                </p>
            )}
        </div>
    )
}
