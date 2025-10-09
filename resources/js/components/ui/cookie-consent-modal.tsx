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

const STORAGE_KEY = 'cookieConsent'

export default function CookieConsentModal({ isOpen, onClose }: CookieConsentModalProps = {}) {
    const [open, setOpen] = useState(false)
    const [expanded, setExpanded] = useState(false)
    const [consent, setConsent] = useState<Consent>({
        necessary: true,
        functional: false,
        statistics: false,
        marketing: false,
    })

    // Pokaż baner gdy brak zapisu; odczytaj poprzednie zgody
    useEffect(() => {
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

    const persistAndClose = (c: Consent) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(c))
        setConsent(c)
        setOpen(false)
        onClose?.()
    }

    const handleAcceptAll = () =>
        persistAndClose({ necessary: true, functional: true, statistics: true, marketing: true })

    const handleRejectAll = () =>
        persistAndClose({ necessary: true, functional: false, statistics: false, marketing: false })

    const handleSave = () => persistAndClose({ ...consent, necessary: true })

    if (!open) return null

    return (
        <div className="fixed inset-0 z-[9999] flex items-start justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="cookie-title"
                className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl"
            >
                {/* Opis */}
                <div className="space-y-3">
                    <p id="cookie-title" className="sr-only">
                        Zgody na pliki cookies
                    </p>

                    <p className="text-xs leading-6 text-gray-700">
                        Serwis <strong>seniornaplus.pl</strong> korzysta z plików cookies, w celu poprawy komfortu
                        korzystania przez użytkowników oraz do przechowywania lub uzyskiwania dostępu do informacji
                        o ich urządzeniu. W przeglądarce użytkownika zapisywane są tylko niezbędne do działania
                        podstawowych funkcji serwisu pliki cookies. Witryna korzysta również z innych plików cookies,
                        które pomagają analizować sposób korzystania z serwisu przez użytkowników. Te pliki cookies
                        są zapisywane w przeglądarce użytkownika wyłącznie za jego zgodą, która w każdym czasie może
                        zostać wycofana. Brak zgody lub jej wycofanie może mieć negatywny wpływ na niektóre cechy i
                        funkcje. Więcej na ten temat w&nbsp;
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
                            className="w-full rounded-md bg-gray-900 px-4 py-3 text-xs font-semibold text-white shadow hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-400"
                        >
                            Włącz wszystko i przejdź do serwisu
                        </button>

                        <button
                            type="button"
                            aria-expanded={expanded}
                            onClick={() => setExpanded((v) => !v)}
                            className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400"
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
                            label={
                                <span className="font-semibold">

                  niezbędne
                </span>
                            }
                            description="Konieczne do funkcjonowania serwisu. "
                            checked
                            disabled
                        />

                        {/* Funkcjonalne */}
                        <ConsentRow
                            label={<span className="font-semibold">funkcjonalne pliki cookies</span>}
                            description="Umożliwiają zapisanie ustawień wybranych przez użytkownika."
                            checked={consent.functional}
                            onChange={(v) => setConsent((c) => ({ ...c, functional: v }))}
                        />

                        {/* Statystyczne */}
                        <ConsentRow
                            label={<span className="font-semibold">statystyczne</span>}
                            description="Umożliwiają przechowywanie techniczne lub dostęp, który jest używany wyłącznie do anonimowych celów statystycznych."
                            checked={consent.statistics}
                            onChange={(v) => setConsent((c) => ({ ...c, statistics: v }))}
                        />

                        {/* Marketingowe */}
                        <ConsentRow
                            label={<span className="font-semibold">marketingowe</span>}
                            description="Stosowane w celu śledzenia użytkowników, celem wyświetlania reklam, które mogą być dla nich istotne i interesujące."
                            checked={consent.marketing}
                            onChange={(v) => setConsent((c) => ({ ...c, marketing: v }))}
                        />

                        {/* Akcje w stopce preferencji */}
                        <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                            <button
                                type="button"
                                onClick={handleSave}
                                className="rounded-md bg-gray-900 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-400"
                            >
                                Zapisz wybory i przejdź
                            </button>
                            <button
                                type="button"
                                onClick={handleRejectAll}
                                className="text-xs text-gray-700 underline underline-offset-2 hover:text-black"
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
        <div className="rounded-md border border-gray-200 p-2">
            <label className="flex items-center gap-3">
                <input
                    type="checkbox"
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-2 focus:ring-gray-400"
                    checked={!!checked}
                    onChange={(e) => onChange?.(e.target.checked)}
                    disabled={disabled}
                />
                <div className={`flex-1 ${disabled ? 'opacity-80' : ''}`}>
                    <div className="text-xs text-gray-900">{label}</div>
                    <div className="mt-1 text-xs leading-5 text-gray-600">{description}</div>
                </div>
            </label>
        </div>
    )
}
