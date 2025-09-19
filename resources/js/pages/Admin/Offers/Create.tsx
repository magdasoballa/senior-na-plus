import * as React from "react";
import OfferForm from "./OfferForm";
import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';

export default function Create() {
    return (
        <AppLayout>
        <div className=" max-w-5xl p-6">
            <Link href="/admin/offers" className="text-coral ">&larr; Wróć</Link>

            <h1 className="mb-4 text-2xl font-bold mt-5">Dodaj ofertę</h1>
            <OfferForm mode="create" />
        </div>
        </AppLayout>
    );
}
