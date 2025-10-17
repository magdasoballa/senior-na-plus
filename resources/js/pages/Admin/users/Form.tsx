import { Link, useForm, usePage } from '@inertiajs/react'
import AdminLayout from '@/layouts/admin-layout'
import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'

type U = { id?: number; name?: string | null; email?: string } | null
const BASE = '/admin/users'

export default function Form() {
    const { user, mode } = usePage<{ user: U; mode: 'create' | 'edit' }>().props

    // lokalny „toast” po zapisie z pozostaniem na edycji
    const [saved, setSaved] = useState(false)

    const form = useForm({
        name: user?.name ?? '',
        email: user?.email ?? '',
        password: '' as string,
    })

    const submit = (stay = false) => {
        // przygotuj payload (usuń puste hasło przy edycji)
        form.transform((d: any) => {
            const payload: any = { ...d, stay }
            if (mode === 'edit' && !d.password) delete payload.password
            if (mode === 'edit') payload._method = 'put'
            return payload
        })

        const url = mode === 'create' ? `${BASE}` : `${BASE}/${user?.id}`

        form.post(url, {
            preserveScroll: true,
            onSuccess: () => {
                if (stay) {
                    setSaved(true)
                    window.setTimeout(() => setSaved(false), 2500)
                }
            },
            onFinish: () => {
                // przywróć transform, żeby kolejne submitty nie niosły 'stay'
                form.transform((d: any) => d)
            },
        })
    }

    return (
        <AdminLayout>
            <main className="p-6">
                <div className="text-sm text-slate-500">
                    <Link href={BASE} className="text-sky-700 hover:underline">
                        Użytkownicy
                    </Link>
                    &nbsp;&rsaquo;&nbsp; {mode === 'create' ? 'Utwórz Użytkownik' : `Aktualizacja Użytkownik: ${user?.name ?? ''}`}
                </div>

                {/* zielona pastylka jak na screenie */}
                {saved && (
                    <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-800">
                        <CheckCircle2 className="h-4 w-4" />
                        Zapisano zmiany
                    </div>
                )}

                <form
                    autoComplete="off" // wyłącz autofill na całym formularzu
                    onSubmit={(e) => {
                        e.preventDefault()
                        submit(false)
                    }}
                    className="mt-4 space-y-4 rounded-xl border bg-white p-6"
                >
                    {/* HONEYPOT — ukryte pola przed właściwymi, by zniechęcić Chrome do autofillu */}
                    <input type="text" name="fake-username" autoComplete="username" className="hidden" tabIndex={-1} />
                    <input type="password" name="fake-password" autoComplete="current-password" className="hidden" tabIndex={-1} />

                    <div>
                        <label className="block text-sm font-medium">
                            Imię <span className="text-rose-600">*</span>
                        </label>
                        <input
                            value={form.data.name ?? ''}
                            onChange={(e) => form.setData('name', e.target.value)}
                            className="mt-2 w-full rounded-lg border bg-white px-3 py-2"
                            required
                            name="user_name"          // nietypowa nazwa (utrudnia autofill)
                            autoComplete="off"         // dodatkowo wyłącz bezpośrednio na polu
                        />
                        {form.errors.name && <p className="mt-1 text-sm text-rose-600">{form.errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">
                            Email <span className="text-rose-600">*</span>
                        </label>
                        <input
                            value={form.data.email}
                            onChange={(e) => form.setData('email', e.target.value)}
                            className="mt-2 w-full rounded-lg border bg-white px-3 py-2"
                            required
                            name="user_email"         // nie „email”, by ograniczyć autofill
                            autoComplete="off"
                            inputMode="email"
                        />
                        {form.errors.email && <p className="mt-1 text-sm text-rose-600">{form.errors.email}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">
                            Hasło {mode === 'create' ? <span className="text-rose-600">*</span> : <span className="text-slate-400">(opcjonalnie)</span>}
                        </label>
                        <input
                            type="password"
                            value={form.data.password}
                            onChange={(e) => form.setData('password', e.target.value)}
                            className="mt-2 w-full rounded-lg border bg-white px-3 py-2"
                            placeholder="Hasło"
                            name="new_password"        // nie „password”
                            autoComplete="new-password"// standard na wyłączenie podpowiedzi haseł
                            {...(mode === 'create' ? { required: true } : {})}
                        />
                        {form.errors.password && <p className="mt-1 text-sm text-rose-600">{form.errors.password}</p>}
                    </div>

                    {/* Akcje */}
                    <div className="mt-8 flex items-center justify-end gap-3">
                        <Link href={BASE} className="rounded-lg border px-4 py-2 hover:bg-slate-50">
                            Anuluj
                        </Link>

                        {mode === 'edit' && (
                            <button
                                type="button"
                                onClick={() => submit(true)}
                                className="cursor-pointer rounded-lg bg-mint px-4 py-2 font-semibold"
                                disabled={form.processing}
                            >
                                Aktualizuj i Kontynuuj Edycję
                            </button>
                        )}

                        <button
                            type="submit"
                            className="cursor-pointer rounded-lg bg-mint px-4 py-2 font-semibold"
                            disabled={form.processing}
                        >
                            {mode === 'create' ? 'Utwórz Użytkownik' : 'Aktualizuj Użytkownik'}
                        </button>
                    </div>
                </form>
            </main>
        </AdminLayout>
    )
}
