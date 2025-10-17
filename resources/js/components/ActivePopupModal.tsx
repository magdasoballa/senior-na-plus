// resources/js/components/ActivePopupModal.tsx
import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { usePage, Link } from "@inertiajs/react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";

export type ActivePopup = {
    id: number;
    name: string;
    link: string | null;
    image_url: string | null;
};

type Props = { popup?: ActivePopup | null; muteDays?: number };

export default function ActivePopupModal({ popup, muteDays = 7 }: Props) {
    const { locale } = usePage<{ locale?: string }>().props;
    const [open, setOpen] = useState(false);

    const storageKey = useMemo(
        () => (popup ? `popup_seen_${popup.id}_${locale ?? "default"}` : null),
        [popup?.id, locale]
    );

    useEffect(() => {
        if (!popup || !storageKey) return;
        const raw = typeof window !== "undefined" ? localStorage.getItem(storageKey) : null;
        if (!raw) { setOpen(true); return; }
        try {
            const { until } = JSON.parse(raw) as { until: number };
            if (Date.now() > until) setOpen(true);
        } catch { setOpen(true); }
    }, [popup, storageKey]);

    const markSeenAndClose = () => {
        setOpen(false);
        if (storageKey) {
            const until = Date.now() + muteDays * 24 * 60 * 60 * 1000;
            localStorage.setItem(storageKey, JSON.stringify({ until }));
        }
    };

    if (!popup || !popup.image_url) return null;

    const isExternal = (url: string) => {
        try { const u = new URL(url, window.location.origin); return u.origin !== window.location.origin; }
        catch { return false; }
    };

    // kliknięcie obrazu = przejście pod link (jeśli jest) + zamknięcie modala
    const ClickWrap: React.FC<{ children: React.ReactNode }> = ({ children }) => {
        if (!popup.link) return <>{children}</>;
        return isExternal(popup.link) ? (
            <a
                href={popup.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={markSeenAndClose}
                className="block"
            >
                {children}
            </a>
        ) : (
            <Link href={popup.link} onClick={markSeenAndClose} className="block">
                {children}
            </Link>
        );
    };

    return (
        <Dialog open={open} onOpenChange={(v)=>{ if(!v) markSeenAndClose(); }}>
            <DialogContent className="p-0 bg-transparent border-0 shadow-none max-w-[92vw] md:max-w-[1024px] overflow-hidden">
                <div className="relative mx-auto w-full">
                    <div className="relative overflow-hidden rounded-2xl bg-white shadow-2xl">
                        <ClickWrap>
                            <img
                                src={popup.image_url}
                                alt={popup.name ?? "Popup"}
                                className="block w-full h-auto max-h-[85vh] object-contain cursor-pointer"
                            />
                        </ClickWrap>

                        {/* X w prawym górnym rogu */}
                        <button
                            aria-label="Zamknij"
                            onClick={markSeenAndClose}
                            className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white text-[#18C6C0] border-2 border-[#18C6C0] shadow-sm hover:scale-105 transition"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
