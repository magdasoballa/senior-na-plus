import * as React from 'react'
import { ChevronsRight } from 'lucide-react'

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
    const [data, setData] = React.useState<FormData>({
        name: '',
        email: '',
        phone: '',
        message: '',
        consent1: false,
        consent2: false,
        consent3: false,
    })

    const set = (patch: Partial<FormData>) => setData((d) => ({ ...d, ...patch }))

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // TODO: wyślij dane – fetch/axios/Inertia
        console.log('form submit', data)
    }

    const acceptAll = () => set({ consent1: true, consent2: true, consent3: true })

    return (
        <section className="mx-auto w-full max-w-lg px-2">
            <form
                onSubmit={onSubmit}
                className="rounded-[2.5rem] bg-card p-6 md:p-8 shadow-2xl shadow-black/30 border"
            >
                <h2 className="text-center text-3xl md:text-4xl font-extrabold tracking-tight">
                    Formularz <span className="text-foreground">kontaktowy</span>
                </h2>

                {/* Pola */}
                <div className="mt-6 space-y-6">
                    <FieldUnderline
                        placeholder="imię i nazwisko"
                        value={data.name}
                        onChange={(v) => set({ name: v })}
                        type="text"
                    />
                    <FieldUnderline
                        placeholder="e-mail"
                        value={data.email}
                        onChange={(v) => set({ email: v })}
                        type="email"
                    />
                    <FieldUnderline
                        placeholder="numer kontaktowy"
                        value={data.phone}
                        onChange={(v) => set({ phone: v })}
                        type="tel"
                    />
                    <FieldUnderline
                        placeholder="wpisz treść wiadomości"

                        value={data.message}
                        onChange={(v) => set({ message: v })}
                        // textarea
                    />
                </div>

                {/* Zgody */}
                <div className="mt-4 space-y-2">
                    <ConsentRow
                        checked={data.consent1}
                        onChange={(v) => set({ consent1: v })}
                        label="Wyrażam zgodę na przetwarzanie moich danych..."
                    />
                    <ConsentRow
                        checked={data.consent2}
                        onChange={(v) => set({ consent2: v })}
                        label="Wyrażam zgodę na przetwarzanie moich danych..."
                    />
                    <ConsentRow
                        checked={data.consent3}
                        onChange={(v) => set({ consent3: v })}
                        label="Wyrażam zgodę na przetwarzanie moich danych..."
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
                        className="group inline-flex items-center rounded-full bg-coral px-4 py-2  font-extrabold text-white shadow-md ring-1 ring-black/10 transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral text-xl"
                    >
                        WYŚLIJ
                        <span className="ml-3 grid h-9 w-9 place-items-center rounded-full bg-black/10 ring-1 ring-black/10 transition-transform group-hover:translate-x-0.5">
              <ChevronsRight className="h-7 w-7" />
            </span>
                    </button>
                </div>
            </form>
        </section>
    )
}

/* -------------------------------- sub-komponenty ------------------------------- */

function FieldUnderline({
                            label,
                            value,
                            onChange,
                            type = 'text',
                            textarea = false,
    placeholder
                        }: {
    label?: string
    value: string
    onChange: (v: string) => void
    type?: React.HTMLInputTypeAttribute
    textarea?: boolean
    placeholder?: string
}) {
    return (
        <label className="block">
            <span className="text-[15px] text-muted-foreground">{label}</span>
            {textarea ? (
                <textarea
                    rows={4}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="mt-1 block w-full resize-y bg-transparent pb-2 outline-none border-0 border-b-2 border-foreground/70 focus:border-coral"
                />
            ) : (
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="mt-1 block w-full bg-transparent pb-2 outline-none border-0 border-b-2 border-foreground/70 focus:border-coral"
                />
            )}
        </label>
    )
}

function ConsentRow({
                        checked,
                        onChange,
                        label,
                    }: {
    checked: boolean
    onChange: (v: boolean) => void
    label: string
}) {
    const [open, setOpen] = React.useState(false)

    return (
        <div className="flex items-start gap-2 text-sm">
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="mt-1 h-4 w-4 rounded-full border-2 border-blush"
                style={{ accentColor: 'var(--coral)' }}
                aria-label={label}
            />

            <div className="flex-1">
                <span className="text-foreground/80">{label}</span>{' '}
                <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    className="text-coral text-sm font-semibold hover:underline"
                >
                    {open ? 'zwiń' : 'rozwiń'}
                </button>

                {open && (
                    <p className="mt-1 text-xs text-muted-foreground">
                        Tu wstaw treść zgody/klauzuli informacyjnej RODO. Możesz zalinkować do pełnej polityki
                        prywatności lub pokazać dłuższy opis.
                    </p>
                )}
            </div>
        </div>
    )
}
