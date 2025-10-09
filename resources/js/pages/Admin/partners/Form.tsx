import { Link, useForm, usePage } from '@inertiajs/react'
import AdminLayout from '@/layouts/admin-layout'
import { useRef, useState } from 'react'
import { CheckCircle2 } from 'lucide-react'

type P = { id?: number; link?: string; image_url?: string | null; is_visible?: boolean } | null
const BASE = '/admin/partners'

export default function Form() {
    const { partner, mode } = usePage<{ partner: P; mode: 'create' | 'edit' }>().props

    // lokalny „toast” po zapisie z pozostaniem
    const [saved, setSaved] = useState(false)

    const fileRef = useRef<HTMLInputElement>(null)

    const form = useForm({
        link: partner?.link ?? '',
        is_visible: !!partner?.is_visible,
        image: null as File | null,
    })

    const [preview, setPreview] = useState<string | null>(partner?.image_url ?? null)

    const submit = (stay = false) => {
        form.transform((d: any) => {
            const payload: any = {
                ...d,
                stay,
                is_visible: d.is_visible ? 1 : 0, // backend oczekuje bool/1
            }
            if (mode === 'edit') payload._method = 'put'
            // wyślij plik tylko gdy faktycznie wybrany
            if (!(d.image instanceof File)) delete payload.image
            return payload
        })

        const url = mode === 'create' ? `${BASE}` : `${BASE}/${partner?.id}`

        form.post(url, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                if (stay) {
                    setSaved(true)
                    window.setTimeout(() => setSaved(false), 2500)
                }
            },
            onFinish: () => {
                // wyczyść transform, żeby następny submit nie niósł "stay"
                form.transform((d: any) => d)
            },
        })
    }

    return (
        <AdminLayout>
            <main className="p-6">
                <div className="text-sm text-slate-500">
                    <Link href={BASE} className="text-sky-700 hover:underline">
                        Partnerzy
                    </Link>
                    &nbsp;&rsaquo;&nbsp; {mode === 'create' ? 'Utwórz' : `Aktualizacja Partner: ${partner?.id}`}
                </div>

                {/* zielona pastylka „Zapisano zmiany” */}
                {saved && (
                    <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-800">
                        <CheckCircle2 className="h-4 w-4" />
                        Zapisano zmiany
                    </div>
                )}

                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        submit(false)
                    }}
                    className="mt-4 space-y-4 rounded-xl border bg-white p-6"
                    encType="multipart/form-data"
                >
                    <div>
                        <label className="block text-sm font-medium">Link</label>
                        <input
                            value={form.data.link}
                            onChange={(e) => form.setData('link', e.target.value)}
                            className="mt-2 w-full rounded-lg border bg-white px-3 py-2"
                        />
                        {form.errors.link && <p className="mt-1 text-sm text-rose-600">{form.errors.link}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Zdjęcie</label>
                        <input
                            type="file"
                            ref={fileRef}
                            accept="image/*"
                            onChange={(e) => {
                                const f = e.target.files?.[0] ?? null
                                form.setData('image', f)
                                setPreview(f ? URL.createObjectURL(f) : partner?.image_url ?? null)
                            }}
                            className="mt-2 block w-full rounded-lg border bg-white px-3 py-2"
                        />
                        {preview && <img src={preview} alt="" className="mt-3 h-16 object-contain" />}
                        {form.errors.image && <p className="mt-1 text-sm text-rose-600">{form.errors.image}</p>}
                    </div>

                    <label className="inline-flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={!!form.data.is_visible}
                            onChange={(e) => form.setData('is_visible', e.target.checked)}
                        />
                        <span>Widoczny</span>
                    </label>

                    {/* akcje jak w innych widokach */}
                    <div className="mt-8 flex items-center justify-end gap-3">
                        <Link href={BASE} className="rounded-lg border px-4 py-2 hover:bg-slate-50">
                            Anuluj
                        </Link>

                        {mode === 'edit' && (
                            <button
                                type="button"
                                onClick={() => submit(true)}
                                disabled={form.processing}
                                className="cursor-pointer rounded-lg bg-mint px-4 py-2 font-semibold"
                            >
                                Aktualizuj i Kontynuuj Edycję
                            </button>
                        )}

                        <button
                            type="submit"
                            disabled={form.processing}
                            className="cursor-pointer rounded-lg bg-mint px-4 py-2 font-semibold"
                        >
                            {mode === 'create' ? 'Utwórz Partner' : 'Aktualizuj Partner'}
                        </button>
                    </div>
                </form>
            </main>
        </AdminLayout>
    )
}
