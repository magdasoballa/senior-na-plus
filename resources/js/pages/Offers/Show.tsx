import * as React from "react";
import { ChevronsRight } from "lucide-react";
import { Link } from "@inertiajs/react";
import AppLayout from '@/layouts/app-layout';

export type Offer = {
    id: string;
    title: string;
    description: string;
    duties: string[];
    requirements: string[];
    benefits: string[];
};

export default function OfferDetails({ offer }: { offer: Offer }) {
    return (
        <AppLayout>
        <section className="mx-auto w-full max-w-2xl px-3 mb-5">
            <article className="rounded-[2.5rem] border bg-card p-6 md:p-8 shadow-2xl shadow-black/25">
                {/* tytuł oferty (opcjonalnie) */}
                <h1 className="text-center text-xl md:text-2xl font-extrabold text-foreground">
                    {offer.title}
                </h1>

                <Section heading="OPIS ZLECENIA">
                    <p className="text-justify leading-relaxed">{offer.description}</p>
                </Section>

                <Section heading="OBOWIĄZKI">
                    <BulletList items={offer.duties} />
                </Section>

                <Section heading="WYMAGANIA">
                    <BulletList items={offer.requirements} />
                </Section>

                <Section heading="OFERUJEMY">
                    <BulletList items={offer.benefits} />
                </Section>

                {/* CTA – jak na screenie: mint tło, ciemny tekst */}
                <div className="mt-6 flex justify-center">
                    <Link
                        href={'contact'} // <- podmień na swój route/anchor
                        className="group inline-flex items-center rounded-full bg-mint px-8 py-3 text-base font-extrabold text-foreground ring-1 ring-black/10 shadow-md transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint"
                    >
                        WYŚLIJ FORMULARZ
                        <span className="ml-3 grid h-9 w-9 place-items-center rounded-full bg-black/10 ring-1 ring-black/10 transition-transform group-hover:translate-x-0.5">
              <ChevronsRight className="h-4 w-4" />
            </span>
                    </Link>
                </div>
            </article>
        </section>
        </AppLayout>
    );
}

/* ---------- subkomponenty ---------- */

function Section({ heading, children }: React.PropsWithChildren<{ heading: string }>) {
    return (
        <section className="mt-6">
            <h2 className="text-center font-extrabold tracking-wide text-foreground uppercase">
                {heading}
            </h2>
            <div className="mt-3">{children}</div>
        </section>
    );
}

function BulletList({ items }: { items: string[] }) {
    return (
        <ul className="list-disc pl-6 marker:text-foreground/70 space-y-1 text-foreground">
            {items.map((t, i) => (
                <li key={i} className="leading-relaxed">
                    {t}
                </li>
            ))}
        </ul>
    );
}
