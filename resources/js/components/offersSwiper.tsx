import * as React from 'react'
import {
    Euro,
    CalendarCheck,
    CalendarDays,
    MapPin,
    MessageCircle,
    User,
    Users,
    Accessibility,
    ChevronsRight,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react'
import { Link, router } from '@inertiajs/react'

/** Dane pojedynczego slajdu */
type Slide = {
    id: string
    title: string
    salary: string
    startDate: string
    city: string
    language: string
    duration: string
    gender: string
    mobility: string
    alone: string
    ctaHref?: string // np. "/offers/1"
}

const defaultSlides: Slide[] = [
    {
        id: '1',
        title: 'DO OPIEKI SENIOR 61 LAT - OFERTA NA 2 TYG',
        salary: '2000€',
        startDate: '15.03.2025',
        city: 'Berlin',
        language: 'dobry',
        duration: '2 tygodnie',
        gender: 'podopieczna',
        mobility: 'mobilna',
        alone: 'samotna',
        ctaHref: '/offers/1',
    },
    {
        id: '2',
        title: 'PANI 83 LATA - WYJAZD OD ZARAZ',
        salary: '1950€',
        startDate: '10.03.2025',
        city: 'Hamburg',
        language: 'komunikatywny',
        duration: '6 tygodni',
        gender: 'podopieczna',
        mobility: 'ograniczona',
        alone: 'nie',
        ctaHref: '/offers/2',
    },
    {
        id: '3',
        title: 'PAN 78 LAT - LEKKA OPIEKA',
        salary: '1700€',
        startDate: '25.03.2025',
        city: 'Monachium',
        language: 'dobry',
        duration: '4 tygodnie',
        gender: 'podopieczny',
        mobility: 'mobilny',
        alone: 'sam',
        ctaHref: '/offers/3',
    },
]

export default function OffersSwiper({ slides = defaultSlides }: { slides?: Slide[] }) {
    const [index, setIndex] = React.useState(0)
    const clamp = (n: number) => Math.max(0, Math.min(n, slides.length - 1))
    const prev = () => setIndex((i) => clamp(i - 1))
    const next = () => setIndex((i) => clamp(i + 1))

    React.useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') prev()
            if (e.key === 'ArrowRight') next()
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [])

    return (
        <section className="mx-auto w-full max-w-3xl select-none">
            {/* nagłówek */}
            <header className="mb-6 text-center">
                <h2 className="text-3xl leading-tight font-semibold tracking-tight md:text-4xl">Oferty pracy</h2>
                <p className="mt-2 text-lg text-sea md:text-xl">sprawdź nowości</p>
            </header>

            <div className="relative" role="region" aria-roledescription="carousel" aria-label="Slider ofert">
                {/* strzałka lewo */}
                <button
                    aria-label="Poprzednia oferta"
                    onClick={prev}
                    disabled={index === 0}
                    className="absolute top-1/2 left-[-14px] z-10 -translate-y-1/2 rounded-full bg-coral p-3 text-white shadow-md ring-1 ring-black/10 disabled:opacity-40 disabled:pointer-events-none"
                    type="button"
                >
                    <ChevronLeft className="h-5 w-5" />
                </button>

                {/* strzałka prawo */}
                <button
                    aria-label="Następna oferta"
                    onClick={next}
                    disabled={index === slides.length - 1}
                    className="absolute top-1/2 right-[-14px] z-10 -translate-y-1/2 rounded-full bg-coral p-3 text-white shadow-md ring-1 ring-black/10 disabled:opacity-40 disabled:pointer-events-none"
                    type="button"
                >
                    <ChevronRight className="h-5 w-5" />
                </button>

                {/* viewport */}
                <div className="overflow-hidden rounded-[2rem]" aria-live="polite">
                    <div
                        className="flex transition-transform duration-500 ease-out"
                        style={{ transform: `translateX(-${index * 100}%)` }}
                    >
                        {slides.map((s) => (
                            <SlideCard key={s.id} slide={s} />
                        ))}
                    </div>
                </div>

                {/* wskaźniki */}
                <div className="mt-4 flex items-center justify-center gap-2">
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setIndex(i)}
                            aria-label={`Przejdź do slajdu ${i + 1}`}
                            aria-current={i === index ? 'true' : undefined}
                            className={[
                                'h-2.5 w-2.5 rounded-full ring-1 ring-black/10',
                                i === index ? 'bg-coral' : 'bg-blush',
                            ].join(' ')}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

/** pojedynczy slajd */
function SlideCard({ slide }: { slide: Slide }) {
    const go = () => {
        if (slide.ctaHref) router.visit(slide.ctaHref)
    }

    return (
        <article className="w-full shrink-0 px-2 py-4 md:px-4">
            <div
                className="relative mx-auto w-[70%] rounded-[7rem] border bg-card p-6 shadow-2xl shadow-black/20 md:p-10 flex flex-col overflow-hidden cursor-pointer"
                onClick={go}
                role="link"
                tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && go()}
                aria-label={`Zobacz ofertę: ${slide.title}`}
            >
                {/* nagłówek slajdu */}
                <h3 className="text-center text-xl font-extrabold tracking-wide text-coral uppercase md:text-2xl">
                    {slide.title}
                </h3>

                {/* dwie kolumny z ikonami */}
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <ul className="space-y-3">
                        <Li icon={Euro}>{slide.salary}</Li>
                        <Li icon={CalendarCheck}>{slide.startDate}</Li>
                        <Li icon={MapPin}>{slide.city}</Li>
                        <Li icon={MessageCircle}>{slide.language}</Li>
                    </ul>
                    <ul className="space-y-3">
                        <Li icon={CalendarDays}>{slide.duration}</Li>
                        <Li icon={User}>{slide.gender}</Li>
                        <Li icon={Accessibility}>{slide.mobility}</Li>
                        <Li icon={Users}>{slide.alone}</Li>
                    </ul>
                </div>

                {/* CTA jako Link – zatrzymujemy propagację, żeby nie odpalić onClick karty */}
                {slide.ctaHref ? (
                    <Link
                        href={slide.ctaHref}
                        onClick={(e) => e.stopPropagation()}
                        className="group mx-auto mt-8 inline-flex w-max items-center rounded-full bg-coral px-4 py-2 text-sm font-semibold text-white shadow-md ring-1 ring-black/10 transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral"
                    >
                        <CtaContent />
                    </Link>
                ) : null}
            </div>
        </article>
    )
}

/* ---------------- helpers ---------------- */

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
    )
}

function CtaContent() {
    return (
        <>
            <span className="font-extrabold tracking-wide text-white text-xl">SPRAWDŹ</span>
            <span className="ml-3 grid h-9 w-9 place-items-center rounded-full bg-black/10 ring-1 ring-black/10 transition-transform group-hover:translate-x-0.5">
        <ChevronsRight className="h-7 w-7 text-white" />
      </span>
        </>
    )
}
