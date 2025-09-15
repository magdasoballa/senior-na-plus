import * as React from "react";
import {
    ChevronsRight,
    MapPin,
    CalendarDays,
    CalendarClock,
    MessageCircle,
} from "lucide-react";
import { Link, useForm } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import ONasBanner from "@/components/onas-banner";

/* ---------- typy ---------- */

export type Offer = {
    id: string;
    title: string;
    description: string;
    duties: string[];
    requirements: string[];
    benefits: string[];
    country?: string;
    city?: string;
    postalCode?: string;
    startDate?: string;
    duration?: string;
    language?: string;
    wage?: string;
    bonus?: string;
    heroImage?: string;
};

type QuickApplyModalProps = {
    open: boolean;
    onClose: () => void;
    offer?: { id?: string; title?: string };
};

type QuickFormData = {
    name: string;
    email: string;
    phone: string;
    consent1: boolean;
    consent2: boolean;
    consent3: boolean;
    offer_id?: string;
    offer_title?: string;
};

/* ---------- strona oferty ---------- */

export default function OfferDetails({ offer }: { offer: Offer }) {
    const {
        title,
        description,
        duties,
        requirements,
        benefits,
        country = "Niemcy",
        city = "Berlin",
        postalCode = "654833 Berlin",
        startDate = "15.03.2025",
        duration = "2 tygodnie",
        language = "niemiecki dobry",
        wage = "2000€",
        bonus = "100€",
    } = offer;

    const [quickOpen, setQuickOpen] = React.useState(false);

    return (
        <AppLayout>
            <section className="mx-auto w-full max-w-2xl px-3 mb-5 bg-[#FDFDFC]">
                <article className="rounded-[1rem] bg-card p-6 md:p-8">
                    <a href="/" className="text-center text-xs tracking-widest text-foreground/60">
                        WSTECZ
                    </a>

                    <h1 className="mt-2 text-center text-[28px] md:text-[34px] leading-snug font-semibold text-foreground/90 font-hand">
                        {title}
                    </h1>

                    {/* SZYBKA APLIKACJA -> otwiera modal */}
                    <div className="mt-3 flex justify-center">
                        <button
                            onClick={() => setQuickOpen(true)}
                            className="rounded-full bg-mint px-6 py-2 text-sm font-extrabold text-foreground ring-1 cursor-pointer ring-black/10 shadow"
                        >
                            SZYBKA APLIKACJA
                        </button>
                    </div>

                    {/* info: lewa / prawa */}
                    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <InfoRow icon={<MapPin className="h-5 w-5" />} text={country} />
                            <InfoRow icon={<MapPin className="h-5 w-5" />} text={city} />
                            <InfoRow icon={<MapPin className="h-5 w-5" />} text={postalCode} />
                        </div>
                        <div className="space-y-2">
                            <InfoRow icon={<CalendarDays className="h-5 w-5" />} text={startDate} />
                            <InfoRow icon={<CalendarClock className="h-5 w-5" />} text={duration} />
                            <InfoRow icon={<MessageCircle className="h-5 w-5" />} text={language} />
                        </div>
                    </div>

                    {/* kafel wynagrodzenia */}
                    <div className="mt-6 rounded-[28px] bg-blush px-6 py-5 flex items-center justify-between overflow-hidden">
                        <div className="flex flex-col justify-center items-center">
                            <div className="text-sm tracking-wider text-foreground/70">STAWKA:</div>
                            <div className="text-3xl font-extrabold">{wage}</div>

                            <div className="mt-3 text-sm tracking-wider text-foreground/70">PREMIA:</div>
                            <div className="text-2xl font-extrabold">{bonus}</div>
                        </div>

                        <ONasBanner className="max-h-[150px]" width="300px" />
                    </div>

                    {/* SEKCJE */}
                    <Section heading="OPIS ZLECENIA">
                        <p className="text-justify leading-relaxed">{description}</p>
                    </Section>

                    <Section heading="OBOWIĄZKI">
                        <BulletList items={duties} />
                    </Section>

                    <Section heading="WYMAGANIA">
                        <BulletList items={requirements} />
                    </Section>

                    <Section heading="OFERUJEMY">
                        <BulletList items={benefits} />
                    </Section>

                    {/* CTA na dole */}
                    <div className="mt-6 flex justify-center">
                        <Link
                            href={`/aplikuj?offer_id=${encodeURIComponent(offer.id)}&offer_title=${encodeURIComponent(offer.title)}`}
                            preserveScroll={false}
                            className="group inline-flex items-center rounded-full bg-mint px-8 py-3 text-base font-extrabold text-foreground ring-1 ring-black/10 shadow-md transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A7C8B6]"
                        >
                            WYŚLIJ FORMULARZ
                        </Link>
                    </div>

                </article>
            </section>

            {/* MODAL: szybka aplikacja */}
            <QuickApplyModal
                open={quickOpen}
                onClose={() => setQuickOpen(false)}
                offer={{ id: offer.id, title: offer.title }}
            />
        </AppLayout>
    );
}

/* ---------- modal ---------- */

