import AppLayout from '@/layouts/app-layout';
import { Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, ChevronsRight } from 'lucide-react';
import * as React from 'react';

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

    const { data, setData, post, processing, errors, reset } = useForm<ApplicationFormData>({
        name: '',
        email: '',
        phone: '',
        language_level: '',
        additional_language: '',
        learned_profession: '',
        current_profession: '',
        experience: '',
        first_aid_course: false,
        medical_caregiver_course: false,
        care_experience: false,
        housekeeping_experience: false,
        cooking_experience: false,
        driving_license: false,
        smoker: false,
        salary_expectations: '',
        references: null,
        consent1: false,
        consent2: false,
        consent3: false,
        offer_id: offer?.id,
        offer_title: offer?.title,
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;

        // znajdź pierwszy nieprawidłowy element w formularzu
        const firstInvalid = form.querySelector<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(':invalid');

        if (firstInvalid) {
            firstInvalid.focus(); // pokaże ramkę/fokus
            // @ts-ignore – nie wszystkie mają typowo zdefiniowane reportValidity, ale w przeglądarce jest
            firstInvalid.reportValidity?.();
            return; // przerwij wysyłkę
        }

        post('/aplikuj', {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    const acceptAll = () => setData((d) => ({ ...d, consent1: true, consent2: true, consent3: true }));

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setData('references', file);
    };

    return (
        <AppLayout>
            <div className="mx-auto max-w-2xl bg-[#F5F5F4] px-4 pt-4 pb-12">
                {/* powrót */}
                <Link href="/" className="inline-flex items-center text-sm text-foreground/60 hover:text-foreground">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    WSTECZ
                </Link>

                {/* tytuł */}
                <h1 className="mt-2 text-center text-[40px] leading-tight font-extrabold tracking-[0.02em] text-[#2b4a44]">WYPEŁNIJ FORMULARZ</h1>

                <form onSubmit={submit} className="mt-6 space-y-8">
                    {/* PODSTAWOWE INFORMACJE */}
                    <Section title="PODSTAWOWE INFORMACJE">
                        <div className="space-y-4">
                            <Field>
                                <InputFloat
                                    name="name"
                                    label="IMIĘ I NAZWISKO*"
                                    required
                                    value={data.name}
                                    onChange={(v) => setData("name", v)}
                                />
                            </Field>

                            <Field label="E-MAIL*">
                                <InputFloat
                                    name="email"
                                    label="E-MAIL*"
                                    type="email"
                                    required
                                    value={data.email}
                                    onChange={(v) => setData("email", v)}
                                />
                            </Field>

                            <Field label="NUMER KONTAKTOWY*">
                                <InputFloat
                                    name="phone"
                                    label="NUMER KONTAKTOWY*"
                                    type="tel"
                                    required
                                    value={data.phone}
                                    onChange={(v) => setData("phone", v)}
                                />
                            </Field>

                            <Field label="ZNAJOMOŚĆ JĘZYKA*">
                                <InputFloat
                                    name="language_level"
                                    label="ZNAJOMOŚĆ JĘZYKA*"
                                    required
                                    value={data.language_level}
                                    onChange={(v) => setData("language_level", v)}
                                />
                            </Field>
                        </div>
                    </Section>

                    {/* DODATKOWE INFORMACJE */}
                    <Section title="DODATKOWE INFORMACJE">
                        <div className="space-y-4">
                            <Field>
                                <InputFloat
                                    name="additional_language"
                                    label="DODATKOWY JĘZYK"
                                    value={data.additional_language}
                                    onChange={(v) => setData('additional_language', v)}
                                />
                            </Field>

                            <Field>
                                <InputFloat
                                    name="learned_profession"
                                    label="ZAWÓD WYUCZONY"
                                    value={data.learned_profession}
                                    onChange={(v) => setData('learned_profession', v)}
                                />
                            </Field>

                            <Field>
                                <InputFloat
                                    name="current_profession"
                                    label="ZAWÓD WYKONYWANY"
                                    value={data.current_profession}
                                    onChange={(v) => setData('current_profession', v)}
                                />
                            </Field>
                        </div>
                    </Section>

                    {/* DOŚWIADCZENIE ZAWODOWE */}
                    <Section title="DOŚWIADCZENIE ZAWODOWE">
                        <div className="space-y-6">
                            <div>
                                <h3 className="mb-2 font-semibold tracking-wide text-foreground">DOŚWIADCZENIE JAKO OPIEKUN OSÓB STARSZYCH</h3>
                                <div className="space-y-2">
                                    {['brak', 'od 1 roku', 'od 1 do 3 lat', 'powyżej 3 lat'].map((option) => (
                                        <label key={option} className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name="experience"
                                                value={option}
                                                checked={data.experience === option}
                                                onChange={(e) => setData('experience', e.currentTarget.value)}
                                                className="control control-circle h-4 w-4 accent-coral"
                                            />
                                            <span className="text-foreground/90">{option}</span>
                                        </label>
                                    ))}
                                </div>
                                <ErrorText msg={errors.experience} />
                            </div>

                            <div>
                                <h3 className="mb-2 font-semibold tracking-wide text-foreground">DODATKOWE INFORMACJE</h3>
                                <div className="space-y-2">
                                    {[
                                        { key: 'first_aid_course', label: 'kurs pierwszej pomocy' },
                                        { key: 'medical_caregiver_course', label: 'kurs opiekuna medycznego' },
                                        {
                                            key: 'care_experience',
                                            label: 'doświadczenie w wykonywaniu czynności opiekuńczych',
                                        },
                                        {
                                            key: 'housekeeping_experience',
                                            label: 'doświadczenie w porządkach domowych',
                                        },
                                        {
                                            key: 'cooking_experience',
                                            label: 'doświadczenie w przygotowywaniu posiłków',
                                        },
                                        { key: 'driving_license', label: 'prawo jazdy' },
                                        { key: 'smoker', label: 'osoba paląca' },
                                    ].map((item) => (
                                        <label key={item.key} className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={data[item.key as keyof ApplicationFormData] as boolean}
                                                onChange={(e) => setData(item.key as any, e.currentTarget.checked)}
                                                className="control control-circle"
                                            />
                                            <span className="text-foreground/90">{item.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <Field>
                                <InputFloat
                                    name="salary_expectations"
                                    label="OCZEKIWANIA FINANSOWE W EURO"
                                    value={data.salary_expectations}
                                    onChange={(v) => setData("salary_expectations", v)}
                                    inputMode="numeric"
                                    pattern="[0-9]+([,.][0-9]+)?"
                                    rightSlot="€"
                                />
                            </Field>



                            {/* DODAJ REFERENCJE – wygląd jak na screenie */}
                            <div className="mt-2">
                                {/* DODAJ REFERENCJE – pigułka z ucięciem i pełnowysokim buttonem */}
                                <div className="mt-2">
                                    <div className="relative h-12 overflow-hidden rounded-full bg-white ring-1 ring-black/10">
                                        {/* lewa etykieta */}
                                        <span className="absolute top-1/2 left-6 -translate-y-1/2 text-[15px] font-extrabold tracking-wide text-[#2b4a44] uppercase">
                                            DODAJ REFERENCJE
                                        </span>

                                        {/* prawy przycisk zajmuje CAŁĄ wysokość pigułki */}
                                        <label className="absolute top-0 right-0 h-full w-[150px]">
                                            <input
                                                type="file"
                                                onChange={handleFileChange}
                                                accept=".png,.jpg,.jpeg,.pdf,.doc,.docx"
                                                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                                            />
                                            {/* rounded tylko z prawej, lewa krawędź „ucięta” przez overflow kontenera */}
                                            <span className="grid h-full w-full place-items-center rounded-r-full bg-blush px-4 text-sm font-extrabold text-white">
                                                DODAJ PLIK
                                            </span>
                                        </label>

                                        {/* mała rezerwa z prawej, żeby tekst nie wchodził pod przycisk */}
                                        <span className="invisible pr-[150px]">.</span>
                                    </div>


                                </div>

                                {/* nazwa pliku + opis formatów */}
                                <div className="mt-1 flex items-center justify-between gap-3">
                                    <span className="max-w-[60%] truncate text-sm text-foreground/80">{data.references?.name}</span>
                                    <p className="text-right text-[11px] text-foreground/60">PNG, JPG, PDF, DOC, DOCX (MAX 5mb).</p>
                                </div>

                                <ErrorText msg={errors.references} />
                            </div>
                        </div>
                    </Section>

                    {/* ZGODY */}
                    <Section title="ZAAKCEPTUJ ZGODY">
                        <div className="space-y-3">
                            <ConsentRow
                                checked={data.consent1}
                                onChange={(v) => setData('consent1', v)}
                                label="Wyrażam zgodę na przetwarzanie moich danych osobowych podanych powyżej przez Senior na Plus sp. z o.o..."
                                error={errors.consent1}
                            />
                            <ConsentRow
                                checked={data.consent2}
                                onChange={(v) => setData('consent2', v)}
                                label="Wyrażam zgodę na przetwarzanie moich danych osobowych podanych powyżej przez Senior na Plus sp. z o.o..."
                                error={errors.consent2}
                            />
                            <ConsentRow
                                checked={data.consent3}
                                onChange={(v) => setData('consent3', v)}
                                label="Wyrażam zgodę na przetwarzanie moich danych osobowych podanych powyżej przez Administratora Danych..."
                                error={errors.consent3}
                            />

                            <button type="button" onClick={acceptAll} className="text-sm font-semibold text-coral hover:underline">
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
                            {processing ? 'Wysyłanie...' : 'WYŚLIJ'}
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

function Section({ title, children }: React.PropsWithChildren<{ title: string }>) {
    return (
        <section className="rounded-[1rem] p-4">
            <h2 className="mb-4 text-center text-xl font-extrabold tracking-wide text-coral">{title}</h2>
            <div>{children}</div>
        </section>
    );
}

function Field({ children }: React.PropsWithChildren<{ label: string }>) {
    return <div>{children}</div>;
}

function InputFloat({
                        id,
                        name,
                        label,
                        value,
                        onChange,
                        type = "text",
                        required,
                        inputMode,
                        pattern,
                        autoComplete,
                        rightSlot,
                        maxLength,
                    }: {
    id?: string;
    name: string;
    label: string;
    value: string;
    onChange: (v: string) => void;
    type?: React.HTMLInputTypeAttribute;
    required?: boolean;
    inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
    pattern?: string;
    autoComplete?: string;
    rightSlot?: React.ReactNode;
    maxLength?: number;
}) {
    const inputId = id ?? name;

    return (
        <div className="relative">
            <input
                id={inputId}
                name={name}
                type={type}
                required={required}
                value={value}
                onChange={(e) => onChange(e.currentTarget.value)}
                placeholder=" "                              // ważne dla :placeholder-shown
                inputMode={inputMode}
                pattern={pattern}
                autoComplete={autoComplete}
                maxLength={maxLength}
                className={`peer h-12 w-full rounded-full bg-white px-5 pt-4 pb-1
                    focus:outline-none focus:ring-2 focus:ring-mint
                    ring-1 ring-black/10
                    ${rightSlot ? "pr-12" : ""}`}
            />

            {/* label pływający */}
            <label
                htmlFor={inputId}
                className="
          pointer-events-none absolute left-5 top-1.5 z-10
          text-xs font-semibold uppercase tracking-wide text-foreground/70 transition-all
          peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2
          peer-placeholder-shown:text-[15px] peer-placeholder-shown:font-extrabold
          peer-placeholder-shown:text-black/80
          peer-focus:top-1.5 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-coral
        "
            >
                {label}
            </label>

            {/* sufiks, np. € */}
            {rightSlot && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-foreground/60">
          {rightSlot}
        </span>
            )}
        </div>
    );
}



function ConsentRow({ checked, onChange, label, error }: { checked: boolean; onChange: (v: boolean) => void; label: string; error?: string }) {
    const [open, setOpen] = React.useState(false);

    return (
        <div className="text-sm">
            <label className="flex cursor-pointer items-start gap-2 select-none">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onChange(e.currentTarget.checked)}
                    className="control control-circle mt-1 h-4 w-4"
                />
                <span className="text-foreground/80">{label}</span>
            </label>

            <button type="button" onClick={() => setOpen((v) => !v)} className="ml-6 text-sm font-semibold text-coral hover:underline">
                {open ? 'zwiń' : 'rozwiń'}
            </button>

            {open && (
                <p className="mt-1 ml-6 text-xs text-muted-foreground">
                    Tu wstaw treść zgody/klauzuli informacyjnej RODO. Możesz zalinkować do pełnej polityki prywatności lub pokazać dłuższy opis.
                </p>
            )}

            <ErrorText msg={error} className="ml-6" />
        </div>
    );
}

function ErrorText({ msg, className = '' }: { msg?: string; className?: string }) {
    if (!msg) return null;
    return <p className={`mt-1 text-xs text-red-600 ${className}`}>{msg}</p>;
}
