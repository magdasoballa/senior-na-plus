import { Link, router } from '@inertiajs/react';
import {
    ChevronLeft,
    ChevronRight,
    ChevronsRight,
} from 'lucide-react';
import * as React from 'react';
import Euro from '../../../public/icons/euro';
import Termin from '../../../public/icons/termin';
import Miasto from '../../../public/icons/miasto';
import Jezyk from '../../../public/icons/jezyk';
import Kalendarz from '../../../public/icons/kalendarz';
import Podopieczna from '../../../public/icons/podopieczna';
import Mobilna from '../../../public/icons/mobilna';
import Samotna from '../../../public/icons/samotna';

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
    lives_alone?: boolean | 'yes' | 'no' | null;
};

type Props = { offers: OfferApi[] };

export default function OffersSwiper({ offers }: Props) {
    // mapowanie danych do kart
    const slides = (offers ?? []).map((o) => ({
        id: o.id,
        title: o.title,
        wage: o.wage ?? '—',
        start_date: o.start_date ?? 'do ustalenia',
        city_line: [o.city, o.country].filter(Boolean).join(', ') || '—',
        language: o.language ?? '—',
        duration: o.duration ?? '—',
        href: `/offers/${o.id}`,

        // WYLICZONE ETYKIETY NA KARTĘ:
        gender_label:
            o.care_recipient_gender === 'female'
                ? 'podopieczna'
                : o.care_recipient_gender === 'male'
                    ? 'podopieczny'
                    : '—',

        mobility_label:
            o.mobility === 'mobile'
                ? 'mobilna'
                : o.mobility === 'limited'
                    ? 'częściowo mobilna'
                    : o.mobility === 'immobile'
                        ? 'niemobilna'
                        : '—',

        living_label:
            o.lives_alone === true || o.lives_alone === 'yes'
                ? 'samotna'
                : o.lives_alone === false || o.lives_alone === 'no'
                    ? 'nie samotna'
                    : '—',
    }));

    const [index, setIndex] = React.useState(0);
    const clamp = (n: number) => ((n % slides.length) + slides.length) % slides.length; // Zapętlanie indeksu
    const prev = () => setIndex((i) => clamp(i - 1));
    const next = () => setIndex((i) => clamp(i + 1));
    const isDarkMode = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Stan automatycznego przesuwania
    const [isInteracting, setIsInteracting] = React.useState(false);
    const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

    // Uruchomienie automatycznego przesuwania
    React.useEffect(() => {
        if (slides.length > 1 && !isInteracting) {
            intervalRef.current = setInterval(() => {
                setIndex((i) => clamp(i + 1));
            }, 5000); // Przesuwanie co 5 sekund
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [slides.length, isInteracting]);

    // Zatrzymanie automatycznego przesuwania podczas interakcji
    const handleInteractionStart = () => {
        setIsInteracting(true);
        if (intervalRef.current) clearInterval(intervalRef.current);
    };

    // Wznowienie automatycznego przesuwania po krótkim czasie bez interakcji
    const handleInteractionEnd = () => {
        setIsInteracting(false);
        // Poczekaj 2 sekundy przed wznowieniem
        setTimeout(() => {
            if (!isInteracting && slides.length > 1) {
                intervalRef.current = setInterval(() => {
                    setIndex((i) => clamp(i + 1));
                }, 5000);
            }
        }, 2000);
    };

    // klawiatura
    React.useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            handleInteractionStart();
            if (e.key === 'ArrowLeft') prev();
            if (e.key === 'ArrowRight') next();
            handleInteractionEnd();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    // swipe na mobile
    const startRef = React.useRef<number | null>(null);
    const onTouchStart = (e: React.TouchEvent) => {
        handleInteractionStart();
        startRef.current = e.touches[0].clientX;
    };
    const onTouchMove = (e: React.TouchEvent) => {
        if (startRef.current == null) return;
        const dx = e.touches[0].clientX - startRef.current;
        // jeśli przesuwamy poziomo bardziej niż pionowo, blokuj scroll strony
        if (Math.abs(dx) > 10) e.preventDefault();
    };
    const onTouchEnd = (e: React.TouchEvent) => {
        if (startRef.current == null) return;
        const dx = e.changedTouches[0].clientX - startRef.current;
        const threshold = 48;
        if (dx < -threshold) next();
        if (dx > threshold) prev();
        startRef.current = null;
        handleInteractionEnd();
    };

    // Kliknięcia na strzałki i kropki
    const handleClick = () => {
        handleInteractionStart();
        handleInteractionEnd();
    };

    if (slides.length === 0) {
        return (
            <section className="px-3">
                <header className="mb-4 text-center">
                    <h2 className="text-2xl md:text-4xl font-semibold tracking-tight">Oferty pracy</h2>
                    <p className="mt-1 text-base md:text-xl text-sea">sprawdź nowości</p>
                </header>
                <p className="text-center text-foreground/70">Brak ofert do wyświetlenia.</p>
            </section>
        );
    }

    return (
        <section className="select-none px-3 sm:px-4">
            <header className="mb-4 sm:mb-6 text-center">
                <h2 className={`text-3xl md:text-6xl leading-tight tracking-tight ${isDarkMode ? 'text-white' : ''}`}>Oferty pracy</h2>
                <p className="mt-1 text-lg md:text-3xl text-sea">sprawdź nowości</p>
            </header>

            <div
                className="relative"
                role="region"
                aria-roledescription="carousel"
                aria-label="Slider ofert"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                {/* Strzałki – ukryte na mobile poniżej 640px */}
                <button
                    aria-label="Poprzednia oferta"
                    onClick={() => { handleClick(); prev(); }}
                    className="hidden sm:flex absolute top-1/2 left-2 -translate-y-1/2 z-10 rounded-full bg-coral p-2 text-white shadow-sm ring-1 ring-black/10 disabled:pointer-events-none disabled:opacity-40 md:p-3"
                    type="button"
                >
                    <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
                </button>

                <button
                    aria-label="Następna oferta"
                    onClick={() => { handleClick(); next(); }}
                    className="hidden sm:flex absolute top-1/2 right-2 -translate-y-1/2 z-10 rounded-full bg-coral p-2 text-white shadow-md ring-1 ring-black/10 disabled:pointer-events-none disabled:opacity-40 md:p-3"
                    type="button"
                >
                    <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
                </button>

                {/* Tor slajdów: pełne 100% + overflow-hidden -> nic nie wystaje */}
                <div className="overflow-hidden rounded-xl sm:rounded-2xl md:rounded-[2rem]" aria-live="polite">
                    <div
                        className="flex transition-transform duration-300 ease-out"
                        style={{ transform: `translateX(-${index * 100}%)` }}
                    >
                        {slides.map((s) => (
                            <SlideCard key={s.id} slide={s} />
                        ))}
                    </div>
                </div>

                {/* Kropki */}
                <div className="mt-2 sm:mt-3 flex items-center justify-center gap-1 sm:gap-2">
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => { handleClick(); setIndex(i); }}
                            aria-label={`Przejdź do slajdu ${i + 1}`}
                            aria-current={i === index ? 'true' : undefined}
                            className={[
                                'h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full ring-1 ring-black/10 transition',
                                i === index ? 'bg-coral scale-110' : 'bg-blush'
                            ].join(' ')}
                        />
                    ))}
                </div>
                <div className="mt-4 sm:mt-6 flex justify-center">
                    <Link
                        href="/offers"
                        className="inline-flex items-center justify-center rounded-full
               bg-coral px-4 sm:px-6 py-1 sm:py-2
               text-lg sm:text-xl md:text-3xl font-extrabold tracking-wide text-white
               shadow-md ring-1 ring-black/10 transition hover:opacity-95
               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral"
                        aria-label="Zobacz wszystkie zlecenia"
                    >
                        WSZYSTKIE ZLECENIA
                    </Link>
                </div>
            </div>
        </section>
    );
}

