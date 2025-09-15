// resources/js/components/AboutSection.tsx
import { Check } from "lucide-react";
import ONasBanner from './onas-banner';
import OferujemyBanner from './oferujemy';

type TeamMember = { name: string; title: string; photo: string };

const offers = [
    "Indywidualne podejście",
    "Legalne i transparentne zatrudnienie",
    "Wsparcie na każdym etapie",
    "Sprawdzone zlecenia",
    "Wysokie wynagrodzenie",
    "Stały kontakt z koordynatorem",
    "Ubezpieczenie",
    "Pokrycie kosztów przejazdu",
    "Zakwaterowanie i wyżywienie",
    "Oferty na terenie całych Niemiec",
    "Premie",
];

const team: TeamMember[] = [
    { name: "Ewa Grędzińska", title: "Specjalista ds. rekrutacji", photo: "/images/pracownik.jpg" },
    { name: "Agata Zabulska", title: "Specjalista ds. rekrutacji", photo: "/images/pracownik.jpg" },
    { name: "Dorota Szulcek", title: "Specjalista ds. rekrutacji", photo: "/images/pracownik.jpg" },
    { name: "Agnieszka Thim", title: "Specjalista ds. rekrutacji", photo: "/images/pracownik.jpg" },
];

const AboutSection = () => {
    return (
        <section className="bg-[#FDFDFC] text-[#1b1b18]">
            <div className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
                {/* Nagłówki */}
                <div className="text-center">
                    <h2 className="text-4xl font-semibold tracking-tight text-slate-800 sm:text-5xl">o nas</h2>
                    <p className="mt-1 text-2xl text-emerald-700/70 sm:text-3xl">poznajmy się</p>
                </div>

                {/* Hero obraz */}
                <div className="mt-6 flex justify-center">
                   <ONasBanner />
                </div>

                {/* Tekst */}
                <div className="mt-6 text-justify leading-8 text-slate-700">
                    <p>
                        <strong>Senior na Plus</strong> to agencja zatrudnienia specjalizująca się w rekrutacji i
                        pośrednictwie pracy dla opiekunów osób starszych. Naszą misją jest łączenie
                        wykwalifikowanych i empatycznych opiekunów z rodzinami, które potrzebują profesjonalnej i
                        troskliwej opieki dla swoich bliskich. Wiemy, jak ważne jest poczucie bezpieczeństwa i komfort
                        seniorów, dlatego dbamy o to, by każda współpraca była oparta na zaufaniu, doświadczeniu i
                        indywidualnym podejściu.
                    </p>
                </div>

                {/* Drugi hero + lista ofert */}
                <div className="mt-10">
                  <OferujemyBanner />

                    <div className="mt-6 justify-center items-center  flex flex-col">
                        <h3 className="font-extrabold tracking-tight text-slate-900">OFERUJEMY:</h3>
                        <ul className="mt-3 space-y-2 text-slate-700 ">
                            {offers.map((item) => (
                                <li key={item} className="flex gap-3 ">
                                    <Check className="mt-1 h-7 w-7 flex-none" aria-hidden="true" />
                                    <span className='text-xl'>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* CTA linijka */}
                <p className="mt-6 text-center text-3xl font-extrabold text-coral">
                    Senior na Plus to właściwe miejsce dla Ciebie! Zapraszamy do współpracy!
                </p>

                {/* Zespół */}
                <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {team.map((p) => (
                        <div key={p.name} className="flex flex-col items-center justify-center gap-4 rounded-2xl  p-4  ">
                            <img
                                src={p.photo}
                                alt={p.name}
                                className="h-40 w-40 flex-none rounded-full object-cover "
                            />
                            <div className='justify-center items-center flex flex-col'>
                                <div className="font-extrabold text-lg text-slate-900">{p.name} </div>
                                <div className="text-lg text-slate-600">{p.title}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default AboutSection
