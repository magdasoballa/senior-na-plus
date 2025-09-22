import { Link, router, usePage } from '@inertiajs/react';
import {
     ChevronsRight, Euro,
} from 'lucide-react'

import * as React from 'react';
import AppLayout from '@/layouts/app-layout';
import Termin from '../../../../public/icons/termin';
import Miasto from '../../../../public/icons/miasto';
import Jezyk from '../../../../public/icons/jezyk';
import Kalendarz from '../../../../public/icons/kalendarz';
import Podopieczna from '../../../../public/icons/podopieczna';
import Mobilna from '../../../../public/icons/mobilna';
import Samotna from '../../../../public/icons/samotna';

type OfferApi = {
    id: number | string;
    title: string;
    city?: string | null;
    country?: string | null;
    start_date?: string | null;
    duration?: string | null;
    language?: string | null;
    wage?: string | null;
    care_recipient_gender?: 'female' | 'male' | null;
    mobility?: 'mobile' | 'limited' | 'immobile' | null;
    lives_alone?: boolean | string | number | null;
};


type Paginator<T> = {
    data: T[];
    links?: Array<{ url: string | null; label: string; active: boolean }>;
    meta?: any;
};

type Filters = {
    q?: string;
    city?: string;
    country?: string;
    language?: string;
    start_from?: string;
    start_to?: string;
    duration?: string;
    gender?: 'female' | 'male' | '';
    mobility?: 'mobile' | 'limited' | 'immobile' | '';
    lives_alone?: '' | '1' | '0';
    with_wage?: boolean;
};

// Przyjmujemy tablicę LUB paginator + (opcjonalnie) filters z backendu
type Props = { offers: OfferApi[] | Paginator<OfferApi>; filters?: Filters };

