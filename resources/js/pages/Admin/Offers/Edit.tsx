import * as React from "react";
import OfferForm from "./OfferForm";

export default function Edit({ offer }: { offer: any }) {
    return (
        <div className="mx-auto max-w-3xl p-6">
            <h1 className="mb-4 text-2xl font-bold">Edytuj ofertę</h1>
            <OfferForm mode="edit" offer={offer} />
        </div>
    );
}
