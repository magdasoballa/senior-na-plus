import * as React from "react";

type Props =
    | { address: string; lat?: never; lng?: never; zoom?: number }
    | { address?: never; lat: number; lng: number; zoom?: number };

export default function MapCard(props: Props) {
    const zoom = props.zoom ?? 13;

    const q = "address" in props
        ? encodeURIComponent(props.address)
        : `loc:${props.lat},${props.lng}`;

    const src = `https://www.google.com/maps?hl=pl&q=${q}&z=${zoom}&output=embed`;

    return (
        <div className=" mx-auto w-full max-w-lg px-2">
            <div className="rounded-[2rem] border bg-card p-2 shadow-[16px_16px_0_rgba(0,0,0,0.25)]">
                <div className="overflow-hidden rounded-[1rem]">
                    <iframe
                        src={src}
                        className="block h-[380px] w-full"
                        style={{ border: 0 }}
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Mapa"
                    />
                </div>
            </div>
            {/* link pod mapą (opcjonalnie) */}
            <div className="mt-2 text-right">
                <a
                    href={`https://www.google.com/maps/search/?api=1&query=${q}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sea hover:underline text-sm"
                >
                    Otwórz w Google Maps
                </a>
            </div>
        </div>
    );
}