function QuickApplyModal({ open, onClose, offer }: QuickApplyModalProps) {
    const { data, setData, post, processing, errors, reset } = useForm<QuickFormData>({
        name: "",
        email: "",
        phone: "",
        consent1: false,
        consent2: false,
        consent3: false,
        offer_id: offer?.id,
        offer_title: offer?.title,
    });

    // Esc + blokada scrolla w tle
    React.useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = prev;
        };
    }, [open, onClose]);

    if (!open) return null;

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/szybka-aplikacja", {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    const acceptAll = () =>
        setData((d) => ({ ...d, consent1: true, consent2: true, consent3: true }));

    return (
        <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px] flex items-start justify-center"
            onClick={(e) => e.target === e.currentTarget && onClose()}
            aria-modal
            role="dialog"
        >
            <form
                onSubmit={submit}
                className="mt-8 sm:mt-16 w-[92%] max-w-md rounded-[2rem] bg-white p-6 sm:p-8 shadow-2xl shadow-black/30 relative"
            >
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Zamknij"
                    className="absolute right-4 top-4 text-2xl leading-none text-foreground/60 hover:text-foreground"
                >
                    ×
                </button>

                <h3 className="text-center text-3xl font-extrabold text-[#2b4a44]">Zgłoś się do nas</h3>
                <p className="mt-1 text-center text-xl text-[#2b4a44]/80">Oddzwonimy</p>

                <div className="mt-6 space-y-5">
                    <FieldUnderline
                        placeholder="imię i nazwisko"
                        value={data.name}
                        onChange={(v) => setData("name", v)}
                        type="text"
                        error={errors.name}
                    />
                    <FieldUnderline
                        placeholder="e-mail"
                        value={data.email}
                        onChange={(v) => setData("email", v)}
                        type="email"
                        error={errors.email}
                    />
                    <FieldUnderline
                        placeholder="numer kontaktowy"
                        value={data.phone}
                        onChange={(v) => setData("phone", v)}
                        type="tel"
                        error={errors.phone}
                    />
                </div>

                <div className="mt-4 space-y-2 text-sm">
                    <ConsentRow
                        checked={data.consent1}
                        onChange={(v) => setData("consent1", v)}
                        label="Wyrażam zgodę na przetwarzanie moich danych..."
                        error={errors.consent1}
                    />
                    <ConsentRow
                        checked={data.consent2}
                        onChange={(v) => setData("consent2", v)}
                        label="Wyrażam zgodę na przetwarzanie moich danych..."
                        error={errors.consent2}
                    />
                    <ConsentRow
                        checked={data.consent3}
                        onChange={(v) => setData("consent3", v)}
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

                <div className="mt-6 flex justify-center">
                    <button
                        type="submit"
                        disabled={processing}
                        className="group inline-flex items-center rounded-full bg-coral px-4 py-1 font-extrabold text-white shadow-md ring-1 ring-black/10 disabled:opacity-60"
                    >
                        {processing ? "Wysyłanie…" : "WYŚLIJ"}
                        <span className="ml-3 grid h-9 w-9 place-items-center rounded-full bg-black/10 ring-1 ring-black/10 transition-transform group-hover:translate-x-0.5">
              <ChevronsRight className="h-5 w-5" />
            </span>
                    </button>
                </div>
            </form>
        </div>
    );
}

/* ---------- helpery ---------- */

function InfoRow({ icon, text }: { icon: React.ReactNode; text: React.ReactNode }) {
    return (
        <div className="flex items-center gap-3 rounded-xl bg-white/50 px-3 py-2">
            <span className="text-coral">{icon}</span>
            <span className="text-[17px] text-foreground">{text}</span>
        </div>
    );
}

function Section({ heading, children }: React.PropsWithChildren<{ heading: string }>) {
    return (
        <section className="mt-6">
            <h2 className="text-center text-foreground font-extrabold tracking-wide uppercase">
                {heading}
            </h2>
            <div className="mt-3">{children}</div>
        </section>
    );
}

function BulletList({ items }: { items: string[] }) {
    return (
        <ul className="list-disc pl-6 marker:text-foreground/70 space-y-1 text-foreground">
            {items?.map((t, i) => (
                <li key={i} className="leading-relaxed">
                    {t}
                </li>
            ))}
        </ul>
    );
}

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
        "mt-1 block w-full bg-transparent pb-2 outline-none border-0 border-b-2 focus:border-coral";
    const border = error ? "border-red-500" : "border-foreground/70";
    return (
        <label className="block">
            <span className="text-[15px] text-muted-foreground">{label}</span>
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
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={`${base} ${border}`}
                    autoFocus={type === "text"}
                />
            )}
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </label>
    );
}

function ConsentRow({
                        checked,
                        onChange,
                        label,
                        error,
                    }: {
    checked: boolean;
    onChange: (v: boolean) => void;
    label: string;
    error?: string;
}) {
    const [open, setOpen] = React.useState(false);

    return (
        <div className="text-sm">
            <label className="flex items-start gap-2 cursor-pointer select-none">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded-full border-2 border-blush"
                    style={{ accentColor: "var(--coral)" }}
                />
                <span className="text-foreground/80">{label}</span>
            </label>

            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="ml-6 text-coral text-sm font-semibold hover:underline"
            >
                {open ? "zwiń" : "rozwiń"}
            </button>

            {open && (
                <p className="mt-1 ml-6 text-xs text-muted-foreground">
                    Tu wstaw treść zgody/klauzuli informacyjnej RODO. Możesz zalinkować do pełnej polityki
                    prywatności lub pokazać dłuższy opis.
                </p>
            )}

            {error && <p className="mt-1 ml-6 text-xs text-red-600">{error}</p>}
        </div>
    );
}
