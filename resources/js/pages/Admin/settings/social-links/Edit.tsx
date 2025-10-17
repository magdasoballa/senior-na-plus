import * as React from 'react'
import { Link, useForm, usePage } from '@inertiajs/react'
import AdminLayout from '@/layouts/admin-layout'
import { CheckCircle2 } from 'lucide-react'

type RecordT = {
    id: number | null
    name: string
    url: string
    icon?: string | null
    icon_file_url?: string | null
    visible_pl: boolean
    visible_de: boolean
}

const resolveFa = (icon?: string | null) => {
    if (!icon || !icon.trim()) return null
    const s = icon.trim()
    if (s.includes('fa-')) return s
    return `fa-brands fa-${s}`
}

export default function Edit({
                                 record,
                                 mode,
                             }: {
    record: RecordT
    mode: 'create' | 'edit'
}) {
    const { data, setData, post, processing, errors, progress, transform } = useForm({
        name: record.name ?? '',
        url: record.url ?? '',
        icon: record.icon ?? '',
        icon_file: null as File | null,
        remove_icon_file: false,
        visible_pl: !!record.visible_pl,
        visible_de: !!record.visible_de,
    })

    // flash z backendu + lokalny „toast” po zapisie i pozostaniu
    const { flash } = usePage<{ flash?: { success?: string } }>().props
    const [saved, setSaved] = React.useState(false)

    const submit: React.FormEventHandler = (e) => {
        e.preventDefault()
        if (mode === 'create') {
            post('/admin/settings/social-links', {
                forceFormData: true,
                preserveScroll: true,
            })
        } else {
            transform((d) => ({ ...d, _method: 'put' }))
            post(`/admin/settings/social-links/${record.id}`, {
                forceFormData: true,
                preserveScroll: true,
                onFinish: () => transform((d) => d),
            })
        }
    }

    // 👉 Zapisz i zostań na tej stronie + pokaż komunikat
    const submitAndContinue = () => {
        if (mode === 'create') {
            transform((d) => ({ ...d, stay: true }))
            post('/admin/settings/social-links', {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => {
                    setSaved(true)
                    window.setTimeout(() => setSaved(false), 2500)
                },
                onFinish: () => transform((d) => d), // wróć do domyślnej transformacji
            })
        } else {
            transform((d) => ({ ...d, _method: 'put', stay: true }))
            post(`/admin/settings/social-links/${record.id}`, {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => {
                    setSaved(true)
                    window.setTimeout(() => setSaved(false), 2500)
                },
                onFinish: () => transform((d) => d),
            })
        }
    }

    return (
        <AdminLayout>
            <form onSubmit={submit} className="p-6 space-y-4">
                <div className="text-sm text-slate-500">
                   <Link href="/admin/settings/social-links" >Linki społecznościowe</Link>
                    &nbsp;&rsaquo;&nbsp; {mode === 'create' ? 'Utwórz' : `Aktualizacja #${record.id}`}
                          </div>
                <p className="mb-2 text-2xl font-bold">
                    {mode === 'create' ? 'Utwórz' : 'Aktualizacja'} Link społecznościowy
                    {record.name ? `: ${record.name}` : ''}
                </p>

                {(saved || flash?.success) && (
                    <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-800">
                        <CheckCircle2 className="h-4 w-4" />
                        {flash?.success ?? 'Zapisano zmiany'}
                    </div>
                )}

                <div className="space-y-4 rounded-xl border bg-white p-5">
                    {/* Nazwa */}
                    <div>
                        <label className="block text-sm font-medium">Nazwa *</label>
                        <input
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="mt-1 w-full rounded-lg border px-3 py-2"
                        />
                        {errors.name && <p className="mt-1 text-sm text-rose-600">{errors.name}</p>}
                    </div>

                    {/* Link */}
                    <div>
                        <label className="block text-sm font-medium">Link *</label>
                        <input
                            value={data.url}
                            onChange={(e) => setData('url', e.target.value)}
                            className="mt-1 w-full rounded-lg border px-3 py-2"
                        />
                        {errors.url && <p className="mt-1 text-sm text-rose-600">{errors.url}</p>}
                    </div>

                    {/* Ikona: Font Awesome */}
                    <div>
                        <label className="block text-sm font-medium">Ikona</label>
                        <div className="mt-1 flex items-center gap-3">
                            <div className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-700">
                                {data.icon ? <i className={resolveFa(data.icon) || ''} /> : <i className="fa-solid fa-link" />}
                            </div>
                            <input
                                value={data.icon ?? ''}
                                onChange={(e) => setData('icon', e.target.value)}
                                className="flex-1 rounded-lg border px-3 py-2"
                                placeholder="facebook albo fa-brands fa-facebook"
                            />
                        </div>
                        {errors.icon && <p className="mt-1 text-sm text-rose-600">{errors.icon}</p>}
                    </div>

                    {/* Ikona: plik */}
                    <div>
                        <label className="block text-sm font-medium">Ikona z pliku (SVG/PNG/JPG/WEBP, max 2 MB)</label>
                        <div className="mt-1 flex items-center gap-3">
                            <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-slate-100">
                                {data.icon_file ? (
                                    <img src={URL.createObjectURL(data.icon_file)} alt="" className="h-10 w-10 object-contain" />
                                ) : record.icon_file_url ? (
                                    <img src={record.icon_file_url} alt="" className="h-10 w-10 object-contain" />
                                ) : (
                                    <span className="text-xs text-slate-500">brak</span>
                                )}
                            </div>
                            <input
                                type="file"
                                accept=".svg,.png,.jpg,.jpeg,.webp"
                                onChange={(e) => setData('icon_file', e.target.files?.[0] ?? null)}
                                className="flex-1 rounded-lg border bg-white px-3 py-2"
                            />
                        </div>
                        {errors.icon_file && <p className="mt-1 text-sm text-rose-600">{errors.icon_file}</p>}
                        {record.icon_file_url && (
                            <label className="mt-2 flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={data.remove_icon_file}
                                    onChange={(e) => setData('remove_icon_file', e.target.checked)}
                                />
                                <span>Usuń aktualnie wgrany plik</span>
                            </label>
                        )}
                    </div>

                    {/* Widoczność */}
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={data.visible_pl}
                                onChange={(e) => setData('visible_pl', e.target.checked)}
                            />
                            <span>Widoczność na polskiej stronie</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={data.visible_de}
                                onChange={(e) => setData('visible_de', e.target.checked)}
                            />
                            <span>Widoczność na niemieckiej stronie</span>
                        </label>
                    </div>
                </div>

                {/* ACTIONS */}
                <div className="mt-2 flex items-center justify-end gap-3">
                    <Link href="/admin/settings/social-links" className="rounded-full border px-4 py-2 hover:bg-slate-50">
                        Anuluj
                    </Link>

                    {/* Zapis i pozostanie na edycji */}
                    <button
                        type="button"
                        onClick={submitAndContinue}
                        disabled={processing}
                        className="rounded-full bg-mint px-4 py-2 font-semibold  disabled:opacity-50 cursor-pointer"
                    >
                        Aktualizuj i Kontynuuj Edycję
                    </button>

                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-full bg-mint px-4 py-2 font-semibold disabled:opacity-50 cursor-pointer"
                    >
                        {processing ? 'Zapisywanie…' : mode === 'create' ? 'Utwórz' : 'Zapisz zmiany'}
                    </button>

                    {progress && <span className="text-sm text-slate-500">{progress.percentage}%</span>}
                </div>
            </form>
        </AdminLayout>
    )
}
