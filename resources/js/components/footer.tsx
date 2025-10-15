import * as React from "react";
import { usePage } from "@inertiajs/react";
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
    privacyPolicyUrl?: string;
    termsOfServiceUrl?: string;
};

function isValidHttpUrl(v?: string | null): v is string {
    if (!v) return false;
    try {
        const u = new URL(v);
        return u.protocol === "http:" || u.protocol === "https:";
    } catch {
        return false;
    }
}
function normalizeUrl(v?: string | null): string | null {
    if (!v) return null;
    try { return new URL(v).href; } catch {}
    try { return new URL("https://" + v.replace(/^\/+/, "")).href; } catch { return null; }
}

export default function FooterCard(props: Props) {
    const { portal } = usePage().props as any;

    // 1) Najpierw baza (portal), potem propsy; brak twardych defaultów dla linków
    const brand = props.brand ?? portal?.brand ?? "Senior na plus";

    const addressLinesRaw: string[] =
        props.addressLines ??
        portal?.addressLines ??
        ["ul. Chorzowska 44c", "44-100 Gliwice"];

    const phone: string | undefined =
        props.phone ?? portal?.phone ?? "32 440 15 54";

    const email: string | undefined =
        props.email ?? portal?.email ?? "kontakt@seniornaplus.pl";

    const privacyPolicyUrl: string | null =
        props.privacyPolicyUrl ?? portal?.privacyPolicyUrl ?? null;

    const termsOfServiceUrl: string | null =
        props.termsOfServiceUrl ?? portal?.termsOfServiceUrl ?? null;

    const facebookUrl  = normalizeUrl(props.facebookUrl  ?? portal?.socials?.facebook);
    const instagramUrl = normalizeUrl(props.instagramUrl ?? portal?.socials?.instagram);
    const linkedinUrl  = normalizeUrl(props.linkedinUrl  ?? portal?.socials?.linkedin);

    // 2) Pierwszą linię adresu łamiemy PO numerze domu (np. "44c")
    const addressLines: string[] = React.useMemo(() => {
        if (!addressLinesRaw?.length) return [];
        const first = String(addressLinesRaw[0]).replace(
            /(\b\d+\s*[A-Za-z]?(?:\/\d+\s*[A-Za-z]?)?)\s+/,
            "$1\n"
        );
        return [first, ...addressLinesRaw.slice(1)];
    }, [addressLinesRaw]);

    const footerRef = React.useRef<HTMLElement>(null);

    // 3) Doklej footer do dołu, gdy strona krótsza niż viewport
    React.useEffect(() => {
        const applyStickyGap = () => {
            const footer = footerRef.current;
            if (!footer) return;
            footer.style.marginTop = "0px";
            const gap = window.innerHeight - document.documentElement.scrollHeight;
            footer.style.marginTop = gap > 0 ? `${gap}px` : "0px";
        };
        applyStickyGap();
        window.addEventListener("resize", applyStickyGap);
        window.addEventListener("orientationchange", applyStickyGap);
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
                <AppLogoIcon height="100px" className="mx-auto w-[300px]" />
                {/* <div className="mt-2 text-lg font-semibold">{brand}</div> */}

                <div className="mt-3 space-y-1 text-[17px]">
                    {addressLines.map((line, i) => (
                        <div key={i} className={i === 0 ? "whitespace-pre-line" : undefined}>
                            {line}
                        </div>
                    ))}

                    {phone && (
                        <div>
                            tel.&nbsp;
                            <a
                                href={`tel:${String(phone).replace(/\s+/g, "")}`}
                                className="underline underline-offset-2 hover:opacity-80"
                            >
                                {phone}
                            </a>
                        </div>
                    )}

                    {email && (
                        <div>
                            <a
                                href={`mailto:${email}`}
                                className="underline underline-offset-2 hover:opacity-80"
                            >
                                {email}
                            </a>
                        </div>
                    )}
                </div>

                {/* Linki do Polityki/Regulaminu – pokazuj tylko jeśli backend je podał */}
                <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm text-gray-600">
                    {privacyPolicyUrl && (
                        <a
                            href={privacyPolicyUrl}
                            className="underline underline-offset-2 hover:opacity-80 transition-opacity"
                        >
                            Polityka Prywatności
                        </a>
                    )}
                    {termsOfServiceUrl && (
                        <a
                            href={termsOfServiceUrl}
                            className="underline underline-offset-2 hover:opacity-80 transition-opacity"
                        >
                            Warunki Korzystania
                        </a>
                    )}
                </div>

                {/* Social z bazy social_links (portal.socials) lub propsów */}
                <div className="mt-4 flex items-center justify-center gap-3">
                    {facebookUrl && (
                        <SocialIcon href={facebookUrl} label="Facebook">
                            <Facebook className="h-5 w-5" />
                        </SocialIcon>
                    )}
                    {instagramUrl && (
                        <SocialIcon href={instagramUrl} label="Instagram">
                            <Instagram className="h-5 w-5" />
                        </SocialIcon>
                    )}
                    {linkedinUrl && (
                        <SocialIcon href={linkedinUrl} label="LinkedIn">
                            <Linkedin className="h-5 w-5" />
                        </SocialIcon>
                    )}
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
            rel="noreferrer noopener"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-coral text-white ring-1 ring-black/10 shadow-sm transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral"
        >
            {children}
        </a>
    );
}
