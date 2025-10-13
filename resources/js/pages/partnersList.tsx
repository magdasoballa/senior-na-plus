import * as React from "react";
import AppLayout from "@/layouts/app-layout";
import { Link, usePage } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";

type Partner = {
    id: string;
    name: string;
    logo?: string;
    website?: string;
    description?: string;
    category?: string;
};

type Props = {
    partners?: Partner[]; // <- wstrzyknij z bazy w kontrolerze/trasie
    title?: string;
    subtitle?: string;
    className?: string;
    showCategories?: boolean;
    /** opcjonalny override; jeśli nie podasz, bierzemy z props.auth.isAdmin */
    isAdmin?: boolean;
};

export default function PartnersList({
                                         partners = [],
                                         title = "Nasi partnerzy handlowi",
                                         subtitle = "Firmy i organizacje, z którymi współpracujemy",
                                         className = "",
                                         showCategories = false,
                                         isAdmin,
                                     }: Props) {
    const { props }: any = usePage();
    const isAdminFromInertia: boolean =
        props?.auth?.isAdmin ?? !!props?.auth?.user?.is_admin;
    const canManagePartners =
        typeof isAdmin === "boolean" ? isAdmin : isAdminFromInertia;

    const groupedPartners = showCategories
        ? partners.reduce((acc, partner) => {
            const category = partner.category || "Inni partnerzy";
            if (!acc[category]) acc[category] = [];
            acc[category].push(partner);
            return acc;
        }, {} as Record<string, Partner[]>)
        : null;

    return (
        <AppLayout>
            <div className={`bg-white py-12 ${className}`}>
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    {/* Strzałka powrotu */}
                    <Link
                        href="/"
                        className="mb-6 inline-flex items-center text-sm text-foreground/60 hover:text-foreground"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        WSTECZ
                    </Link>

                    {/* Nagłówek + przycisk dla admina */}
                    <div className="mb-12 flex items-start justify-between">
                        <div className="w-full text-center sm:text-left">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                {title}
                            </h2>
                            {subtitle && (
                                <p className="mt-4 text-lg text-gray-600">{subtitle}</p>
                            )}
                        </div>

                        {canManagePartners && (
                            <Link
                                href="/admin/partners/create"
                                className="ml-6 inline-flex items-center rounded-lg bg-coral px-4 py-2 text-white shadow hover:bg-coral/90"
                            >
                                + Dodaj partnera
                            </Link>
                        )}
                    </div>

                    {/* Lista partnerów */}
                    <div className="space-y-8">
                        {showCategories && groupedPartners ? (
                            Object.entries(groupedPartners).map(
                                ([category, categoryPartners]) => (
                                    <div
                                        key={category}
                                        className="border-b border-gray-200 pb-8 last:border-b-0"
                                    >
                                        <h3 className="mb-6 border-b border-gray-100 pb-2 text-xl font-semibold text-gray-900">
                                            {category}
                                        </h3>
                                        <div className="space-y-4">
                                            {categoryPartners.map((partner) => (
                                                <PartnerListItem key={partner.id} partner={partner} />
                                            ))}
                                        </div>
                                    </div>
                                )
                            )
                        ) : (
                            <div className="space-y-4">
                                {partners.map((partner) => (
                                    <PartnerListItem key={partner.id} partner={partner} />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* CTA */}
                    <div className="mt-12 text-center">
                        <div className="rounded-lg bg-gray-50 p-8">
                            <h3 className="mb-4 text-2xl font-bold text-gray-900">
                                Chcesz dołączyć do grona naszych partnerów?
                            </h3>
                            <p className="mx-auto mb-6 max-w-2xl text-lg text-gray-600">
                                Jesteśmy otwarci na współpracę z firmami i organizacjami
                                działającymi w obszarze opieki nad osobami starszymi.
                            </p>
                            <Link
                                href="/kontakt"
                                className="inline-flex items-center rounded-md bg-coral px-6 py-3 text-base font-medium text-white shadow-sm transition-colors hover:bg-coral/90"
                            >
                                Skontaktuj się z nami
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

function PartnerListItem({ partner }: { partner: Partner }) {
    return (
        <div className="flex items-start space-x-4 rounded-lg bg-gray-50 p-4 transition-colors duration-200 hover:bg-gray-100">
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
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-coral shadow-sm">
            <span className="text-sm font-bold text-white">
              {partner.name.charAt(0)}
            </span>
                    </div>
                )}
            </div>

            {/* Informacje */}
            <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            {partner.website ? (
                                <a
                                    href={partner.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="transition-colors duration-200 hover:text-coral"
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

                    {partner.website && (
                        <a
                            href={partner.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-4 inline-flex flex-shrink-0 items-center whitespace-nowrap text-sm font-medium text-coral hover:text-coral/80"
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

