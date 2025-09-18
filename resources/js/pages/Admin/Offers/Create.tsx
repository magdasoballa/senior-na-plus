import * as React from "react";
import OfferForm from "./OfferForm";
import AppLayout from '@/layouts/app-layout';

export default function Create() {
    return (
        <AppLayout>
        <div className="mx-auto max-w-3xl p-6">
            <h1 className="mb-4 text-2xl font-bold">Dodaj ofertę</h1>
            <OfferForm mode="create" />
        </div>
        </AppLayout>
    );
}
