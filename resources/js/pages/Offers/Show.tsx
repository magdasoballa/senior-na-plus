import * as React from "react";
import { ChevronsRight, ArrowLeft } from "lucide-react";
import { Link, useForm } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import ONasBanner from "@/components/onas-banner";

// Ikony jak w swiperze (custom z /public/icons/*)
import Termin from "../../../../public/icons/termin";
import Jezyk from "../../../../public/icons/jezyk";
import Kalendarz from "../../../../public/icons/kalendarz";
import Podopieczna from "../../../../public/icons/podopieczna";
import Samotna from "../../../../public/icons/samotna";
import Euro from "../../../../public/icons/euro";
import Miasto from "../../../../public/icons/miasto";
import Mobilna from "../../../../public/icons/mobilna";

/* ---------- typy ---------- */

export type Offer = {
    id: string | number;
    title: string;
    description: string;
    duties: string[];
    requirements: string[];
    benefits: string[];
    country?: string;
    city?: string;
    postal_code?: string;
    start_date?: string;
    duration?: string;
    language?: string;
    wage?: string;
    bonus?: string;
    hero_image?: string | null;

    // nowe pola jak w swiperze
    care_recipient_gender?: "female" | "male" | null;
    mobility?: "mobile" | "limited" | "immobile" | null;
    lives_alone?: boolean | "yes" | "no" | null;
};

type QuickApplyModalProps = {
    open: boolean;
    onClose: () => void;
    offer?: { id?: string | number; title?: string }; // <- dopuszczamy number
};

type QuickFormData = {
    name: string;
    email: string;
    phone: string;
    consent1: boolean;
    consent2: boolean;
    consent3: boolean;
    offer_id?: string | number; // <- dopuszczamy number
    offer_title?: string;
};

