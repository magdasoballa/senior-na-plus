import { Link, router, useForm, usePage } from '@inertiajs/react'
import AdminLayout from '@/layouts/admin-layout'
import { useRef, useState, useEffect } from 'react'
import { CheckCircle2 } from 'lucide-react'

type Req = { id?: number; title?: string; body?: string; image_url?: string | null; is_visible?: boolean }

type FormDataShape = {
    title: string
    body: string
    image: File | null
    remove_image: boolean
    is_visible: boolean
    redirectTo: 'index' | 'continue'
}

const BASE = '/admin/dictionaries/recruitment-reqs'

export default function Form() {
    const { req, flash } = usePage<{ req: Req | null; flash?: { success?: string } }>().props
    const isEdit = !!req?.id

    const form = useForm<FormDataShape>({
        title: req?.title ?? '',
        body: req?.body ?? '',
        image: null,
        remove_image: false,
        is_visible: req?.is_visible ?? true,
        redirectTo: 'index',
    })

    const fileRef = useRef<HTMLInputElement | null>(null)
    const [preview, setPreview] = useState<string | null>(req?.image_url ?? null)
    const [saved, setSaved] = useState(false)

    // pokaż komunikat jeśli przyszedł z flash (np. po redirect/refresh)
    useEffect(() => {
        if (flash?.success) {
            setSaved(true)
            const t = window.setTimeout(() => setSaved(false), 2500)
            return () => window.clearTimeout(t)
        }
    }, [flash?.success])

    // czyszczenie blob URL
    useEffect(() => {
        return () => {
            if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview)
        }
    }, [preview])

    const onFile = (f: File | null) => {
        form.setData('image', f)
        const next = f ? URL.createObjectURL(f) : req?.image_url ?? null
        setPreview(next)
        if (f) form.setData('remove_image', false)
    }

    const buildFormData = (extra?: Record<string, string>) => {
        const fd = new FormData()
        fd.append('title', form.data.title)
        fd.append('body', form.data.body)
        fd.append('is_visible', form.data.is_visible ? '1' : '0')
        fd.append('redirectTo', form.data.redirectTo)
        if (form.data.remove_image) fd.append('remove_image', '1')
        if (form.data.image) fd.append('image', form.data.image)
        if (extra) Object.entries(extra).forEach(([k, v]) => fd.append(k, v))
        return fd
    }

    const submit = (e: React.FormEvent) => {
        e.preventDefault()
        if (isEdit) {
            const fd = buildFormData({ _method: 'PUT' })
            router.post(`${BASE}/${req!.id}`, fd, {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => {
                    setSaved(true)
                    window.setTimeout(() => setSaved(false), 2500)
                },
                onFinish: () => form.setData('redirectTo', 'index'),
            })
        } else {
            form.post(`${BASE}`, { forceFormData: true, preserveScroll: true })
        }
    }

    const submitAndContinue = () => {
        // sygnał 1
        form.setData('redirectTo', 'continue')

        if (isEdit) {
            // sygnał 2 (_method + stay) + sygnał 3 (?continue=1)
            const fd = buildFormData({ _method: 'PUT', stay: '1' })
            router.post(`${BASE}/${req!.id}?continue=1`, fd, {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => {
                    form.setData('redirectTo', 'index')
                    setSaved(true)
                    window.setTimeout(() => setSaved(false), 2500)
                    // fallback: upewnij się, że jesteśmy na /edit
                    if (!location.pathname.endsWith('/edit')) {
                        router.replace(`${BASE}/${req!.id}/edit`, { replace: true, preserveState: true })
                    }
                },
            })
        } else {
            // create: dodaj „stay”, ?continue=1 i zostań na /create
            form.transform((d) => ({ ...d, stay: true }))
            form.post(`${BASE}?continue=1`, {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => {
                    form.setData('redirectTo', 'index')
                    setSaved(true)
                    window.setTimeout(() => setSaved(false), 2500)
                    if (!location.pathname.endsWith('/create')) {
                        router.replace(`${BASE}/create`, { replace: true, preserveState: true })
                    }
                },
                onFinish: () => form.transform((d) => d),
            })
        }
    }

    return (
        <AdminLayout>
            <main className="p-6">
                 <div className="text-sm text-slate-500">
                   <Link href={BASE} >Wymagania rekrutacyjne</Link>
                  &nbsp;&rsaquo;&nbsp; {isEdit ? `Aktualizacja: ${req!.title}` : 'Utwórz'}
                 </div>
                <p className="mt-1 text-2xl font-bold">
                    {isEdit ? `Aktualizacja Wymaganie rekrutacyjne: ${req!.id}` : 'Utwórz Wymaganie rekrutacyjne'}
                </p>

                {(saved || flash?.success) && (
                    <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-800">
                        <CheckCircle2 className="h-4 w-4" />
                        {flash?.success ?? 'Zapisano'}
                    </div>
                )}

                <form onSubmit={submit} className="mt-6 rounded-xl border bg-white p-6">
                    <Field label="Tytuł" required>
                        <input
                            className="mt-2 w-full rounded-lg border bg-white px-3 py-2"
                            value={form.data.title}
                            onChange={(e) => form.setData('title', e.target.value)}
                        />
                        {form.errors.title && <Err msg={form.errors.title} />}
                    </Field>

                    <Field label="Opis" required>
            <textarea
                className="mt-2 w-full min-h-[220px] rounded-lg border bg-white px-3 py-2"
                value={form.data.body}
                onChange={(e) => form.setData('body', e.target.value)}
            />
                        {form.errors.body && <Err msg={form.errors.body} />}
                    </Field>

                    <Field label="Zdjęcie">
                        {preview && (
                            <div className="mt-2">
                                <img src={preview} alt="podgląd" className="h-28 rounded object-cover" />
                            </div>
                        )}

                        <div
                            className="mt-2 rounded-lg border-2 border-dashed p-4 text-center text-sm text-slate-600"
                            onClick={() => fileRef.current?.click()}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                                e.preventDefault()
                                const f = e.dataTransfer.files?.[0]
                                if (f) onFile(f)
                            }}
                        >
                            <button type="button" className="rounded bg-cyan-600 px-3 py-1 text-white">
                                Wybierz Plik
                            </button>
                            <span className="ml-2">Upuść plik lub kliknij, aby wybrać</span>
                            <input
                                ref={fileRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => onFile(e.target.files?.[0] ?? null)}
                            />
                        </div>

                        {req?.image_url && (
                            <label className="mt-2 flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={form.data.remove_image}
                                    onChange={(e) => {
                                        form.setData('remove_image', e.target.checked)
                                        if (e.target.checked) {
                                            setPreview(null)
                                            if (fileRef.current) fileRef.current.value = ''
                                            form.setData('image', null)
                                        }
                                    }}
                                />
                                Usuń obecne zdjęcie
                            </label>
                        )}

                        {form.errors.image && <Err msg={form.errors.image} />}
                    </Field>

                    <Field label="Widoczny">
                        <label className="mt-2 inline-flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={form.data.is_visible}
                                onChange={(e) => form.setData('is_visible', e.target.checked)}
                            />
                            {form.data.is_visible ? 'Tak' : 'Nie'}
                        </label>
                    </Field>

                    <div className="mt-8 flex items-center justify-end gap-3">
                        <Link href={`${BASE}`} className="rounded-lg border px-4 py-2 hover:bg-slate-50">
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
                            {isEdit ? 'Aktualizacja Wymaganie rekrutacyjne' : 'Utwórz Wymaganie rekrutacyjne'}
                        </button>
                    </div>
                </form>
            </main>
        </AdminLayout>
    )
}

function Field({
                   label,
                   children,
                   required = false,
               }: {
    label: string
    children: React.ReactNode
    required?: boolean
}) {
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
