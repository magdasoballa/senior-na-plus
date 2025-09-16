import * as React from "react";
import { Link, useForm, usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { ArrowLeft, ChevronsRight } from "lucide-react";

type ApplicationFormData = {
    name: string;
    email: string;
    phone: string;
    language_level: string;
    additional_language: string;
    learned_profession: string;
    current_profession: string;
    experience: string;
    first_aid_course: boolean;
    medical_caregiver_course: boolean;
    care_experience: boolean;
    housekeeping_experience: boolean;
    cooking_experience: boolean;
    driving_license: boolean;
    smoker: boolean;
    salary_expectations: string;
    references: File | null;
    consent1: boolean;
    consent2: boolean;
    consent3: boolean;
    offer_id?: string;
    offer_title?: string;
};

export default function ApplicationPage() {
    const { offer } = usePage().props as any;

    const { data, setData, post, processing, errors, reset } =
        useForm<ApplicationFormData>({
            name: "",
            email: "",
            phone: "",
            language_level: "",
            additional_language: "",
            learned_profession: "",
            current_profession: "",
            experience: "",
            first_aid_course: false,
            medical_caregiver_course: false,
            care_experience: false,
            housekeeping_experience: false,
            cooking_experience: false,
            driving_license: false,
            smoker: false,
            salary_expectations: "",
            references: null,
            consent1: false,
            consent2: false,
            consent3: false,
            offer_id: offer?.id,
            offer_title: offer?.title,
        });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/aplikuj", {
            preserveScroll: true,
            onSuccess: () => reset(),
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
            <div className="mx-auto max-w-2xl px-4 pt-4 pb-12 bg-[#FDFDFC]">
                {/* powrót */}
                <Link
                    href="/"
                    className="inline-flex items-center text-sm text-foreground/60 hover:text-foreground"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    WSTECZ
                </Link>

                {/* tytuł */}
                <h1 className="mt-2 text-center text-[40px] leading-tight font-extrabold tracking-[0.02em] text-[#2b4a44]">
                    WYPEŁNIJ FORMULARZ
                </h1>

                <form onSubmit={submit} className="mt-6 space-y-8">
                    {/* PODSTAWOWE INFORMACJE */}
                    <Section title="PODSTAWOWE INFORMACJE">
                        <div className="space-y-4">
                            <Field >
                                <InputPill
                                    value={data.name}
                                    onChange={(v) => setData("name", v)}
                                    placeholder="IMIĘ I NAZWISKO"
                                />
                                <ErrorText msg={errors.name} />
                            </Field>

                            <Field label="E-MAIL*">
                                <InputPill
                                    type="email"
                                    value={data.email}
                                    onChange={(v) => setData("email", v)}
                                    placeholder="E-MAIL"
                                />
                                <ErrorText msg={errors.email} />
                            </Field>

                            <Field label="NUMER KONTAKTOWY*">
                                <InputPill
                                    type="tel"
                                    value={data.phone}
                                    onChange={(v) => setData("phone", v)}
                                    placeholder="NUMER KONTAKTOWY"
                                />
                                <ErrorText msg={errors.phone} />
                            </Field>

                            <Field label="ZNAJOMOŚĆ JĘZYKA*">
                                <InputPill
                                    type="tel"
                                    value={data.language_level}
                                    onChange={(v) => setData("language_level", v)}
                                    placeholder="ZNAJOMOŚĆ JĘZYKA"
                                />
                                <ErrorText msg={errors.language_level} />
                            </Field>
                        </div>
                    </Section>

                    {/* DODATKOWE INFORMACJE */}
                    <Section title="DODATKOWE INFORMACJE">
                        <div className="space-y-4">
                            <Field label="DODATKOWY JĘZYK">
                                <InputPill
                                    value={data.additional_language}
                                    onChange={(v) => setData("additional_language", v)}
                                    placeholder="DODATKOWY JĘZYK"
                                />
                            </Field>

                            <Field label="ZAWÓD WYUCZONY">
                                <InputPill
                                    value={data.learned_profession}
                                    onChange={(v) => setData("learned_profession", v)}
                                    placeholder="ZAWÓD WYUCZONY"
                                />
                            </Field>

                            <Field label="ZAWÓD WYKONYWANY">
                                <InputPill
                                    value={data.current_profession}
                                    onChange={(v) => setData("current_profession", v)}
                                    placeholder="ZAWÓD WYKONYWANY"
                                />
                            </Field>
                        </div>
                    </Section>

                    {/* DOŚWIADCZENIE ZAWODOWE */}
                    <Section title="DOŚWIADCZENIE ZAWODOWE">
                        <div className="space-y-6">
                            <div>
                                <h3 className="mb-2 font-semibold tracking-wide text-foreground">
                                    DOŚWIADCZENIE JAKO OPIEKUN OSÓB STARSZYCH
                                </h3>
                                <div className="space-y-2">
                                    {["brak", "od 1 roku", "od 1 do 3 lat", "powyżej 3 lat"].map(
                                        (option) => (
                                            <label key={option} className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="experience"
                                                    value={option}
                                                    checked={data.experience === option}
                                                    onChange={(e) =>
                                                        setData("experience", e.currentTarget.value)
                                                    }
                                                    className="h-4 w-4 accent-[var(--coral)]"
                                                />
                                                <span className="text-foreground/90">{option}</span>
                                            </label>
                                        )
                                    )}
                                </div>
                                <ErrorText msg={errors.experience} />
                            </div>

                            <div>
                                <h3 className="mb-2 font-semibold tracking-wide text-foreground">
                                    DODATKOWE INFORMACJE
                                </h3>
                                <div className="space-y-2">
                                    {[
                                        { key: "first_aid_course", label: "kurs pierwszej pomocy" },
                                        {
                                            key: "medical_caregiver_course",
                                            label: "kurs opiekuna medycznego",
                                        },
                                        {
                                            key: "care_experience",
                                            label:
                                                "doświadczenie w wykonywaniu czynności opiekuńczych",
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
                                        <label key={item.key} className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={
                                                    data[item.key as keyof ApplicationFormData] as boolean
                                                }
                                                onChange={(e) =>
                                                    setData(item.key as any, e.currentTarget.checked)
                                                }
                                                className="h-4 w-4 rounded border-2 border-blush accent-[var(--coral)]"
                                            />
                                            <span className="text-foreground/90">{item.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <Field label="OCZEKIWANIA FINANSOWE W EURO">
                                <InputPill
                                    value={data.salary_expectations}
                                    onChange={(v) => setData("salary_expectations", v)}
                                    placeholder="np. 2000€"
                                />
                                <ErrorText msg={errors.salary_expectations} />
                            </Field>

                            {/* upload */}
                            <div>
                                <p className="mb-1 block text-sm font-medium text-foreground">
                                    DODAJ REFERENCJE
                                </p>

                                <div className="flex items-center gap-3">
                                    <label className="relative inline-flex cursor-pointer items-center">
                                        <input
                                            type="file"
                                            onChange={handleFileChange}
                                            accept=".pdf,.doc,.docx,image/*"
                                            className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0"
                                        />
                                        <div className="rounded-full bg-foreground/5 px-4 py-2 text-sm font-semibold text-foreground ring-1 ring-black/10">
                                            DODAJ PLIK
                                        </div>
                                    </label>

                                    {data.references && (
                                        <span className="text-sm text-foreground/80">
                      {data.references.name}
                    </span>
                                    )}
                                </div>

                                <p className="mt-1 text-[11px] text-foreground/60">
                                    PNG, JPG, PDF, DOC, DOCX (MAX 5mb).
                                </p>
                                <ErrorText msg={errors.references} />
                            </div>
                        </div>
                    </Section>

                    {/* ZGODY */}
                    <Section title="ZAAKCEPTUJ ZGODY">
                        <div className="space-y-3">
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

                    {/* WYŚLIJ */}
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            disabled={processing}
                            className="group inline-flex items-center justify-center rounded-full bg-coral px-8 py-3 font-extrabold text-white shadow-md ring-1 ring-black/10 transition hover:opacity-95 disabled:opacity-60"
                        >
                            {processing ? "Wysyłanie..." : "WYŚLIJ"}
                            <span className="ml-3 grid h-9 w-9 place-items-center rounded-full bg-white/15 ring-1 ring-black/10 transition-transform group-hover:translate-x-0.5">
                <ChevronsRight className="h-5 w-5" />
              </span>
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

/* ---------- subkomponenty / UI ---------- */

function Section({
                     title,
                     children,
                 }: React.PropsWithChildren<{ title: string }>) {
    return (
        <section className="rounded-[1rem]  p-6 ">
            <h2 className="mb-4 text-center font-extrabold tracking-wide text-coral">
                {title}
            </h2>
            <div>{children}</div>
        </section>
    );
}

function Field({
                   children,
               }: React.PropsWithChildren<{ label: string }>) {
    return (
        <div>

            {children}
        </div>
    );
}

function InputPill({
                       value,
                       onChange,
                       placeholder,
                       type = "text",
                   }: {
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    type?: React.HTMLInputTypeAttribute;
}) {
    return (
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.currentTarget.value)}
            placeholder={placeholder}
            className="h-11 w-full rounded-full bg-white px-5 ring-1 ring-black/10 focus:outline-none focus:ring-2 focus:ring-mint"
        />
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
            <label className="flex cursor-pointer select-none items-start gap-2">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onChange(e.currentTarget.checked)}
                    className="mt-1 h-4 w-4 rounded  border-blush accent-[var(--coral)]"
                />
                <span className="text-foreground/80">{label}</span>
            </label>

            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="ml-6 text-sm font-semibold text-coral hover:underline"
            >
                {open ? "zwiń" : "rozwiń"}
            </button>

            {open && (
                <p className="ml-6 mt-1 text-xs text-muted-foreground">
                    Tu wstaw treść zgody/klauzuli informacyjnej RODO. Możesz zalinkować do
                    pełnej polityki prywatności lub pokazać dłuższy opis.
                </p>
            )}

            <ErrorText msg={error} className="ml-6" />
        </div>
    );
}

function ErrorText({
                       msg,
                       className = "",
                   }: {
    msg?: string;
    className?: string;
}) {
    if (!msg) return null;
    return (
        <p className={`mt-1 text-xs text-red-600 ${className}`}>
            {msg}
        </p>
    );
}
