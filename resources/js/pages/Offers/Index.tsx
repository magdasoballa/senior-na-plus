import { Link, router } from '@inertiajs/react';
import {
    CalendarCheck, CalendarDays, ChevronsRight, Euro, MapPin, MessageCircle
} from 'lucide-react';
import * as React from 'react';

// --- typy takie jak w swiperze ---
type OfferApi = {
    id: number | string;
    title: string;
    city?: string | null;
    country?: string | null;
    start_date?: string | null;
    duration?: string | null;
    language?: string | null;
    wage?: string | null;
};

// Laravel paginator shape (minimal potrzebny nam wycinek)
type Paginator<T> = {
    data: T[];
    links?: Array<{ url: string | null; label: string; active: boolean }>;
    meta?: any;
};

// Przyjmujemy tablicę LUB paginator
type Props = { offers: OfferApi[] | Paginator<OfferApi> };

// /offers
export default function OffersIndex({ offers }: Props) {
    // SSR-safe ciemny motyw
    const isDarkMode =
        typeof window !== 'undefined' &&
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches;

    // normalizacja źródła
    const src: OfferApi[] = Array.isArray(offers) ? offers : (offers?.data ?? []);

    const items = src.map((o) => ({
        id: o.id,
        title: o.title,
        wage: o.wage ?? '—',
        start_date: o.start_date ?? 'do ustalenia',
        city_line: [o.city, o.country].filter(Boolean).join(', ') || '—',
        language: o.language ?? '—',
        duration: o.duration ?? '—',
        href: `/offers/${o.id}`,
    }));

    // linki paginatora (jeśli przyszły)
    const links = Array.isArray(offers) ? [] : (offers?.links ?? []);

    return (
        <section className="select-none px-3 sm:px-4">
            <header className="mb-6 text-center">
                <h1 className={`text-4xl md:text-6xl leading-tight tracking-tight ${isDarkMode ? 'text-white' : ''}`}>
                    Oferty pracy
                </h1>
                <p className="mt-1 text-xl md:text-3xl text-sea">sprawdź nowości</p>
            </header>

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
                                const base =
                                    'px-3 py-1.5 rounded-full text-sm ring-1 ring-black/10';
                                const active = l.active
                                    ? 'bg-coral text-white'
                                    : 'bg-white text-foreground hover:bg-black/5';
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
    );
}

// — karta oferty (styling jak w sliderze) —
function OfferCard({
                       slide,
                   }: {
    slide: {
        id: number | string;
        title: string;
        wage: string;
        start_date: string;
        city_line: string;
        language: string;
        duration: string;
        href: string;
    };
}) {
    const go = () => router.visit(slide.href);

    return (
        <article className="flex justify-center">
            <div
                className="relative w-full cursor-pointer flex flex-col
                   rounded-3xl md:rounded-[5rem]
                   bg-white dark:bg-white dark:text-black
                   px-6 md:px-10 py-6 md:py-10
                   shadow-[0_14px_28px_-10px_rgb(0_0_0/0.18),0_48px_80px_-24px_rgb(0_0_0/0.26)]
                   md:shadow-[0_20px_36px_-12px_rgb(0_0_0/0.18),0_72px_120px_-28px_rgb(0_0_0/0.28)]
                   ring-1 ring-black/10 md:ring-black/5"
                onClick={go}
                role="link"
                tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && go()}
                aria-label={`Zobacz ofertę: ${slide.title}`}
            >
                {/* miękka elipsa cienia pod kartą */}
                <span
                    aria-hidden
                    className="pointer-events-none absolute -z-10 inset-x-10 -bottom-6 h-10
                     rounded-full bg-black/20 blur-2xl
                     md:inset-x-16 md:-bottom-7 md:h-12"
                />
                <h3 className="text-center uppercase tracking-wide text-coral text-xl md:text-2xl font-extrabold">
                    {slide.title}
                </h3>

                <div className="mt-5 grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2">
                    <ul className="space-y-2 sm:space-y-3">
                        <Li icon={Euro}>{slide.wage}</Li>
                        <Li icon={CalendarCheck}>{slide.start_date}</Li>
                        <Li icon={MapPin}>{slide.city_line}</Li>
                    </ul>
                    <ul className="space-y-2 sm:space-y-3">
                        <Li icon={CalendarDays}>{slide.duration}</Li>
                        <Li icon={MessageCircle}>{slide.language}</Li>
                    </ul>
                </div>

                <Link
                    href={slide.href}
                    onClick={(e) => e.stopPropagation()}
                    className="group mx-auto mt-6 inline-flex items-center rounded-full
                     bg-coral px-5 py-2.5
                     text-base font-semibold text-white shadow-md
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
