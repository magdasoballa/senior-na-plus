import { useEffect, useState } from "react";

export default function useCookieConsent(key: string = "cookie_consent") {
    const [accepted, setAccepted] = useState<boolean>(() => {
        if (typeof window === "undefined") return false;
        return localStorage.getItem(key) === "accepted";
    });

    useEffect(() => {
        const onAccepted = () => setAccepted(true);
        const onStorage = (e: StorageEvent) => {
            if (e.key === key && e.newValue === "accepted") setAccepted(true);
        };
        window.addEventListener("cookie-consent:accepted", onAccepted);
        window.addEventListener("storage", onStorage);
        return () => {
            window.removeEventListener("cookie-consent:accepted", onAccepted);
            window.removeEventListener("storage", onStorage);
        };
    }, [key]);

    return accepted;
}
