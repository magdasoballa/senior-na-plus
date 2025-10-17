import React, { useEffect, useState } from 'react'

interface CookieConsentModalProps {
    isOpen?: boolean
    onClose?: () => void
}

type Consent = {
    necessary: true
    functional: boolean
    statistics: boolean
    marketing: boolean
}

const STORAGE_KEY = 'cookie_consent'

export default function CookieConsentModal({ isOpen, onClose }: CookieConsentModalProps = {}) {
    const [open, setOpen] = useState(false)
    const [expanded, setExpanded] = useState(false)
    const [consent, setConsent] = useState<Consent>({
        necessary: true,
        functional: false,
        statistics: false,
        marketing: false,
    })

    // Pokaż baner, jeśli brak zapisu; odczytaj poprzednie zgody
    useEffect(() => {
        if (typeof window === 'undefined') return

        if (isOpen !== undefined) {
            setOpen(isOpen)
        } else {
            const saved = localStorage.getItem(STORAGE_KEY)
            if (!saved) setOpen(true)
        }

        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
            try {
                const parsed = JSON.parse(saved)
                setConsent({
                    necessary: true,
                    functional: !!(parsed.functional ?? parsed.performance),
                    statistics: !!parsed.statistics,
                    marketing: !!(parsed.marketing ?? parsed.targeting),
                })
            } catch {
                /* ignore */
            }
        }
    }, [isOpen])

    const persist = (c: Consent) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(c))
        setConsent(c)
    }

    const close = () => {
        setOpen(false)
        onClose?.()
    }

    const persistAndClose = (c: Consent, emitAcceptedEvent = false) => {
        persist(c)
        if (emitAcceptedEvent) {
            // poinformuj aplikację, że zgoda została udzielona
            window.dispatchEvent(new Event('cookie-consent:accepted'))
        }
        close()
    }

    const handleAcceptAll = () =>
        persistAndClose({ necessary: true, functional: true, statistics: true, marketing: true }, true)

    const handleRejectAll = () =>
        persistAndClose({ necessary: true, functional: false, statistics: false, marketing: false }, false)

    const handleSave = () =>
        // traktujemy jako zgodę (może być tylko „necessary” lub z dodatkowymi)
        persistAndClose({ ...consent, necessary: true }, true)

    if (!open) return null

    return (
        <div className="fixed inset-0 z-[9999] flex items-start justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="cookie-title"
                className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl"
            >
                {/* Opis */}
                <div className="space-y-3">
                    <p id="cookie-title" className="sr-only">
                        Zgody na pliki cookies
                    </p>

                    <p className="text-sm leading-6 text-gray-700">
                        Serwis <strong>seniornaplus.pl</strong> korzysta z plików cookies w celu poprawy komfortu
                        korzystania oraz do przechowywania lub uzyskiwania dostępu do informacji o Twoim urządzeniu.
                        Niezbędne pliki cookies są wymagane do działania serwisu. Dodatkowe pliki (funkcjonalne, statystyczne,
                        marketingowe) wykorzystywane są wyłącznie za Twoją zgodą. Zgodę możesz w każdej chwili wycofać w ustawieniach
                        przeglądarki. Więcej informacji znajdziesz w&nbsp;
                        <a href="/privacy-policy" className="underline text-gray-900 hover:text-black">
                            Polityce Prywatności
                        </a>
                        .
                    </p>

                    {/* Akcje główne */}
                    <div className="space-y-2">
                        <button
                            type="button"
                            onClick={handleAcceptAll}
                            className="w-full rounded-md bg-gray-900 px-4 py-3 text-sm font-semibold text-white shadow hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-400"
                        >
                            Włącz wszystko i przejdź do serwisu
                        </button>

                        <button
                            type="button"
                            aria-expanded={expanded}
                            onClick={() => setExpanded((v) => !v)}
                            className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400"
                        >
                            Zarządzaj zgodami na pliki cookies
                        </button>
                    </div>
                </div>

                {/* Preferencje (rozwijane) */}
                {expanded && (
                    <div className="mt-4 space-y-4">
                        {/* Niezbędne */}
                        <ConsentRow
                            label={<span className="font-semibold">niezbędne</span>}
                            description="Konieczne do funkcjonowania serwisu."
                            checked
                            disabled
                        />

                        {/* Funkcjonalne */}
                        <ConsentRow
                            label={<span className="font-semibold">funkcjonalne</span>}
                            description="Umożliwiają zapamiętywanie Twoich ustawień i preferencji."
                            checked={consent.functional}
                            onChange={(v) => setConsent((c) => ({ ...c, functional: v }))}
                        />

                        {/* Statystyczne */}
                        <ConsentRow
                            label={<span className="font-semibold">statystyczne</span>}
                            description="Służą do anonimowej analizy ruchu i wydajności serwisu."
                            checked={consent.statistics}
                            onChange={(v) => setConsent((c) => ({ ...c, statistics: v }))}
                        />

                        {/* Marketingowe */}
                        <ConsentRow
                            label={<span className="font-semibold">marketingowe</span>}
                            description="Pomagają dopasować treści reklamowe do Twoich zainteresowań."
                            checked={consent.marketing}
                            onChange={(v) => setConsent((c) => ({ ...c, marketing: v }))}
                        />

                        {/* Stopka preferencji */}
                        <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                            <button
                                type="button"
                                onClick={handleSave}
                                className="rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-400"
                            >
                                Zapisz wybory i przejdź
                            </button>
                            <button
                                type="button"
                                onClick={handleRejectAll}
                                className="text-sm text-gray-700 underline underline-offset-2 hover:text-black"
                            >
                                Brak zgody
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

function ConsentRow({
                        label,
                        description,
                        checked,
                        onChange,
                        disabled,
                    }: {
    label: React.ReactNode
    description: string
    checked?: boolean
    onChange?: (v: boolean) => void
    disabled?: boolean
}) {
    return (
        <div className="rounded-md border border-gray-200 p-3">
            <label className="flex items-start gap-3">
                <input
                    type="checkbox"
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-2 focus:ring-gray-400"
                    checked={!!checked}
                    onChange={(e) => onChange?.(e.target.checked)}
                    disabled={disabled}
                />
                <div className={`flex-1 ${disabled ? 'opacity-80' : ''}`}>
                    <div className="text-sm text-gray-900">{label}</div>
                    <div className="mt-1 text-sm leading-5 text-gray-600">{description}</div>
                </div>
            </label>
        </div>
    )
}
