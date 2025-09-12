import * as React from "react";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import AppLogoIcon from '@/components/app-logo-icon';

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
    return (
        <footer
            role="contentinfo"
            className="
        relative left-1/2 right-1/2 -mx-[50vw] w-screen
        bg-blush text-foreground
      "
        >
            {/* wewnętrzny kontener na treść */}
            <div className="mx-auto max-w-3xl p-6 md:p-8 text-center">
              <AppLogoIcon  height='100px' className=' mx-auto'/>

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