export default function OffersIndex({ offers, filters }: Props) {
    const isDarkMode =
        typeof window !== 'undefined' &&
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Aktualne query z adresu (gdy backend nie poda filters)
    const { url } = usePage();
    const urlParams = React.useMemo(() => {
        const qs = url.includes('?') ? url.split('?')[1] : '';
        const sp = new URLSearchParams(qs);
        return Object.fromEntries(sp.entries());
    }, [url]);

    // Stan filtrów z priorytetem: props.filters -> URL -> domyślne
    const [f, setF] = React.useState<Filters>({
        q:         filters?.q         ?? (urlParams.q ?? ''),
        city:      filters?.city      ?? (urlParams.city ?? ''),
        country:   filters?.country   ?? (urlParams.country ?? ''),
        language:  filters?.language  ?? (urlParams.language ?? ''),
        start_from:filters?.start_from?? (urlParams.start_from ?? ''),
        start_to:  filters?.start_to  ?? (urlParams.start_to ?? ''),
        duration:  filters?.duration  ?? (urlParams.duration ?? ''),
        gender:    (filters?.gender as any) ?? (urlParams.gender ?? ''),
        mobility:  (filters?.mobility as any) ?? (urlParams.mobility ?? ''),
        lives_alone:(filters?.lives_alone as any) ?? (urlParams.lives_alone ?? ''),
        with_wage:
            typeof filters?.with_wage === 'boolean'
                ? filters!.with_wage
                : urlParams.with_wage === '1' || urlParams.with_wage === 'true',
    });


    // normalizacja źródła
    const src: OfferApi[] = Array.isArray(offers) ? offers : (offers?.data ?? []);

    const items = src.map((o) => {
        const gender   = labelGender(o.care_recipient_gender);
        const mobility = labelMobility(o.mobility, o.care_recipient_gender);
        const alone    = labelLivesAlone(o.lives_alone, o.care_recipient_gender);

        return {
            id: o.id,
            title: o.title,
            wage: o.wage ?? '—',
            start_date: formatDatePl(o.start_date),
            city_line: [o.city, o.country].filter(Boolean).join(', ') || '—',
            language: o.language ?? '—',
            duration: o.duration ?? '—',
            gender,
            mobility,
            alone,
            href: `/offers/${o.id}`,
        };
    });



    // linki paginatora (jeśli przyszły)
    const links = Array.isArray(offers) ? [] : (offers?.links ?? []);

    const submit = (e?: React.FormEvent) => {
        e?.preventDefault?.();
        const payload: Record<string, any> = {};
        if (f.q) payload.q = f.q;
        if (f.city) payload.city = f.city;
        if (f.country) payload.country = f.country;
        if (f.language) payload.language = f.language;
        if (f.start_from) payload.start_from = f.start_from;
        if (f.start_to) payload.start_to = f.start_to;
        if (f.duration) payload.duration = f.duration;
        if (f.gender) payload.gender = f.gender;
        if (f.mobility) payload.mobility = f.mobility;
        if (f.lives_alone !== '' && f.lives_alone !== undefined)
            payload.lives_alone = f.lives_alone;
        if (f.with_wage) payload.with_wage = 1;

        router.get('/offers', payload, { preserveState: true, replace: true });
    };

    const reset = () => {
        setF({
            q: '', city: '', country: '', language: '',
            start_from: '', start_to: '', duration: '',
            gender: '', mobility: '', lives_alone: '',
            with_wage: false,
        });
        router.get('/offers', {}, { preserveState: false, replace: true });
    };

    return (
        <AppLayout>
            <section className="select-none px-3 sm:px-4">
                <header className="mb-6 text-center">
                    <h1 className={`text-4xl md:text-6xl leading-tight tracking-tight ${isDarkMode ? 'text-white' : ''}`}>
                        Oferty pracy
                    </h1>
                    <p className="mt-1 text-xl md:text-3xl text-sea">sprawdź nowości</p>
                </header>

                {/* FILTRY */}
                <form onSubmit={submit} className="mx-auto mb-8 w-full md:w-[70%]">
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                        <input
                            value={f.q ?? ''}
                            onChange={(e) => setF((s) => ({ ...s, q: e.target.value }))}
                            placeholder="Szukaj (tytuł / miasto)"
                            className="rounded-full border bg-white px-4 py-2"
                        />
                        <input
                            value={f.city ?? ''}
                            onChange={(e) => setF((s) => ({ ...s, city: e.target.value }))}
                            placeholder="Miasto"
                            className="rounded-full border bg-white px-4 py-2"
                        />
                        <input
                            value={f.country ?? ''}
                            onChange={(e) => setF((s) => ({ ...s, country: e.target.value }))}
                            placeholder="Kraj"
                            className="rounded-full border bg-white px-4 py-2"
                        />
                        <input
                            value={f.language ?? ''}
                            onChange={(e) => setF((s) => ({ ...s, language: e.target.value }))}
                            placeholder="Język"
                            className="rounded-full border bg-white px-4 py-2"
                        />

                        {/* POCZĄTEK OPIEKI — zakres dat */}
                        <input
                            type="date"
                            value={f.start_from ?? ''}
                            onChange={(e) => setF((s) => ({ ...s, start_from: e.target.value }))}
                            className="rounded-full border bg-white px-4 py-2"
                            placeholder="Termin od"
                        />
                        <input
                            type="date"
                            value={f.start_to ?? ''}
                            onChange={(e) => setF((s) => ({ ...s, start_to: e.target.value }))}
                            className="rounded-full border bg-white px-4 py-2"
                            placeholder="Termin do"
                        />

                        {/* CZAS TRWANIA */}
                        <input
                            value={f.duration ?? ''}
                            onChange={(e) => setF((s) => ({ ...s, duration: e.target.value }))}
                            placeholder="Czas trwania (np. 2 tygodnie)"
                            className="rounded-full border bg-white px-4 py-2"
                        />

                        {/* PŁEĆ PODOPIECZNEGO/J */}
                        <select
                            value={f.gender ?? ''}
                            onChange={(e) => setF((s) => ({ ...s, gender: e.target.value as any }))}
                            className="rounded-full border bg-white px-4 py-2"
                        >
                            <option value="">Płeć (dowolna)</option>
                            <option value="female">Podopieczna</option>
                            <option value="male">Podopieczny</option>
                        </select>

                        {/* MOBILNOŚĆ */}
                        <select
                            value={f.mobility ?? ''}
                            onChange={(e) => setF((s) => ({ ...s, mobility: e.target.value as any }))}
                            className="rounded-full border bg-white px-4 py-2"
                        >
                            <option value="">Mobilność (dowolna)</option>
                            <option value="mobile">Mobilna/y</option>
                            <option value="limited">Ograniczona</option>
                            <option value="immobile">Leżąca/y</option>
                        </select>

                        {/* SAMOTNOŚĆ */}
                        <select
                            value={f.lives_alone ?? ''}
                            onChange={(e) => setF((s) => ({ ...s, lives_alone: e.target.value as any }))}
                            className="rounded-full border bg-white px-4 py-2"
                        >
                            <option value="">Samotność (dowolnie)</option>
                            <option value="1">Samotna/y</option>
                            <option value="0">Mieszka z kimś</option>
                        </select>

                        <label className="flex items-center justify-between rounded-full border bg-white px-4 py-2">
                            <span>Tylko z wynagrodzeniem</span>
                            <input
                                type="checkbox"
                                checked={!!f.with_wage}
                                onChange={(e) => setF((s) => ({ ...s, with_wage: e.target.checked }))}
                            />
                        </label>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-3">
                        <button type="submit" className="rounded-full bg-coral px-4 py-2 font-semibold text-white">
                            Filtruj
                        </button>
                        <button
                            type="button"
                            onClick={reset}
                            className="rounded-full border px-4 py-2"
                        >
                            Wyczyść
                        </button>
                    </div>
                </form>


                {items.length === 0 ? (
                    <p className="text-center text-foreground/70">Brak ofert do wyświetlenia.</p>
                ) : (
                    <>
                        <div className="mx-auto w-full md:w-[70%] space-y-10">
                            {items.map((it) => (
                                <OfferCard key={it.id} slide={it} />
                            ))}
                        </div>

                        {/* prosty pager – pojawi się tylko, gdy backend dostarczy links */}
                        {links.length > 0 && (
                            <nav className="mt-8 flex justify-center gap-2">
                                {links.map((l, i) => {
                                    const base = 'px-3 py-1.5 rounded-full text-sm ring-1 ring-black/10';
                                    const active = l.active ? 'bg-coral text-white' : 'bg-white text-foreground hover:bg-black/5';
                                    return l.url ? (
                                        <Link
                                            key={i}
                                            href={l.url}
                                            preserveScroll
                                            className={`${base} ${active}`}
                                            dangerouslySetInnerHTML={{ __html: l.label }}
                                        />
                                    ) : (
                                        <span
                                            key={i}
                                            className={`${base} bg-white/60 text-foreground/50 cursor-not-allowed`}
                                            dangerouslySetInnerHTML={{ __html: l.label }}
                                        />
                                    );
                                })}
                            </nav>
                        )}
                    </>
                )}
            </section>
        </AppLayout>
    );
}

