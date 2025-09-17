import { Link, router } from '@inertiajs/react';
import {
    CalendarCheck, CalendarDays, ChevronLeft, ChevronRight,
    ChevronsRight, Euro, MapPin, MessageCircle
} from 'lucide-react';
import * as React from 'react';

// to co dostajemy z backendu (snake_case)
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
    }));

    const [index, setIndex] = React.useState(0);
    const clamp = (n: number) => Math.max(0, Math.min(n, Math.max(slides.length - 1, 0)));
    const prev = () => setIndex((i) => clamp(i - 1));
    const next = () => setIndex((i) => clamp(i + 1));

    // klawiatura
    React.useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') prev();
            if (e.key === 'ArrowRight') next();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    // swipe na mobile
    const startRef = React.useRef<number | null>(null);
    const onTouchStart = (e: React.TouchEvent) => { startRef.current = e.touches[0].clientX; };
    const onTouchMove  = (e: React.TouchEvent) => {
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
                <h2 className="text-3xl md:text-6xl leading-tight tracking-tight">Oferty pracy</h2>
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
                {/* Strzałki – ukryte na mobile */}
                <button
                    aria-label="Poprzednia oferta"
                    onClick={prev}
                    disabled={index === 0}
                    className="hidden sm:flex absolute top-1/2 left-2 -translate-y-1/2 z-10 rounded-full bg-coral p-3 text-white shadow-md ring-1 ring-black/10 disabled:pointer-events-none disabled:opacity-40"
                    type="button"
                >
                    <ChevronLeft className="h-5 w-5" />
                </button>

                <button
                    aria-label="Następna oferta"
                    onClick={next}
                    disabled={index === slides.length - 1}
                    className="hidden sm:flex absolute top-1/2 right-2 -translate-y-1/2 z-10 rounded-full bg-coral p-3 text-white shadow-md ring-1 ring-black/10 disabled:pointer-events-none disabled:opacity-40"
                    type="button"
                >
                    <ChevronRight className="h-5 w-5" />
                </button>

                {/* Tor slajdów: pełne 100% + overflow-hidden -> nic nie wystaje */}
                <div className="overflow-hidden rounded-2xl md:rounded-[2rem]" aria-live="polite">
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
                <div className="mt-3 flex items-center justify-center gap-2">
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setIndex(i)}
                            aria-label={`Przejdź do slajdu ${i + 1}`}
                            aria-current={i === index ? 'true' : undefined}
                            className={[
                                'h-2.5 w-2.5 rounded-full ring-1 ring-black/10 transition',
                                i === index ? 'bg-coral scale-110' : 'bg-blush'
                            ].join(' ')}
                        />
                    ))}
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
    };
}) {
    const go = () => router.visit(slide.href);

    return (
        // Slajd MA dokładnie 100% szerokości toru; zero poziomego paddingu tutaj
        <article className="basis-full flex-none py-3 sm:py-4">
            <div
                className="relative mx-auto w-full md:w-[70%] cursor-pointer flex flex-col
                   rounded-3xl md:rounded-[7rem]
                   bg-white dark:bg-white dark:text-black
                   px-3 sm:px-4 md:px-10 py-4 sm:py-6 md:py-10
                   shadow-[0_8px_18px_-8px_rgb(0_0_0/0.18),0_24px_60px_-20px_rgb(0_0_0/0.25)]
                   md:shadow-[0_12px_24px_-8px_rgb(0_0_0/0.18),0_40px_90px_-20px_rgb(0_0_0/0.28)]
                   ring-1 ring-black/10"
                onClick={go}
                role="link"
                tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && go()}
                aria-label={`Zobacz ofertę: ${slide.title}`}
            >
                <h3 className="text-center uppercase tracking-wide text-coral text-lg sm:text-xl md:text-2xl font-extrabold">
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
                    className="group mx-auto mt-6 sm:mt-8 inline-flex items-center rounded-full
                     bg-coral px-4 py-2 sm:px-5 sm:py-2.5
                     text-sm sm:text-base font-semibold text-white shadow-md
                     ring-1 ring-black/10 transition hover:opacity-95
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral"
                >
                    <span className="text-base sm:text-lg md:text-xl font-extrabold tracking-wide text-white">SPRAWDŹ</span>
                    <span className="ml-3 grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-full bg-black/10 ring-1 ring-black/10 transition-transform group-hover:translate-x-0.5">
            <ChevronsRight className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
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
        <li className={`flex items-center gap-2 sm:gap-3 rounded-lg px-2.5 sm:px-3 py-2 ${className}`}>
            <Icon className="h-5 w-5 text-blush" />
            <span className="text-[14px] sm:text-[15px] font-medium">{children}</span>
        </li>
    );
}
