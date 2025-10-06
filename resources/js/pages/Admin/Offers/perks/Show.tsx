import { Link, useForm, usePage } from '@inertiajs/react'
import AdminLayout from '@/layouts/admin-layout'
import { Pencil, Trash2 } from 'lucide-react';
import * as React from 'react';

type Perk = {
    id: number
    name: string
    is_visible: boolean
    created_at?: string
    updated_at?: string
}

const BASE = '/admin/offers/perks'

export default function Show() {
    const { perk } = usePage<{ perk: Perk }>().props
    const form = useForm({})

    const handleDelete = () => {
        if (confirm('Na pewno usunąć ten element?')) {
            form.delete(`${BASE}/${perk.id}`, { preserveScroll: true })
        }
    }

    return (
        <AdminLayout>
            <main className="p-6">
                {/* breadcrumb */}
                <div className="text-sm text-slate-500">
                    Zasoby › <Link href={BASE} className="text-mint hover:underline">Oferujemy</Link> › Podgląd
                </div>

                <div className="mt-1 flex items-center justify-between">
                    <p className="text-2xl font-bold">Oferujemy – podgląd</p>
                    <div className="flex gap-2">
                        <Link href={`${BASE}/${perk.id}/edit`} className="rounded-lg border px-3 py-1 hover:bg-slate-50">
                            <Pencil/>
                        </Link>
                        <button onClick={handleDelete} className="rounded-lg border px-3 py-1 text-rose-600 hover:bg-rose-50 disabled:opacity-50" disabled={form.processing}>
                            <Trash2 className="h-4 w-4" />
                        </button>
                        <Link href={BASE} className="rounded-lg border px-3 py-1 hover:bg-slate-50">↩︎</Link>
                    </div>
                </div>

                {/* karta z danymi */}
                <section className="mt-6 rounded-xl border bg-white p-6 max-w-3xl">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <Field label="ID">
                            <span className="text-slate-700">{perk.id}</span>
                        </Field>

                        <Field label="Widoczny">
              <span className="inline-flex items-center gap-2">
                <span
                    className={
                        'inline-block h-2.5 w-2.5 rounded-full ' +
                        (perk.is_visible ? 'bg-emerald-500' : 'bg-slate-300')
                    }
                />
                  {perk.is_visible ? 'Tak' : 'Nie'}
              </span>
                        </Field>

                        <Field label="Nazwa" wide>
                            <span className="text-slate-900">{perk.name}</span>
                        </Field>

                        <Field label="Utworzono">
                            <span className="text-slate-700">{perk.created_at ?? '—'}</span>
                        </Field>

                        <Field label="Zaktualizowano">
                            <span className="text-slate-700">{perk.updated_at ?? '—'}</span>
                        </Field>
                    </div>
                </section>
            </main>
        </AdminLayout>
    )
}

function Field({
                   label,
                   children,
                   wide = false,
               }: {
    label: string
    children: React.ReactNode
    wide?: boolean
}) {
    return (
        <div className={wide ? 'md:col-span-2' : ''}>
            <div className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</div>
            <div className="mt-1 rounded-lg border bg-slate-50 px-3 py-2">{children}</div>
        </div>
    )
}