/* --- Karta oferty + Li niezmienione --- */
function OfferCard({ slide }: {
    slide: {
        id: number | string;
        title: string;
        wage: string;
        start_date: string;
        city_line: string;
        language: string;
        duration: string;
        gender: string;
        mobility: string;
        alone: string;
        href: string;
    };
}) {
    const go = () => router.visit(slide.href);

    return (
        <article className="flex justify-center">
            <div
                className="relative w-full cursor-pointer flex flex-col
          rounded-3xl md:rounded-[5rem] bg-white dark:bg-white dark:text-black
          px-6 md:px-10 py-6 md:py-10 shadow-[0_14px_28px_-10px_rgb(0_0_0/0.18),0_48px_80px_-24px_rgb(0_0_0/0.26)]
          md:shadow-[0_20px_36px_-12px_rgb(0_0_0/0.18),0_72px_120px_-28px_rgb(0_0_0/0.28)]
          ring-1 ring-black/10 md:ring-black/5"
                onClick={go}
                role="link"
                tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && go()}
                aria-label={`Zobacz ofertę: ${slide.title}`}
            >
        <span aria-hidden className="pointer-events-none absolute -z-10 inset-x-10 -bottom-6 h-10
          rounded-full bg-black/20 blur-2xl md:inset-x-16 md:-bottom-7 md:h-12" />
                <h3 className="text-center uppercase tracking-wide text-coral text-xl md:text-2xl font-extrabold">
                    {slide.title}
                </h3>

                <div className="mt-5 grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2">
                    <ul className="space-y-2 sm:space-y-3">
                        <Li icon={Euro}>{slide.wage}</Li>
                        <Li icon={Termin}>{slide.start_date}</Li>
                        <Li icon={Miasto}>{slide.city_line}</Li>
                        <Li icon={Jezyk}>{slide.language}</Li>

                    </ul>
                    <ul className="space-y-2 sm:space-y-3">
                        <Li icon={Kalendarz}>{slide.duration}</Li>
                        <Li icon={Podopieczna}>{slide.gender}</Li>
                        <Li icon={Mobilna}>{slide.mobility}</Li>
                        <Li icon={Samotna}>{slide.alone}</Li>
                    </ul>
                </div>

                <Link
                    href={slide.href}
                    onClick={(e) => e.stopPropagation()}
                    className="group mx-auto mt-6 inline-flex items-center rounded-full
            bg-coral px-5 py-2.5 text-base font-semibold text-white shadow-md
            ring-1 ring-black/10 transition hover:opacity-95
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral"
                >
                    <span className="text-lg md:text-xl font-extrabold tracking-wide text-white">SPRAWDŹ</span>
                    <span className="ml-3 grid h-9 w-9 place-items-center rounded-full bg-black/10 ring-1 ring-black/10 transition-transform group-hover:translate-x-0.5">
            <ChevronsRight className="h-6 w-6 text-white" />
          </span>
                </Link>
            </div>
        </article>
    );
}

