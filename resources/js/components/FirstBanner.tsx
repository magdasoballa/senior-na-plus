import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronsRight } from "lucide-react";
import Baner1 from "./baner1";
import Domek from "../../../public/icons/domek";
import Oferty from "../../../public/icons/oferty";
import Kontakt from "../../../public/icons/kontakt";

type ActionCardProps = {
    title: string;
    icon: React.ReactNode;
    cta?: string;
    /** np. "kontakt" -> przewinie do elementu z id="kontakt" */
    targetId?: string;
    href?: string;
    onClick?: () => void;
};

function ActionCard({
                        title,
                        icon,
                        cta = "SPRAWDŹ",
                        targetId,
                        href,
                        onClick,
                    }: ActionCardProps) {
    const link = href ?? (targetId ? `#${targetId}` : undefined);

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (targetId) {
            e.preventDefault();
            const el = document.getElementById(targetId);
            el?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        onClick?.();
    };

    const card = (
        <Card className="rounded-4xl border-slate-200 shadow-sm transition hover:shadow-md bg-blush">
            <CardContent className="flex flex-col items-center gap-4 p-5">
                <div className="flex items-center justify-center rounded-2xl">
                    {icon}
                </div>
                <div className="text-4xl tracking-tight text-[#22423c] capitalize">
                    {title}
                </div>

                <span className="group inline-flex items-center rounded-full bg-coral px-4 py-2 font-extrabold !text-white shadow-md ring-1 ring-black/10 transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral text-xl">
          {cta}
                    <span className="ml-3 grid h-9 w-9 place-items-center rounded-full bg-black/10 ring-1 ring-black/10 transition-transform group-hover:translate-x-0.5">
            <ChevronsRight className="h-7 w-7 text-white" />
          </span>
        </span>
            </CardContent>
        </Card>
    );

    return link ? (
        <a
            href={link}
            onClick={handleClick}
            className="block rounded-4xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral"
        >
            {card}
        </a>
    ) : (
        card
    );
}

const FirstBanner: React.FC = () => {
    // Ile kafelki mają „najechać” na baner:
    const overlapMobile = "-mt-8";   // ~2rem
    const overlapDesktop = "md:-mt-2"; // ~3rem

    return (
        <section className="relative w-full bg-[#FDFDFC]">
            <div className="pointer-events-none absolute top-10 -right-24 rounded-full" />

            <div className="p-6 sm:p-10">
                {/* Rząd: tekst + obrazek (BANER POD spodem) */}
                <div className="relative z-0 flex flex-col-reverse items-center gap-8 md:flex-row md:items-end">
                    {/* Tekst (lewa kolumna) */}
                    <div className="md:max-w-[40%] md:self-start">
                        <h1 className="text-6xl">
                            <span className="block text-center">Troska i pomoc </span>
                            <span className="block text-center">- Twoja praca,</span>
                            <span className="block text-center">nasza misja!</span>
                        </h1>
                    </div>

                    {/* Obrazek (prawa kolumna) */}
                    <div className="w-full md:flex-1 md:self-stretch flex justify-center md:justify-end">
                        {/* pointer-events-none, żeby kafelki na wierzchu łapały klik */}
                        <Baner1 className="block w-full h-auto pointer-events-none" />
                    </div>
                </div>

                {/* Kafelki NA wierzchu, nasunięte na baner */}
                <div
                    className={`relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4 ${overlapMobile} ${overlapDesktop}`}
                >
                    <ActionCard
                        title="KONTAKT"
                        icon={<Kontakt width="100px" className="max-h-[90px]" />}
                        targetId="kontakt"
                    />

                    <ActionCard
                        title="OFERTY"
                        icon={<Oferty width="100px" className="max-h-[90px]" />}
                        targetId="oferty"
                    />

                    <ActionCard
                        title="O NAS"
                        icon={<Domek width="100px" className="max-h-[90px]" />}
                        targetId="o-nas"
                    />
                </div>
            </div>
        </section>
    );
};

export default FirstBanner;
