import AppLayout from '@/layouts/app-layout';
import { Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, ChevronsRight } from 'lucide-react';
import * as React from 'react';

// --- file validation ---
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_EXTS = ['png', 'jpg', 'jpeg', 'pdf', 'doc', 'docx'];

function formatBytes(bytes: number) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(i ? 1 : 0)} ${sizes[i]}`;
}

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
    consent4: boolean;
    consent5: boolean;
    consent6: boolean;
    consent7: boolean;
    consent8: boolean;
    consent9: boolean;
    consent10: boolean;
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
        consent4: false,
        consent5: false,
        consent6: false,
        consent7: false,
        consent8: false,
        consent9: false,
        consent10: false,
        offer_id: offer?.id,
        offer_title: offer?.title,
    });
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [fileError, setFileError] = React.useState<string | undefined>(undefined);
    const [consentErrors, setConsentErrors] = React.useState<{[key: string]: string}>({});
    const [showSuccessMessage, setShowSuccessMessage] = React.useState(false);

    const validateForm = () => {
        const newConsentErrors: {[key: string]: string} = {};

        // Walidacja zgody 1 (wymagana)
        if (!data.consent1) {
            newConsentErrors.consent1 = 'Ta zgoda jest wymagana';
        }

        setConsentErrors(newConsentErrors);
        return Object.keys(newConsentErrors).length === 0;
    };

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Form submission started', data);

        // Reset errors
        setFileError(undefined);
        setConsentErrors({});
        setShowSuccessMessage(false);

        // Walidacja podstawowych pól wymaganych
        if (!data.name.trim()) {
            console.error('Name is required');
            return;
        }
        if (!data.email.trim()) {
            console.error('Email is required');
            return;
        }
        if (!data.phone.trim()) {
            console.error('Phone is required');
            return;
        }
        if (!data.language_level.trim()) {
            console.error('Language level is required');
            return;
        }

        // Walidacja pliku jeśli został wybrany
        if (data.references) {
            const ext = data.references.name.split('.').pop()?.toLowerCase() || '';
            if (!ALLOWED_EXTS.includes(ext)) {
                setFileError('Nieobsługiwany format. Dozwolone: PNG, JPG, PDF, DOC, DOCX.');
                console.error('Invalid file format');
                return;
            }
            if (data.references.size > MAX_FILE_SIZE) {
                setFileError('Plik jest za duży (max 5 MB).');
                console.error('File too large');
                return;
            }
        }

        // Walidacja zgód
        if (!validateForm()) {
            console.error('Consent validation failed');
            return;
        }

        console.log('All validations passed, submitting...');

        // Przygotowanie danych do wysłania
        const formData = new FormData();

        // Podstawowe dane
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('phone', data.phone);
        formData.append('language_level', data.language_level);
        formData.append('additional_language', data.additional_language);
        formData.append('learned_profession', data.learned_profession);
        formData.append('current_profession', data.current_profession);
        formData.append('experience', data.experience);
        formData.append('salary_expectations', data.salary_expectations);

        // Checkboxy umiejętności
        formData.append('first_aid_course', data.first_aid_course.toString());
        formData.append('medical_caregiver_course', data.medical_caregiver_course.toString());
        formData.append('care_experience', data.care_experience.toString());
        formData.append('housekeeping_experience', data.housekeeping_experience.toString());
        formData.append('cooking_experience', data.cooking_experience.toString());
        formData.append('driving_license', data.driving_license.toString());
        formData.append('smoker', data.smoker.toString());

        // Zgody
        formData.append('consent1', data.consent1.toString());
        formData.append('consent2', data.consent2.toString());
        formData.append('consent3', data.consent3.toString());
        formData.append('consent4', data.consent4.toString());
        formData.append('consent5', data.consent5.toString());
        formData.append('consent6', data.consent6.toString());
        formData.append('consent7', data.consent7.toString());
        formData.append('consent8', data.consent8.toString());
        formData.append('consent9', data.consent9.toString());
        formData.append('consent10', data.consent10.toString());

        // Plik
        if (data.references) {
            formData.append('references', data.references);
        }

        // Oferta
        if (data.offer_id) {
            formData.append('offer_id', data.offer_id);
        }
        if (data.offer_title) {
            formData.append('offer_title', data.offer_title);
        }

        console.log('FormData prepared, sending request...');

        post('/aplikuj', {
            data: formData,
            // preserveScroll: true,  // ⬅️ usuń
            forceFormData: true,
            onSuccess: () => {
                // ⬇️ przewiń do góry
                window.scrollTo({ top: 0, behavior: 'smooth' });

                setFileError(undefined);
                setConsentErrors({});
                setShowSuccessMessage(true);
                if (fileInputRef.current) fileInputRef.current.value = '';
                reset();
                setTimeout(() => setShowSuccessMessage(false), 5000);
            },
            onError: (errors) => {
                console.error('Form submission errors:', errors);
                // jeśli chcesz również przy błędach przewinąć do góry:
                // window.scrollTo({ top: 0, behavior: 'smooth' });
            },
        });
    };

    const acceptAll = () => {
        setData((d) => ({
            ...d,
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
        }));
        // Clear consent errors when accepting all
        setConsentErrors({});
        console.log('All consents accepted');
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFileError(undefined);

        if (!file) {
            setData('references', null);
            return;
        }

        const ext = file.name.split('.').pop()?.toLowerCase() || '';
        if (!ALLOWED_EXTS.includes(ext)) {
            setFileError('Nieobsługiwany format. Dozwolone: PNG, JPG, PDF, DOC, DOCX.');
            setData('references', null);
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            setFileError('Plik jest za duży (max 5 MB).');
            setData('references', null);
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        setData('references', file);
        console.log('File selected:', file.name);
    };

    // Funkcja do obsługi zmiany checkboxów zgód
    const handleConsentChange = (consentKey: keyof ApplicationFormData, checked: boolean) => {
        setData(consentKey, checked);
        // Clear error when checkbox is checked
        if (checked && consentErrors[consentKey]) {
            setConsentErrors(prev => ({...prev, [consentKey]: ''}));
        }
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
                <p className="mt-2 text-center text-[40px] leading-tight font-extrabold tracking-[0.02em] text-[#2b4a44]">WYPEŁNIJ FORMULARZ</p>

                {/* Komunikat o sukcesie */}
                {showSuccessMessage && (
                    <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg text-center">
                        <p className="font-semibold">Formularz został pomyślnie wysłany!</p>
                        <p className="text-sm mt-1">Dziękujemy za złożenie aplikacji. Skontaktujemy się z Tobą w najbliższym czasie.</p>
                    </div>
                )}

                <form onSubmit={submit} className="mt-6 space-y-8" noValidate>
                    {/* PODSTAWOWE INFORMACJE */}
                    <Section title="PODSTAWOWE INFORMACJE">
                        <div className="space-y-4">
                            <Field>
                                <InputFloat
                                    name="name"
                                    label="IMIĘ I NAZWISKO*"
                                    required
                                    value={data.name}
                                    onChange={(v) => setData('name', v)}
                                    error={errors.name}
                                />
                            </Field>

                            <Field>
                                <InputFloat
                                    name="email"
                                    label="E-MAIL*"
                                    type="email"
                                    required
                                    value={data.email}
                                    onChange={(v) => setData('email', v)}
                                    error={errors.email}
                                />
                            </Field>

                            <Field>
                                <InputFloat
                                    name="phone"
                                    label="NUMER TELEFONU*"
                                    type="tel"
                                    required
                                    value={data.phone}
                                    onChange={(v) => setData('phone', v)}
                                    error={errors.phone}
                                />
                            </Field>

                            <Field>
                                <InputFloat
                                    name="language_level"
                                    label="ZNAJOMOŚĆ JĘZYKA NIEMIECKIEGO*"
                                    required
                                    value={data.language_level}
                                    onChange={(v) => setData('language_level', v)}
                                    error={errors.language_level}
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
                                    error={errors.additional_language}
                                />
                            </Field>

                            <Field>
                                <InputFloat
                                    name="learned_profession"
                                    label="ZAWÓD WYUCZONY"
                                    value={data.learned_profession}
                                    onChange={(v) => setData('learned_profession', v)}
                                    error={errors.learned_profession}
                                />
                            </Field>

                            <Field>
                                <InputFloat
                                    name="current_profession"
                                    label="ZAWÓD WYKONYWANY"
                                    value={data.current_profession}
                                    onChange={(v) => setData('current_profession', v)}
                                    error={errors.current_profession}
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
                                                className="h-4 w-4 rounded-full border-2 border-gray-300 text-coral focus:ring-coral"
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
                                        { key: 'care_experience', label: 'doświadczenie w wykonywaniu czynności opiekuńczych' },
                                        { key: 'housekeeping_experience', label: 'doświadczenie w porządkach domowych' },
                                        { key: 'cooking_experience', label: 'doświadczenie w przygotowywaniu posiłków' },
                                        { key: 'driving_license', label: 'prawo jazdy' },
                                        { key: 'smoker', label: 'osoba paląca' },
                                    ].map((item) => (
                                        <label key={item.key} className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={data[item.key as keyof ApplicationFormData] as boolean}
                                                onChange={(e) => setData(item.key as any, e.currentTarget.checked)}
                                                className="h-4 w-4 rounded border-2 border-gray-300 text-coral focus:ring-coral"
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
                                    onChange={(v) => setData('salary_expectations', v)}
                                    inputMode="numeric"
                                    pattern="[0-9]+([,.][0-9]+)?"
                                    rightSlot="€"
                                    error={errors.salary_expectations}
                                />
                            </Field>

                            {/* DODAJ REFERENCJE */}
                            <div className="mt-2">
                                <div className="relative h-12 overflow-hidden rounded-full bg-white ring-1 ring-black/10">
                                    <span className="absolute top-1/2 left-6 -translate-y-1/2 text-[15px] font-extrabold tracking-wide text-[#2b4a44] uppercase">
                                        DODAJ REFERENCJE
                                    </span>
                                    <label className="absolute top-0 right-0 h-full w-[150px]">
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            onChange={handleFileChange}
                                            accept=".png,.jpg,.jpeg,.pdf,.doc,.docx"
                                            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                                        />
                                        <span className="grid h-full w-full place-items-center rounded-r-full bg-blush px-4 text-sm font-extrabold text-white">
                                            DODAJ PLIK
                                        </span>
                                    </label>
                                    <span className="invisible pr-[150px]">.</span>
                                </div>
                                <div className="mt-1 flex items-center justify-between gap-3">
                                    <span className="max-w-[60%] truncate text-sm text-foreground/80">
                                        {data.references ? `${data.references.name} (${formatBytes(data.references.size)})` : ''}
                                    </span>
                                    <p className="text-right text-[11px] text-foreground/60">PNG, JPG, PDF, DOC, DOCX (MAX 5 MB).</p>
                                </div>
                                <ErrorText msg={fileError || errors.references} />
                            </div>
                        </div>
                    </Section>

                    {/* ZGODY */}
                    <Section>
                        <h3 className="mb-3 font-semibold">ZAAKCEPTUJ ZGODY</h3>
                        <div className="space-y-4">
                            <ConsentRow
                                checked={data.consent1}
                                onChange={(checked) => handleConsentChange('consent1', checked)}
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
                                error={consentErrors.consent1}
                                required
                            />
                            <ConsentRow
                                checked={data.consent2}
                                onChange={(checked) => handleConsentChange('consent2', checked)}
                                label="Wyrażam zgodę na przetwarzanie moich danych osobowych w celu zaproponowania mi ofert pracy przez Senior na Plus Pflege sp. z o.o., a także dla potrzeb niezbędnych do udziału w prowadzonych przez Senior na Plus Pflege sp. z o.o. procesach rekrutacji. W tym celu zgadzam się też na przetwarzanie przez Senior na Plus Pflege sp. z o.o. moich danych osobowych podanych powyżej. Wiem, że każdą zgodę mogę wycofać w dowolnym momencie."
                                error={consentErrors.consent2}
                            />
                            <div className="space-y-2">
                                <ConsentRow
                                    checked={data.consent3}
                                    onChange={(checked) => handleConsentChange('consent3', checked)}
                                    label="Wyrażam zgodę na otrzymywanie od Senior na Plus Pflege sp. z o.o. informacji handlowych i innych treści marketingowych (newsletter, oferty, promocje, informacje o nowościach, informacje branżowe itp.):"
                                    error={consentErrors.consent3}
                                />
                                <div className="ml-6 space-y-1">
                                    <ConsentRow
                                        checked={data.consent4}
                                        onChange={(checked) => handleConsentChange('consent4', checked)}
                                        label="na mój adres e-mail (w tym również z użyciem systemów do automatycznej wysyłki e-maili)"
                                        error={consentErrors.consent4}
                                        indent={true}
                                    />
                                    <ConsentRow
                                        checked={data.consent5}
                                        onChange={(checked) => handleConsentChange('consent5', checked)}
                                        label="na mój numer telefonu w formie SMS/MMS (w tym również z użyciem systemów do automatycznej wysyłki SMS-ów),"
                                        error={consentErrors.consent5}
                                        indent={true}
                                    />
                                    <ConsentRow
                                        checked={data.consent6}
                                        onChange={(checked) => handleConsentChange('consent6', checked)}
                                        label="w formie połączeń telefonicznych na mój numer telefonu (w tym również z użyciem systemów do automatycznego nawiązywania połączeń (automatycznych systemów wywołujących))."
                                        error={consentErrors.consent6}
                                        indent={true}
                                    />
                                </div>
                                <p className="ml-6 text-xs text-foreground/70">
                                    W tym celu zgadzam się też na przetwarzanie przez Senior na Plus Pflege sp. z o.o. moich danych osobowych podanych powyżej. Wiem, że każdą zgodę mogę wycofać w dowolnym momencie.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <ConsentRow
                                    checked={data.consent7}
                                    onChange={(checked) => handleConsentChange('consent7', checked)}
                                    label={
                                        <span>
                                            Wyrażam zgodę na otrzymywanie od{' '}
                                            <a href="/partnerzy" target="_blank" rel="noopener noreferrer" className="text-coral underline hover:no-underline">
                                                partnerów handlowych
                                            </a>{' '}
                                            Senior na Plus Pflege sp. z o.o. informacji handlowych i innych treści marketingowych (newsletter, oferty, promocje, informacje o nowościach, informacje branżowe itp.):
                                        </span>
                                    }
                                    error={consentErrors.consent7}
                                />
                                <div className="ml-6 space-y-1">
                                    <ConsentRow
                                        checked={data.consent8}
                                        onChange={(checked) => handleConsentChange('consent8', checked)}
                                        label="na mój adres e-mail (w tym również z użyciem systemów do automatycznej wysyłki e-maili),"
                                        error={consentErrors.consent8}
                                        indent={true}
                                    />
                                    <ConsentRow
                                        checked={data.consent9}
                                        onChange={(checked) => handleConsentChange('consent9', checked)}
                                        label="na mój numer telefonu w formie SMS/MMS (w tym również z użyciem systemów do automatycznej wysyłki SMS-ów),"
                                        error={consentErrors.consent9}
                                        indent={true}
                                    />
                                    <ConsentRow
                                        checked={data.consent10}
                                        onChange={(checked) => handleConsentChange('consent10', checked)}
                                        label="w formie połączeń telefonicznych na mój numer telefonu (w tym również z użyciem systemów do automatycznego nawiązywania połączeń (automatycznych systemów wywołujących))."
                                        error={consentErrors.consent10}
                                        indent={true}
                                    />
                                </div>
                                <p className="ml-6 text-xs text-foreground/70">
                                    W tym celu zgadzam się też na przetwarzanie przez partnerów handlowych Senior na Plus Pflege sp. z o.o. moich danych osobowych podanych powyżej. Wiem, że każdą zgodę mogę wycofać w dowolnym momencie.
                                </p>
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
                            <button type="button" onClick={acceptAll} className="text-sm font-semibold text-coral hover:underline">
                                ZAZNACZ WSZYSTKO.
                            </button>
                        </div>
                    </Section>

                    {/* WYŚLIJ */}
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            disabled={processing}
                            className="group inline-flex items-center justify-center rounded-full bg-coral px-6 py-2 font-extrabold text-white shadow-md ring-1 ring-black/10 transition hover:opacity-95 disabled:opacity-60"
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

function Section({ title, children }: React.PropsWithChildren<{ title?: string }>) {
    return (
        <section className="rounded-[1rem] p-4">
            {title && <h2 className="mb-4 text-center text-xl font-extrabold tracking-wide text-coral">{title}</h2>}
            <div>{children}</div>
        </section>
    );
}

function Field({ children }: React.PropsWithChildren<{ label?: string }>) {
    return <div>{children}</div>;
}

function InputFloat({
                        id,
                        name,
                        label,
                        value,
                        onChange,
                        type = 'text',
                        required,
                        inputMode,
                        pattern,
                        autoComplete,
                        rightSlot,
                        maxLength,
                        error,
                    }: {
    id?: string;
    name: string;
    label: string;
    value: string;
    onChange: (v: string) => void;
    type?: React.HTMLInputTypeAttribute;
    required?: boolean;
    inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
    pattern?: string;
    autoComplete?: string;
    rightSlot?: React.ReactNode;
    maxLength?: number;
    error?: string;
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
                placeholder=" "
                inputMode={inputMode}
                pattern={pattern}
                autoComplete={autoComplete}
                maxLength={maxLength}
                className={`peer h-12 w-full rounded-full bg-white px-5 pt-4 pb-1 focus:ring-2 focus:ring-mint focus:outline-none ${error ? 'border-2 border-red-500' : ''} ${rightSlot ? 'pr-12' : ''}`}
            />
            <label
                htmlFor={inputId}
                className="pointer-events-none absolute top-1.5 left-5 z-10 text-xs font-semibold tracking-wide text-foreground/70 uppercase transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-[15px] peer-placeholder-shown:font-extrabold peer-placeholder-shown:text-black/80 peer-focus:top-1.5 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-coral"
            >
                {label}
            </label>
            {rightSlot && <span className="absolute top-1/2 right-4 -translate-y-1/2 text-sm font-semibold text-foreground/60">{rightSlot}</span>}
            <ErrorText msg={error} />
        </div>
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
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: string | React.ReactNode;
    error?: string;
    indent?: boolean;
    required?: boolean;
}) {
    return (
        <div className={`text-sm ${indent ? 'ml-6' : ''} ${error ? 'rounded-lg bg-red-50 p-3 border border-red-200' : ''}`}>
            <label className={`flex cursor-pointer items-start gap-2 select-none ${error ? 'text-red-800' : 'text-foreground/80'}`}>
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    className={`h-4 w-4 rounded border-2 focus:ring-coral ${error ? 'border-red-500 text-red-600' : 'border-gray-300 text-coral'}`}
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
    );
}

function ErrorText({ msg, className = '' }: { msg?: string; className?: string }) {
    if (!msg) return null;
    return <p className={`mt-1 text-xs text-red-600 ${className}`}>{msg}</p>;
}
