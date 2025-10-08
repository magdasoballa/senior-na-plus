import * as React from 'react';

export const fieldClass =
    'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 ' +
    'placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-400';

export function Row({ label, error, children }:{
    label: string; error?: string; children: React.ReactNode;
}) {
    return (
        <div className="grid grid-cols-3 items-start gap-4 px-4 py-3">
            <div className="pt-2 text-slate-600">{label}</div>
            <div className="col-span-2">
                {children}
                {error && <div className="mt-1 text-sm text-rose-600">{error}</div>}
            </div>
        </div>
    );
}
