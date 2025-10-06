import { Link, router, useForm, usePage } from '@inertiajs/react'
import AdminLayout from '@/layouts/admin-layout'
import { useEffect, useState } from 'react'
import { CheckCircle2 } from 'lucide-react'

type Duty = { id?: number; name?: string; is_visible?: boolean }
type FormShape = { name: string; is_visible: boolean; redirectTo: 'index' | 'continue' }

const BASE = '/admin/dictionaries/duties'

export default function Form() {
    const { duty, flash } = usePage<{ duty: Duty | null; flash?: { success?: string } }>().props
    const isEdit = !!duty?.id

    const form = useForm<FormShape>({
        name: duty?.name ?? '',
        is_visible: duty?.is_visible ?? true,
        redirectTo: 'index',
    })

    const [saved, setSaved] = useState(false)

    // auto-hide lokalnego komunikatu po ~2.5s
    useEffect(() => {
        if (!saved) return
        const t = window.setTimeout(() => setSaved(false), 2500)
        return () => window.clearTimeout(t)
    }, [saved])

    const submit = (e: React.FormEvent) => {
        e.preventDefault()
        if (isEdit) {
            form.put(`${BASE}/${duty!.id}`, { preserveScroll: true })
        } else {
            form.post(`${BASE}`, { preserveScroll: true })
        }
    }

    const submitAndContinue = () => {
        // wyślij sygnał „zostań”
        form.transform(d => ({ ...d, redirectTo: 'continue' as const }))

        form.put(`${BASE}/${duty!.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setSaved(true) // pokaż lokalny komunikat
            },
            onFinish: () => form.transform(d => d), // wyczyść transform
        })
    }

    return (
        <AdminLayout>
            <main className="p-6">
                {/* breadcrumbs */}
                <div className="text-sm text-slate-500">
                    {isEdit ? `Obowiązki › Aktualizacja: ${duty!.name}` : 'Obowiązki › Utwórz'}
                </div>
                <p className="mt-1 text-3xl font-bold text-emerald-900">
                    {isEdit ? `Aktualizacja Obowiązek: ${duty!.id}` : 'Utwórz Obowiązek'}
                </p>

                {/* komunikat sukcesu (flash z backendu lub lokalny „saved”) */}
                {(saved || flash?.success) && (
                    <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-800">
                        <CheckCircle2 className="h-4 w-4" />
                        {flash?.success ?? 'Zapisano'}
                    </div>
                )}

                {/* karta formularza */}
                <form onSubmit={submit} className="mt-4 rounded-2xl border border-slate-200 bg-white p-6">
                    <Field label="Tytuł" required>
                        <input
                            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-slate-900 outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-200"
                            value={form.data.name}
                            onChange={(e) => form.setData('name', e.target.value)}
                        />
                        {form.errors.name && <Err msg={form.errors.name} />}
                    </Field>

                    <Field label="Widoczny">
                        <label className="mt-3 inline-flex cursor-pointer items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100">
                            <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-300"
                                checked={form.data.is_visible}
                                onChange={(e) => form.setData('is_visible', e.target.checked)}
                            />
                            <span className="select-none">{form.data.is_visible ? 'Tak' : 'Nie'}</span>
                        </label>
                    </Field>

                    {/* akcje */}
                    <div className="mt-8 flex items-center justify-end gap-3">
                        <Link
                            href={`${BASE}`}
                            className="inline-flex items-center rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                        >
                            Anuluj
                        </Link>
                        <button
                            type="button"
                            onClick={submitAndContinue}
                            className="rounded-lg bg-mint px-4 py-2 font-semibold cursor-pointer"
                            disabled={form.processing}
                        >
                            {isEdit ? 'Aktualizuj i Kontynuuj Edycję' : 'Utwórz i Kontynuuj Edycję'}
                        </button>
                        <button
                            type="submit"
                            className="rounded-lg bg-mint px-4 py-2 font-semibold cursor-pointer"
                            disabled={form.processing}
                        >
                            {isEdit ? 'Aktualizacja Obowiązek' : 'Utwórz Obowiązek'}
                        </button>
                    </div>
                </form>
            </main>
        </AdminLayout>
    )
}

function Field({label, children, required=false}:{label:string;children:React.ReactNode;required?:boolean}) {
    return (
        <div className="mt-4">
            <label className="block text-sm font-medium text-slate-600">
                {label}{required && <span className="text-rose-600"> *</span>}
            </label>
            {children}
        </div>
    )
}
function Err({msg}:{msg?:string}){ return msg ? <p className="mt-1 text-sm text-rose-600">{msg}</p> : null }
