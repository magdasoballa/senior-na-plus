import * as React from "react";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import AppLogoIcon from "@/components/app-logo-icon";

type Props = {
    brand?: string;
    addressLines?: string[];
    phone?: string;
    email?: string;
    facebookUrl?: string;
    instagramUrl?: string;
    linkedinUrl?: string;
};

export default function FooterCard({
                                       brand = "Senior na plus",
                                       addressLines = ["ul. Chorzowska 44c", "44-100 Gliwice"],
                                       phone = "32 440 15 54",
                                       email = "kontakt@seniornaplus.pl",
                                       facebookUrl = "#",
                                       instagramUrl = "#",
                                       linkedinUrl = "#",
                                   }: Props) {
    const footerRef = React.useRef<HTMLElement>(null);

    // Doklejenie do dołu tylko, gdy strona jest krótsza niż viewport
    React.useEffect(() => {
        const applyStickyGap = () => {
            // ile brakuje do wysokości okna
            const viewport = window.innerHeight;
            const doc = document.documentElement;
            const page = doc.scrollHeight; // pełna wysokość strony (treść + footer)
            const footer = footerRef.current;

            if (!footer) return;

            // tymczasowo wyzeruj, żeby policzyć "czystą" wysokość strony
            footer.style.marginTop = "0px";

            // przelicz po wyzerowaniu
            const pageWithoutMargin = document.documentElement.scrollHeight;
            const gap = viewport - pageWithoutMargin;

            footer.style.marginTop = gap > 0 ? `${gap}px` : "0px";
        };

        // pierwsze wywołanie + na resize/orientchange
        applyStickyGap();
        window.addEventListener("resize", applyStickyGap);
        window.addEventListener("orientationchange", applyStickyGap);

        // reaguj na zmiany treści (np. obrazki, lazy-load) bez ruszania layoutu wyżej
        const ro = new ResizeObserver(applyStickyGap);
        ro.observe(document.body);

        return () => {
            window.removeEventListener("resize", applyStickyGap);
            window.removeEventListener("orientationchange", applyStickyGap);
            ro.disconnect();
            if (footerRef.current) footerRef.current.style.marginTop = "0px";
        };
    }, []);

    return (
        <footer
            ref={footerRef}
            role="contentinfo"
            className="w-[vw] bg-blush border-t border-black/10"
        >
            <div className="mx-auto max-w-3xl p-6 md:p-8 text-center">
                <AppLogoIcon height="100px" className="mx-auto" />

                <div className="mt-3 space-y-1 text-[17px]">
                    {addressLines.map((line, i) => (
                        <div key={i}>{line}</div>
                    ))}
                    <div>
                        tel.&nbsp;
                        <a
                            href={`tel:${phone.replace(/\s+/g, "")}`}
                            className="underline underline-offset-2 hover:opacity-80"
                        >
                            {phone}
                        </a>
                    </div>
                    <div>
                        <a
                            href={`mailto:${email}`}
                            className="underline underline-offset-2 hover:opacity-80"
                        >
                            {email}
                        </a>
                    </div>
                </div>

                <div className="mt-4 flex items-center justify-center gap-3">
                    <SocialIcon href={facebookUrl} label="Facebook">
                        <Facebook className="h-5 w-5" />
                    </SocialIcon>
                    <SocialIcon href={instagramUrl} label="Instagram">
                        <Instagram className="h-5 w-5" />
                    </SocialIcon>
                    <SocialIcon href={linkedinUrl} label="LinkedIn">
                        <Linkedin className="h-5 w-5" />
                    </SocialIcon>
                </div>
            </div>
        </footer>
    );
}

function SocialIcon({
                        href,
                        label,
                        children,
                    }: React.PropsWithChildren<{ href: string; label: string }>) {
    return (
        <a
            href={href}
            aria-label={label}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-coral text-white ring-1 ring-black/10 shadow-sm transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral"
        >
            {children}
        </a>
    );
}
