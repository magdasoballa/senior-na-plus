import AdminLayout from '@/layouts/admin-layout'
import { Link, useForm, usePage } from '@inertiajs/react'
import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'

type FormRow = {
    id?: number
    name?: string
    content_pl?: string
    content_de?: string | null
    visible_pl?: boolean
    visible_de?: boolean
}

type FormShape = {
    name: string
    content_pl: string
    content_de: string | null
    visible_pl: boolean
    visible_de: boolean
    redirectTo: 'index' | 'continue'
}

const BASE = '/admin/consents/forms'

export default function Form() {
    const { form: current, flash } = usePage<{ form: FormRow | null; flash?: { success?: string; error?: string } }>().props
    const isEdit = !!current?.id

    const form = useForm<FormShape>({
        name: current?.name ?? '',
        content_pl: current?.content_pl ?? '',
        content_de: current?.content_de ?? '',
        visible_pl: current?.visible_pl ?? true,
        visible_de: current?.visible_de ?? true,
        redirectTo: 'index',
    })

    // lokalny „toast” dla trybu „Kontynuuj”
    const [saved, setSaved] = useState(false)

    const submit = (e: React.FormEvent) => {
        e.preventDefault()
        if (isEdit) {
            form.put(`${BASE}/${current!.id}`, {
                preserveScroll: true,
            })
        } else {
            form.post(`${BASE}`, {
                preserveScroll: true,
            })
        }
    }

    const submitAndContinue = () => {
        form.transform((d) => ({ ...d, redirectTo: 'continue' as const }))
        const opts = {
            preserveScroll: true,
            onSuccess: () => {
                setSaved(true)
                window.setTimeout(() => setSaved(false), 2500)
            },
            onFinish: () => form.transform((d) => d), // przywróć transform
        } as const

        if (isEdit) {
            form.put(`${BASE}/${current!.id}`, opts)
        } else {
            form.post(`${BASE}`, opts)
        }
    }

    return (
        <AdminLayout>
            <main className="p-6">
                {/* flash z backendu */}
                {flash?.success && (
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-800">
                        <CheckCircle2 className="h-4 w-4" />
                        {flash.success}
                    </div>
                )}


                <div className="text-sm text-slate-500">

                    <Link href={BASE}>
                        Formularze
                    </Link>{' '}
                    › {isEdit ? `Edycja: ${current!.name}` : 'Utwórz Formularz'}
                </div>

                <p className="mt-1 text-2xl font-bold">{isEdit ? `Aktualizacja #${current!.id}` : 'Utwórz Formularz'}</p>
                {saved && (
                    <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-800">
                        <CheckCircle2 className="h-4 w-4" />
                        Zapisano zmiany
                    </div>
                )}
                <form onSubmit={submit} className="mt-6 max-w-3xl rounded-xl border bg-white p-6">
                    <Field label="Nazwa" required>
                        <input
                            className="mt-2 w-full rounded-lg border bg-white px-3 py-2"
                            value={form.data.name}
                            onChange={(e) => form.setData('name', e.target.value)}
                        />
                        {form.errors.name && <Err msg={form.errors.name} />}
                    </Field>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <Field label="Treść (PL)" required>
              <textarea
                  className="mt-2 h-40 w-full rounded-lg border bg-white px-3 py-2"
                  value={form.data.content_pl}
                  onChange={(e) => form.setData('content_pl', e.target.value)}
              />
                            {form.errors.content_pl && <Err msg={form.errors.content_pl} />}
                        </Field>

                        <Field label="Treść (DE)">
              <textarea
                  className="mt-2 h-40 w-full rounded-lg border bg-white px-3 py-2"
                  value={form.data.content_de ?? ''}
                  onChange={(e) => form.setData('content_de', e.target.value)}
              />
                            {form.errors.content_de && <Err msg={form.errors.content_de} />}
                        </Field>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-6">
                        <Field label="Widoczny PL">
                            <label className="mt-2 inline-flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={form.data.visible_pl}
                                    onChange={(e) => form.setData('visible_pl', e.target.checked)}
                                />
                                {form.data.visible_pl ? 'Tak' : 'Nie'}
                            </label>
                        </Field>

                        <Field label="Widoczny DE">
                            <label className="mt-2 inline-flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={form.data.visible_de}
                                    onChange={(e) => form.setData('visible_de', e.target.checked)}
                                />
                                {form.data.visible_de ? 'Tak' : 'Nie'}
                            </label>
                        </Field>
                    </div>

                    <div className="mt-8 flex items-center justify-end gap-3">
                        <Link href={BASE} className="rounded-lg border px-4 py-2 hover:bg-slate-50">
                            Anuluj
                        </Link>

                        <button
                            type="button"
                            onClick={submitAndContinue}
                            className="rounded-lg bg-mint px-4 py-2 font-semibold cursor-pointer"
                            disabled={form.processing}
                        >
                            {isEdit ? 'Aktualizuj i Kontynuuj' : 'Utwórz i Kontynuuj'}
                        </button>

                        <button
                            type="submit"
                            className="rounded-lg bg-mint px-4 py-2 font-semibold cursor-pointer"
                            disabled={form.processing}
                        >
                            {isEdit ? 'Zapisz' : 'Utwórz'}
                        </button>
                    </div>
                </form>
            </main>
        </AdminLayout>
    )
}

function Field({ label, children, required = false }: { label: string; children: React.ReactNode; required?: boolean }) {
    return (
        <div className="mt-4">
            <label className="block text-sm font-medium">
                {label}
                {required && <span className="text-rose-600"> *</span>}
            </label>
            {children}
        </div>
    )
}

function Err({ msg }: { msg?: string }) {
    return msg ? <p className="mt-1 text-sm text-rose-600">{msg}</p> : null
}
