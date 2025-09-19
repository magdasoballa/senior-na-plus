import * as React from "react";
import OfferForm from "./OfferForm";
import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';

export default function Edit({ offer }: { offer: any }) {
    return (
        <AppLayout>
        <div className=" max-w-5xl p-6">
            <Link href="/admin/offers" className="text-coral ">&larr; Wróć</Link>

            <h1 className="mb-4 mt-2 text-2xl font-bold mt-5">Edytuj ofertę</h1>
            <OfferForm mode="edit" offer={offer} />
        </div>
        </AppLayout>
    );
}
