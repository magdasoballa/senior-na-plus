import AppLayout from '@/layouts/app-layout';
import { Link, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

type Application = {
    id: number | string;
    name: string;
    email: string;
    phone: string;
    language_level: string;
    additional_language: string | null;
    learned_profession: string | null;
    current_profession: string | null;
    experience: string;
    first_aid_course: boolean;
    medical_caregiver_course: boolean;
    care_experience: boolean;
    housekeeping_experience: boolean;
    cooking_experience: boolean;
    driving_license: boolean;
    smoker: boolean;
    salary_expectations: string | null;
    references_path: string | null;
    consent1: boolean;
    consent2: boolean;
    consent3: boolean;
    offer_id?: number | string;
    offer_title?: string | null;
    status: string;
    created_at: string;
    updated_at: string;
    offer?: {
        id?: number | string;
        title?: string | null;
        city?: string | null;
        country?: string | null;
        start_date?: string | null;
        duration?: string | null;
        language?: string | null;
        wage?: string | null;
    } | null;
};

export default function Show() {
    const { application } = usePage<{ application: Application }>().props;

    console.log(application); // Dla debugowania

    return (
        <AppLayout>
            <div className="max-w-5xl space-y-6 p-6">
                {/* Powrót */}
                <Link href="/admin/applications" className="inline-flex items-center text-coral hover:underline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Wróć do listy aplikacji
                </Link>

                {/* Nagłówek */}
                <h1 className="mt-5 text-2xl font-bold">Aplikacja #{application.id}</h1>

                {/* Podstawowe informacje */}
                <section className="space-y-4 rounded-lg bg-[#F5F5F4] p-6">
                    <h2 className="text-xl font-semibold text-coral">Podstawowe informacje</h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="text-sm font-bold text-foreground/80">Imię i nazwisko</label>
                            <p className="text-foreground">{application.name}</p>
                        </div>
                        <div>
                            <label className="text-sm font-bold text-foreground/80">Email</label>
                            <p className="text-foreground">{application.email}</p>
                        </div>
                        <div>
                            <label className="text-sm font-bold text-foreground/80">Telefon</label>
                            <p className="text-foreground">{application.phone}</p>
                        </div>
                        <div>
                            <label className="text-sm font-bold text-foreground/80">Poziom języka</label>
                            <p className="text-foreground">{application.language_level}</p>
                        </div>
                    </div>
                </section>

                {/* Dodatkowe informacje */}
                <section className="space-y-4 rounded-lg bg-[#F5F5F4] p-6">
                    <h2 className="text-xl font-semibold text-coral">Dodatkowe informacje</h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="text-sm font-bold text-foreground/80">Dodatkowy język</label>
                            <p className="text-foreground">{application.additional_language || '—'}</p>
                        </div>
                        <div>
                            <label className="text-sm font-bold text-foreground/80">Zawód wyuczony</label>
                            <p className="text-foreground">{application.learned_profession || '—'}</p>
                        </div>
                        <div>
                            <label className="text-sm font-bold text-foreground/80">Zawód wykonywany</label>
                            <p className="text-foreground">{application.current_profession || '—'}</p>
                        </div>
                    </div>
                </section>

                {/* Doświadczenie zawodowe */}
                <section className="space-y-4 rounded-lg bg-[#F5F5F4] p-6">
                    <h2 className="text-xl font-semibold text-coral">Doświadczenie zawodowe</h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="text-sm font-bold text-foreground/80">Doświadczenie jako opiekun</label>
                            <p className="text-foreground">{application.experience}</p>
                        </div>
                        <div>
                            <label className="text-sm font-bold text-foreground/80">Oczekiwania finansowe</label>
                            <p className="text-foreground">{application.salary_expectations ? `${application.salary_expectations} €` : '—'}</p>
                        </div>
                        <div className="col-span-2">
                            <label className="text-sm font-bold text-foreground/80">Dodatkowe umiejętności</label>
                            <ul className="list-disc pl-5 text-foreground">
                                <li>Kurs pierwszej pomocy: {application.first_aid_course ? 'Tak' : 'Nie'}</li>
                                <li>Kurs opiekuna medycznego: {application.medical_caregiver_course ? 'Tak' : 'Nie'}</li>
                                <li>Doświadczenie w opiece: {application.care_experience ? 'Tak' : 'Nie'}</li>
                                <li>Doświadczenie w porządkach domowych: {application.housekeeping_experience ? 'Tak' : 'Nie'}</li>
                                <li>Doświadczenie w gotowaniu: {application.cooking_experience ? 'Tak' : 'Nie'}</li>
                                <li>Prawo jazdy: {application.driving_license ? 'Tak' : 'Nie'}</li>
                                <li>Osoba paląca: {application.smoker ? 'Tak' : 'Nie'}</li>
                            </ul>
                        </div>
                        <div>
                            <label className="text-sm font-bold text-foreground/80">Referencje</label>
                            <p className="text-foreground">
                                {application.references_path ? (
                                    <a
                                        href={`/admin/applications/${application.id}/references`}
                                        className="text-coral underline-offset-2 hover:underline"
                                    >
                                        Pobierz referencje
                                    </a>
                                ) : (
                                    '—'
                                )}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Zgody */}
                <section className="space-y-4 rounded-lg bg-[#F5F5F4] p-6">
                    <h2 className="text-xl font-semibold text-coral">Zgody</h2>
                    <div className="space-y-2">
                        <p>Zgoda 1: {application.consent1 ? 'Zaakceptowana' : 'Niezaakceptowana'}</p>
                        <p>Zgoda 2: {application.consent2 ? 'Zaakceptowana' : 'Niezaakceptowana'}</p>
                        <p>Zgoda 3: {application.consent3 ? 'Zaakceptowana' : 'Niezaakceptowana'}</p>
                    </div>
                </section>

                {/* Informacje o ofercie */}
                <section className="space-y-4 rounded-lg bg-[#F5F5F4] p-6">
                    <h2 className="text-xl font-semibold text-coral">Oferta</h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="text-sm font-medium text-foreground/80">Tytuł oferty</label>
                            <p className="text-foreground">
                                {(application.offer?.id ?? application.offer_id) ? (
                                    <Link
                                        href={`/offers/${encodeURIComponent(String(application.offer?.id ?? application.offer_id))}`}
                                        className="text-coral underline-offset-2 hover:underline"
                                        prefetch
                                    >
                                        {application.offer?.title ?? application.offer_title ?? '—'}
                                    </Link>
                                ) : (
                                    <span>{application.offer?.title ?? application.offer_title ?? '—'}</span>
                                )}
                            </p>
                        </div>
                        {application.offer && (
                            <>
                                <div>
                                    <label className="text-sm font-medium text-foreground/80">Miasto</label>
                                    <p className="text-foreground">{application.offer.city || '—'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-foreground/80">Kraj</label>
                                    <p className="text-foreground">{application.offer.country || '—'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-foreground/80">Data rozpoczęcia</label>
                                    <p className="text-foreground">{application.offer.start_date || '—'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-foreground/80">Czas trwania</label>
                                    <p className="text-foreground">{application.offer.duration || '—'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-foreground/80">Język</label>
                                    <p className="text-foreground">{application.offer.language || '—'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-foreground/80">Wynagrodzenie</label>
                                    <p className="text-foreground">{application.offer.wage ? `${application.offer.wage} €` : '—'}</p>
                                </div>
                            </>
                        )}
                    </div>
                </section>

                {/* Status i daty */}
                <section className="space-y-4 rounded-lg bg-[#F5F5F4] p-6">
                    <h2 className="text-xl font-semibold text-coral">Status i daty</h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="text-sm font-medium text-foreground/80">Status</label>
                            <p className="text-foreground">{application.status}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-foreground/80">Data utworzenia</label>
                            <p className="text-foreground">{new Date(application.created_at).toLocaleString('pl-PL')}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-foreground/80">Data aktualizacji</label>
                            <p className="text-foreground">{new Date(application.updated_at).toLocaleString('pl-PL')}</p>
                        </div>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}
