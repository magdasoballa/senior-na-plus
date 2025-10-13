import * as React from "react";
import AppLayout from '@/layouts/app-layout';

type Partner = {
    id: string;
    name: string;
    logo?: string;
    website?: string;
    description?: string;
    category?: string;
};

type Props = {
    partners?: Partner[];
    title?: string;
    subtitle?: string;
    className?: string;
    showCategories?: boolean;
};

export default function PartnersList({
                                         partners = defaultPartners,
                                         title = "Nasi partnerzy handlowi",
                                         subtitle = "Firmy i organizacje, z którymi współpracujemy",
                                         className = "",
                                         showCategories = false,
                                     }: Props) {
    // Grupowanie partnerów według kategorii (jeśli włączone)
    const groupedPartners = showCategories
        ? partners.reduce((acc, partner) => {
            const category = partner.category || "Inni partnerzy";
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(partner);
            return acc;
        }, {} as Record<string, Partner[]>)
        : null;

    return (
        <AppLayout>
        <div className={`bg-white py-12 ${className}`}>
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                {/* Nagłówek */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        {title}
                    </h2>
                    {subtitle && (
                        <p className="mt-4 text-lg text-gray-600">
                            {subtitle}
                        </p>
                    )}
                </div>

                {/* Lista partnerów */}
                <div className="space-y-8">
                    {showCategories && groupedPartners ? (
                        // Wersja z kategoriami
                        Object.entries(groupedPartners).map(([category, categoryPartners]) => (
                            <div key={category} className="border-b border-gray-200 pb-8 last:border-b-0">
                                <h3 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-100">
                                    {category}
                                </h3>
                                <div className="space-y-4">
                                    {categoryPartners.map((partner) => (
                                        <PartnerListItem key={partner.id} partner={partner} />
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        // Wersja prosta - wszystkie partnerzy razem
                        <div className="space-y-4">
                            {partners.map((partner) => (
                                <PartnerListItem key={partner.id} partner={partner} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Call to action */}
                <div className="mt-12 text-center">
                    <div className="bg-gray-50 rounded-lg p-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                            Chcesz dołączyć do grona naszych partnerów?
                        </h3>
                        <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
                            Jesteśmy otwarci na współpracę z firmami i organizacjami
                            działającymi w obszarze opieki nad osobami starszymi.
                        </p>
                        <a
                            href="/kontakt"
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-coral hover:bg-coral/90 shadow-sm transition-colors"
                        >
                            Skontaktuj się z nami
                        </a>
                    </div>
                </div>
            </div>
        </div>
        </AppLayout>
    );
}

function PartnerListItem({ partner }: { partner: Partner }) {
    return (
        <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
            {/* Logo/Inicjał */}
            <div className="flex-shrink-0">
                {partner.logo ? (
                    <div className="h-12 w-12 rounded-lg bg-white p-2 shadow-sm">
                        <img
                            className="h-8 w-8 object-contain"
                            src={partner.logo}
                            alt={`Logo ${partner.name}`}
                        />
                    </div>
                ) : (
                    <div className="h-12 w-12 rounded-lg bg-coral flex items-center justify-center shadow-sm">
                        <span className="text-white font-bold text-sm">
                            {partner.name.charAt(0)}
                        </span>
                    </div>
                )}
            </div>

            {/* Informacje o partnerze */}
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            {partner.website ? (
                                <a
                                    href={partner.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-coral transition-colors duration-200"
                                >
                                    {partner.name}
                                </a>
                            ) : (
                                partner.name
                            )}
                        </h3>
                        {partner.description && (
                            <p className="mt-1 text-sm text-gray-600">
                                {partner.description}
                            </p>
                        )}
                    </div>

                    {/* Link do strony */}
                    {partner.website && (
                        <a
                            href={partner.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-4 flex-shrink-0 inline-flex items-center text-sm text-coral hover:text-coral/80 font-medium whitespace-nowrap"
                        >
                            Strona WWW
                            <svg
                                className="ml-1 h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                            </svg>
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}

// Alternatywna wersja z bardziej kompaktowym layoutem
export function CompactPartnersList({
                                        partners = defaultPartners,
                                        title,
                                        className = ""
                                    }: Props) {
    return (
        <div className={`bg-white py-8 ${className}`}>
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                {title && (
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                        {title}
                    </h2>
                )}

                <div className="space-y-3">
                    {partners.map((partner) => (
                        <div
                            key={partner.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                        >
                            <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0 h-8 w-8 bg-coral rounded flex items-center justify-center">
                                    <span className="text-white font-bold text-xs">
                                        {partner.name.charAt(0)}
                                    </span>
                                </div>
                                <span className="font-medium text-gray-900">
                                    {partner.name}
                                </span>
                            </div>

                            {partner.website && (
                                <a
                                    href={partner.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-coral hover:text-coral/80 font-medium"
                                >
                                    Odwiedź
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Domyślna lista partnerów
const defaultPartners: Partner[] = [
    {
        id: "1",
        name: "Pflege GmbH",
        description: "Niemiecka firma specjalizująca się w opiece nad osobami starszymi",
        website: "https://example.com",
        category: "Partnerzy zagraniczni"
    },
    {
        id: "2",
        name: "Care Solutions",
        description: "Dostawca nowoczesnych rozwiązań w opiece zdrowotnej",
        website: "https://example.com",
        category: "Dostawcy rozwiązań"
    },
    {
        id: "3",
        name: "Senior Home",
        description: "Sieć domów opieki dla seniorów w całej Europie",
        website: "https://example.com",
        category: "Partnerzy zagraniczni"
    },
    {
        id: "4",
        name: "MediCare Partners",
        description: "Organizacja wspierająca rozwój usług medycznych",
        website: "https://example.com",
        category: "Organizacje partnerskie"
    },
    {
        id: "5",
        name: "Health & Comfort",
        description: "Producent sprzętu rehabilitacyjnego i pomocniczego",
        website: "https://example.com",
        category: "Dostawcy sprzętu"
    },
    {
        id: "6",
        name: "EuroCare Network",
        description: "Międzynarodowa sieć współpracy w zakresie opieki senioralnej",
        website: "https://example.com",
        category: "Organizacje partnerskie"
    },
    {
        id: "7",
        name: "Comfort Living",
        description: "Dostawca rozwiązań poprawiających komfort życia seniorów",
        website: "https://example.com",
        category: "Dostawcy rozwiązań"
    },
    {
        id: "8",
        name: "Senior Support Fundacja",
        description: "Fundacja wspierająca osoby starsze i ich rodziny",
        website: "https://example.com",
        category: "Organizacje non-profit"
    }
];
