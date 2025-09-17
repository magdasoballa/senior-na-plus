import { Link, router } from '@inertiajs/react';
import { CalendarCheck, CalendarDays, ChevronLeft, ChevronRight, ChevronsRight, Euro, MapPin, MessageCircle } from 'lucide-react';
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
    // zamiana ofert -> dane do wyświetlenia w kartach
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

    const isDarkMode = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;

    const [index, setIndex] = React.useState(0);
    const clamp = (n: number) => Math.max(0, Math.min(n, Math.max(slides.length - 1, 0)));
    const prev = () => setIndex((i) => clamp(i - 1));
    const next = () => setIndex((i) => clamp(i + 1));

    React.useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') prev();
            if (e.key === 'ArrowRight') next();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    if (slides.length === 0) {
        return (
            <section>
                <header className="mb-6 text-center">
                    <h2 className={`text-3xl font-semibold tracking-tight md:text-4xl`}>Oferty pracy</h2>
                    <p className="mt-2 text-lg text-sea md:text-xl">sprawdź nowości</p>
                </header>
                <p className="text-center text-foreground/70">Brak ofert do wyświetlenia.</p>
            </section>
        );
    }

    return (
        <section className="select-none">
            <header className="mb-6 text-center">
                <h2 className={`text-3xl leading-tight font-semibold tracking-tight md:text-4xl dark:text-white ${isDarkMode ? 'text-white' : ''}`}>
                    Oferty pracy
                </h2>
                <p className="mt-2 text-lg text-sea md:text-xl">sprawdź nowości</p>
            </header>

            <div className="relative" role="region" aria-roledescription="carousel" aria-label="Slider ofert">
                <button
                    aria-label="Poprzednia oferta"
                    onClick={prev}
                    disabled={index === 0}
                    className="absolute top-1/2 left-[-14px] z-10 -translate-y-1/2 rounded-full bg-coral p-3 text-white shadow-md ring-1 ring-black/10 disabled:pointer-events-none disabled:opacity-40"
                    type="button"
                >
                    <ChevronLeft className="h-5 w-5" />
                </button>

                <button
                    aria-label="Następna oferta"
                    onClick={next}
                    disabled={index === slides.length - 1}
                    className="absolute top-1/2 right-[-14px] z-10 -translate-y-1/2 rounded-full bg-coral p-3 text-white shadow-md ring-1 ring-black/10 disabled:pointer-events-none disabled:opacity-40"
                    type="button"
                >
                    <ChevronRight className="h-5 w-5" />
                </button>

                <div className=" rounded-[2rem]" aria-live="polite">
                    <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${index * 100}%)` }}>
                        {slides.map((s) => (
                            <SlideCard key={s.id} slide={s} />
                        ))}
                    </div>
                </div>

                <div className="mt-4 flex items-center justify-center gap-2">
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setIndex(i)}
                            aria-label={`Przejdź do slajdu ${i + 1}`}
                            aria-current={i === index ? 'true' : undefined}
                            className={['h-2.5 w-2.5 rounded-full ring-1 ring-black/10', i === index ? 'bg-coral' : 'bg-blush'].join(' ')}
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
        <article className="w-full shrink-0 px-2 py-4 md:px-4">
            <div
                className="relative mx-auto flex cursor-pointer flex-col rounded-[7rem] bg-white p-6 shadow-[0_12px_24px_-8px_rgb(0_0_0/0.18),0_40px_90px_-20px_rgb(0_0_0/0.28)] ring-1 ring-black/5 md:w-[70%] md:p-10 dark:bg-zinc-900 dark:shadow-[0_2px_6px_rgb(0_0_0/0.55),0_24px_70px_-12px_rgb(0_0_0/0.75)] dark:ring-white/10"
                onClick={go}
                role="link"
                tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && go()}
                aria-label={`Zobacz ofertę: ${slide.title}`}
            >
                <h3 className="text-center text-xl font-extrabold tracking-wide text-coral uppercase md:text-2xl">{slide.title}</h3>

                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <ul className="space-y-3">
                        <Li icon={Euro}>{slide.wage}€</Li>
                        <Li icon={CalendarCheck}>{slide.start_date}</Li>
                        <Li icon={MapPin}>{slide.city_line}</Li>
                    </ul>
                    <ul className="space-y-3">
                        <Li icon={CalendarDays}>{slide.duration}</Li>
                        <Li icon={MessageCircle}>{slide.language}</Li>
                    </ul>
                </div>

                <Link
                    href={slide.href}
                    onClick={(e) => e.stopPropagation()}
                    className="group mx-auto mt-8 inline-flex w-max items-center rounded-full bg-coral px-4 py-2 text-sm font-semibold text-white shadow-md ring-1 ring-black/10 transition hover:opacity-95 focus-visible:ring-2 focus-visible:ring-coral focus-visible:outline-none"
                >
                    <span className="text-xl font-extrabold tracking-wide text-white">SPRAWDŹ</span>
                    <span className="ml-3 grid h-9 w-9 place-items-center rounded-full bg-black/10 ring-1 ring-black/10 transition-transform group-hover:translate-x-0.5">
                        <ChevronsRight className="h-7 w-7 text-white" />
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
            <span className="text-[15px] font-medium text-foreground">{children}</span>
        </li>
    );
}