function Li({
                icon: Icon,
                className = '',
                children,
            }: React.PropsWithChildren<{ icon: (p: { className?: string }) => JSX.Element; className?: string }>) {
    return (
        <li className={`flex items-center gap-3 rounded-lg px-3 py-2 ${className}`}>
            <Icon className="h-5 w-5 text-blush" />
            <span className="text-[15px] font-medium">{children}</span>
        </li>
    );
}

function formatDatePl(input?: string | null) {
    if (!input) return 'do ustalenia';
    const d = new Date(input);
    if (Number.isNaN(d.getTime())) return input; // jeśli już sformatowane
    return d.toLocaleDateString('pl-PL'); // np. 15.03.2025
}

function labelGender(g?: string | null) {
    if (g === 'female') return 'podopieczna';
    if (g === 'male') return 'podopieczny';
    return '—';
}

function labelMobility(m?: string | null, g?: string | null) {
    const fem = g === 'female';
    switch (m) {
        case 'mobile':   return fem ? 'mobilna' : 'mobilny';
        case 'limited':  return 'ogran. mobilność';
        case 'immobile': return fem ? 'leżąca' : 'leżący';
        default:         return '—';
    }
}

function truthy(v: any) {
    if (typeof v === 'boolean') return v;
    if (v === null || v === undefined) return false;
    const s = String(v).toLowerCase();
    return ['1','true','yes','tak'].includes(s);
}

function labelLivesAlone(v?: boolean | string | number | null, g?: string | null) {
    const fem = g === 'female';
    if (truthy(v)) return fem ? 'samotna' : 'samotny';
    return 'mieszka z kimś';
}