function SlideCard({
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
        gender_label: string;
        mobility_label: string;
        living_label: string;
    };
}) {
    const go = () => router.visit(slide.href);

    return (
        // Slajd MA dokładnie 100% szerokości toru; zero poziomego paddingu tutaj
        <article className="basis-full flex-none py-2 sm:py-3">
            <div
                className="relative mx-auto w-full md:w-[70%] cursor-pointer flex flex-col
             rounded-xl sm:rounded-3xl md:rounded-[7rem]
             bg-white dark:bg-white dark:text-black
             px-2 sm:px-3 md:px-10 py-3 sm:py-4 md:py-10
             shadow-[0_4px_12px_-2px_rgb(0_0_0/0.1),0_12px_24px_-6px_rgb(0_0_0/0.12)] sm:shadow-[0_8px_16px_-4px_rgb(0_0_0/0.12),0_24px_48px_-12px_rgb(0_0_0/0.14)] md:shadow-[0_10px_36px_-12px_rgb(0_0_0/0.18),0_72px_120px_-28px_rgb(0_0_0/0.28)]
             ring-1 ring-black/5 sm:ring-black/10 md:ring-black/5
             transition-all duration-200 hover:shadow-[0_8px_24px_-4px_rgb(0_0_0/0.15)]"
                onClick={go}
                role="link"
                tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && go()}
                aria-label={`Zobacz ofertę: ${slide.title}`}
            >
                <h3 className="text-center uppercase tracking-wide text-coral text-base sm:text-lg md:text-2xl font-extrabold">
                    {slide.title}
                </h3>

                <div className="mt-3 sm:mt-5 grid grid-cols-1 gap-2 sm:gap-3 sm:grid-cols-2">
                    <ul className="space-y-1 sm:space-y-2">
                        <Li icon={Euro}>{slide.wage}</Li>
                        <Li icon={Termin}>{slide.start_date}</Li>
                        <Li icon={Miasto}>{slide.city_line}</Li>
                        <Li icon={Jezyk}>{slide.language}</Li>
                    </ul>
                    <ul className="space-y-1 sm:space-y-2">
                        <Li icon={Kalendarz}>{slide.duration}</Li>
                        <Li icon={Podopieczna}>{slide.gender_label}</Li>
                        <Li icon={Mobilna}>{slide.mobility_label}</Li>
                        <Li icon={Samotna}>{slide.living_label}</Li>
                    </ul>
                </div>

                <Link
                    href={slide.href}
                    onClick={(e) => e.stopPropagation()}
                    className="group mx-auto mt-4 sm:mt-6 inline-flex items-center rounded-full
                     bg-coral px-3 sm:px-4 py-1.5 sm:py-2
                     text-sm font-semibold text-white shadow-md
                     ring-1 ring-black/10 transition hover:opacity-95
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral"
                >
                    <span className="text-base font-extrabold tracking-wide text-white">SPRAWDŹ</span>
                    <span className="ml-2 grid h-6 w-6 sm:h-8 sm:w-8 place-items-center rounded-full bg-black/10 ring-1 ring-black/10 transition-transform group-hover:translate-x-0.5">
                        <ChevronsRight className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
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
        <li className={`flex items-center gap-1 sm:gap-2 rounded-lg px-2 sm:px-2.5 py-1.5 sm:py-2 ${className}`}>
            <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-blush" />
            <span className="text-xs sm:text-[14px] md:text-[15px] font-medium">{children}</span>
        </li>
    );
}