type ApplicationFormData = {
    // Podstawowe informacje
    name: string;
    email: string;
    phone: string;
    language_level: string;

    // Dodatkowe informacje
    additional_language: string;
    learned_profession: string;
    current_profession: string;

    // Doświadczenie zawodowe
    experience: string;
    first_aid_course: boolean;
    medical_caregiver_course: boolean;
    care_experience: boolean;
    housekeeping_experience: boolean;
    cooking_experience: boolean;
    driving_license: boolean;
    smoker: boolean;

    // Oczekiwania finansowe
    salary_expectations: string;

    // Referencje (plik)
    references: File | null;

    // Zgody
    consent1: boolean;
    consent2: boolean;
    consent3: boolean;

    // ID oferty
    offer_id?: string | number;
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
        country,
        city,
        start_date,
        duration,
        language,
        wage,
        bonus,
        // hero_image, postal_code — jeśli użyjesz, dodaj tu
        care_recipient_gender,
        mobility,
        lives_alone,
    } = offer;

    // WYLICZANE etykiety jak w swiperze:
    const cityLine = [city, country].filter(Boolean).join(", ") || "—";

    const genderLabel =
        care_recipient_gender === "female"
            ? "podopieczna"
            : care_recipient_gender === "male"
                ? "podopieczny"
                : "—";

    const mobilityLabel =
        mobility === "mobile"
            ? "mobilna"
            : mobility === "limited"
                ? "częściowo mobilna"
                : mobility === "immobile"
                    ? "niemobilna"
                    : "—";

    const livingLabel =
        lives_alone === true || lives_alone === "yes"
            ? "samotna"
            : lives_alone === false || lives_alone === "no"
                ? "nie samotna"
                : "—";

    const [quickOpen, setQuickOpen] = React.useState(false);
    const isDarkMode =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;

    return (
        <AppLayout>
            <section className="mx-auto mb-5 w-full max-w-2xl bg-[#FDFDFC] px-3">
                <article className="rounded-[1rem] p-6 md:p-8">
                    <a href="/" className="text-center dark:text-black text-xs ">
                        WSTECZ
                    </a>

                    <h1
                        className={`font-hand mt-2 text-center text-[28px] leading-snug md:text-[34px] ${
                            isDarkMode ? "text-black" : ""
                        }`}
                    >
                        {title}
                    </h1>

                    {/* SZYBKA APLIKACJA -> otwiera modal */}
                    <div className="mt-3 flex justify-center">
                        <button
                            onClick={() => setQuickOpen(true)}
                            className="cursor-pointer rounded-full bg-mint px-6 py-2 text-sm font-extrabold text-black shadow ring-1 ring-black/10"
                        >
                            SZYBKA APLIKACJA
                        </button>
                    </div>

                    {/* info: lewa / prawa (ikonki jak w swiperze) */}
                    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <ul className="space-y-2 sm:space-y-3">
                            <Li icon={Euro}>{wage ?? "—"}</Li>
                            <Li icon={Termin}>{start_date ?? "do ustalenia"}</Li>
                            <Li icon={Miasto}>{cityLine}</Li>
                            <Li icon={Jezyk}>{language ?? "—"}</Li>
                        </ul>
                        <ul className="space-y-2 sm:space-y-3">
                            <Li icon={Kalendarz}>{duration ?? "—"}</Li>
                            <Li icon={Podopieczna}>{genderLabel}</Li>
                            <Li icon={Mobilna}>{mobilityLabel}</Li>
                            <Li icon={Samotna}>{livingLabel}</Li>
                        </ul>
                    </div>

                    {/* kafel wynagrodzenia */}
                    <div className="mt-6 flex items-center justify-between overflow-hidden rounded-[28px] bg-blush px-6 py-5">
                        <div className="flex flex-col items-center justify-center">
                            <div className="text-sm tracking-wider text-black">STAWKA:</div>
                            <div className="text-3xl font-extrabold text-black">
                                {wage ?? "—"}
                            </div>

                            <div className="mt-3 text-sm tracking-wider text-black">
                                PREMIA:
                            </div>
                            <div className="text-2xl font-extrabold text-black">
                                {bonus ?? "—"}
                            </div>
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
                            href={`/aplikacja/${offer.id}`}
                            preserveScroll={false}
                            className="group inline-flex items-center rounded-full bg-mint px-8 py-3 text-base font-extrabold text-black shadow-md ring-1 ring-black/10 transition hover:opacity-95 focus-visible:ring-2 focus-visible:ring-[#A7C8B6] focus-visible:outline-none"
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

/* ---------- Strona formularza aplikacyjnego ---------- */

export function ApplicationForm({ offer }: { offer?: Offer }) {
    const { data, setData, post, processing, errors, reset } =
        useForm<ApplicationFormData>({
            // Podstawowe informacje
            name: "",
            email: "",
            phone: "",
            language_level: "",

            // Dodatkowe informacje
            additional_language: "",
            learned_profession: "",
            current_profession: "",

            // Doświadczenie zawodowe
            experience: "",
            first_aid_course: false,
            medical_caregiver_course: false,
            care_experience: false,
            housekeeping_experience: false,
            cooking_experience: false,
            driving_license: false,
            smoker: false,

            // Oczekiwania finansowe
            salary_expectations: "",

            // Referencje
            references: null,

            // Zgody
            consent1: false,
            consent2: false,
            consent3: false,

            // ID oferty
            offer_id: offer?.id,
            offer_title: offer?.title,
        });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/aplikuj", {
            preserveScroll: true,
            onSuccess: () => {
                reset();
            },
        });
    };

    const acceptAll = () =>
        setData((d) => ({ ...d, consent1: true, consent2: true, consent3: true }));

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setData("references", file);
    };

    return (
        <AppLayout>
            <div className="max-w-2xl mx-auto px-4 py-8">
                {/* Nagłówek z powrotem */}
                <Link
                    href="/"
                    className="inline-flex items-center text-sm text-foreground/60 hover:text-foreground mb-6"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    WSTECZ
                </Link>

                <h1 className="text-3xl font-bold text-center mb-8">
                    WYPEŁNIJ FORMULARZ
                </h1>

                <form onSubmit={submit} className="space-y-8">
                    {/* PODSTAWOWE INFORMACJE */}
                    <Section heading="PODSTAWOWE INFORMACJE">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    IMIĘ I NAZWISKO*
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData("name", e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-mint focus:border-transparent"
                                    required
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">E-MAIL*</label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData("email", e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-mint focus:border-transparent"
                                    required
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    NUMER KONTAKTOWY*
                                </label>
                                <input
                                    type="tel"
                                    value={data.phone}
                                    onChange={(e) => setData("phone", e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-mint focus:border-transparent"
                                    required
                                />
                                {errors.phone && (
                                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    ZNAJOMOŚĆ JĘZYKA*
                                </label>
                                <select
                                    value={data.language_level}
                                    onChange={(e) => setData("language_level", e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-mint focus:border-transparent"
                                    required
                                >
                                    <option value="">Wybierz poziom</option>
                                    <option value="podstawowy">Podstawowy</option>
                                    <option value="średni">Średni</option>
                                    <option value="zaawansowany">Zaawansowany</option>
                                    <option value="biegły">Biegły</option>
                                </select>
                                {errors.language_level && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.language_level}
                                    </p>
                                )}
                            </div>
                        </div>
                    </Section>

                    {/* DODATKOWE INFORMACJE */}
                    <Section heading="DODATKOWE INFORMACJE">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    DODATKOWY JĘZYK
                                </label>
                                <input
                                    type="text"
                                    value={data.additional_language}
                                    onChange={(e) => setData("additional_language", e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-mint focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    ZAWÓD WYUCZONY
                                </label>
                                <input
                                    type="text"
                                    value={data.learned_profession}
                                    onChange={(e) =>
                                        setData("learned_profession", e.target.value)
                                    }
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-mint focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    ZAWÓD WYKONYWANY
                                </label>
                                <input
                                    type="text"
                                    value={data.current_profession}
                                    onChange={(e) =>
                                        setData("current_profession", e.target.value)
                                    }
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-mint focus:border-transparent"
                                />
                            </div>
                        </div>
                    </Section>

                    {/* DOŚWIADCZENIE ZAWODOWE */}
                    <Section heading="DOŚWIADCZENIE ZAWODOWE">
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-semibold mb-3">
                                    DOŚWIADCZENIE JAKO OPIEKUN OSÓB STARSZYCH
                                </h3>
                                <div className="space-y-2">
                                    {["brak", "od 1 roku", "od 1 do 3 lat", "powyżej 3 lat"].map(
                                        (option) => (
                                            <label key={option} className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="experience"
                                                    value={option}
                                                    checked={data.experience === option}
                                                    onChange={(e) => setData("experience", e.target.value)}
                                                    className="mr-2"
                                                />
                                                {option}
                                            </label>
                                        )
                                    )}
                                </div>
                                {errors.experience && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.experience}
                                    </p>
                                )}
                            </div>

                            <div>
                                <h3 className="font-semibold mb-3">DODATKOWE INFORMACJE</h3>
                                <div className="space-y-2">
                                    {[
                                        { key: "first_aid_course", label: "kurs pierwszej pomocy" },
                                        {
                                            key: "medical_caregiver_course",
                                            label: "kurs opiekuna medycznego",
                                        },
                                        {
                                            key: "care_experience",
                                            label: "doświadczenie w wykonywaniu czynności opiekuńczych",
                                        },
                                        {
                                            key: "housekeeping_experience",
                                            label: "doświadczenie w porządkach domowych",
                                        },
                                        {
                                            key: "cooking_experience",
                                            label: "doświadczenie w przygotowywaniu posiłków",
                                        },
                                        { key: "driving_license", label: "prawo jazdy" },
                                        { key: "smoker", label: "osoba paląca" },
                                    ].map((item) => (
                                        <label key={item.key} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={
                                                    data[item.key as keyof ApplicationFormData] as boolean
                                                }
                                                onChange={(e) =>
                                                    setData(item.key as any, e.target.checked)
                                                }
                                                className="mr-2"
                                            />
                                            {item.label}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    OCZEKIWANIA FINANSOWE W EURO
                                </label>
                                <input
                                    type="text"
                                    value={data.salary_expectations}
                                    onChange={(e) =>
                                        setData("salary_expectations", e.target.value)
                                    }
                                    placeholder="np. 2000€"
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-mint focus:border-transparent"
                                />
                                {errors.salary_expectations && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.salary_expectations}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    DODAJ REFERENCJE
                                </label>
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-mint focus:border-transparent"
                                    accept=".pdf,.doc,.docx,image/*"
                                />
                                {errors.references && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.references}
                                    </p>
                                )}
                            </div>
                        </div>
                    </Section>

                    {/* ZGODY */}
                    <Section heading="ZAAKCEPTUJ ZGODY">
                        <div className="space-y-4">
                            <ConsentRow
                                checked={data.consent1}
                                onChange={(v) => setData("consent1", v)}
                                label="Wyrażam zgodę na przetwarzanie moich danych osobowych podanych powyżej przez Senior na Plus sp. z o.o..."
                                error={errors.consent1}
                            />
                            <ConsentRow
                                checked={data.consent2}
                                onChange={(v) => setData("consent2", v)}
                                label="Wyrażam zgodę na przetwarzanie moich danych osobowych podanych powyżej przez Senior na Plus sp. z o.o..."
                                error={errors.consent2}
                            />
                            <ConsentRow
                                checked={data.consent3}
                                onChange={(v) => setData("consent3", v)}
                                label="Wyrażam zgodę na przetwarzanie moich danych osobowych podanych powyżej przez Administratora Danych..."
                                error={errors.consent3}
                            />

                            <button
                                type="button"
                                onClick={acceptAll}
                                className="text-sm font-semibold text-coral hover:underline"
                            >
                                AKCEPTUJ WSZYSTKIE
                            </button>
                        </div>
                    </Section>

                    {/* PRZYCISK WYŚLIJ */}
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            disabled={processing}
                            className="group inline-flex items-center rounded-full bg-mint px-8 py-3 text-base font-extrabold text-foreground ring-1 ring-black/10 shadow-md transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A7C8B6] disabled:opacity-50"
                        >
                            {processing ? "Wysyłanie..." : "WYŚLIJ FORMULARZ"}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

/* ---------- modal ---------- */

function QuickApplyModal({ open, onClose, offer }: QuickApplyModalProps) {
    const { data, setData, post, processing, errors, reset } =
        useForm<QuickFormData>({
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
                className="mt-8 sm:mt-16 w-[92%] max-w-md rounded-[2rem] p-6 sm:p-8  relative"
            >
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Zamknij"
                    className="absolute right-4 top-4 text-2xl leading-none text-foreground/60 hover:text-foreground"
                >
                    ×
                </button>

                <h3 className="text-center text-3xl font-extrabold text-[#2b4a44]">
                    Zgłoś się do nas
                </h3>
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

function Section({
                     heading,
                     children,
                 }: React.PropsWithChildren<{ heading: string }>) {
    return (
        <section className="mt-6 p-6  rounded-lg ">
            <p className="text-center text-black  font-extrabold text-[25px] uppercase mb-4">
                {heading}
            </p>
            <div className="mt-3 text-black">{children}</div>
        </section>
    );
}

function BulletList({ items }: { items: string[] }) {
    return (
        <ul className="list-disc pl-6 space-y-1 text-foreground">
            {items?.map((t, i) => (
                <li key={i} className="leading-relaxed text-black">
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
                    className="mt-1 h-4 w-4 rounded border-2 border-blush"
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
                    Tu wstaw treść zgody/klauzuli informacyjnej RODO. Możesz zalinkować do
                    pełnej polityki prywatności lub pokazać dłuższy opis.
                </p>
            )}

            {error && <p className="mt-1 ml-6 text-xs text-red-600">{error}</p>}
        </div>
    );
}

function Li({
                icon: Icon,
                className = "",
                children,
            }: React.PropsWithChildren<{
    icon: (p: { className?: string }) => JSX.Element;
    className?: string;
}>) {
    return (
        <li
            className={`flex items-center gap-2 sm:gap-3 rounded-lg px-2.5 sm:px-3 py-2 ${className}`}
        >
            <Icon className="h-5 w-5 text-blush" />
            <span className="text-[14px] sm:text-[15px] font-medium">{children}</span>
        </li>
    );
}
