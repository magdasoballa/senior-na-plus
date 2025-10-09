import { Link, router, useForm, usePage } from '@inertiajs/react'
import AdminLayout from '@/layouts/admin-layout'
import { useRef, useState } from 'react'

type P = { id?:number; link?:string; image_url?:string|null; is_visible?:boolean } | null
const BASE = '/admin/partners'

export default function Form(){
    const { partner, mode } = usePage<{ partner:P, mode:'create'|'edit' }>().props
    const { data, setData, processing, errors, post, put } = useForm({
        link: partner?.link ?? '',
        is_visible: partner?.is_visible ?? true,
        image: null as File | null,
        stay: false,
    })
    const fileRef = useRef<HTMLInputElement>(null)
    const [preview, setPreview] = useState<string | null>(partner?.image_url ?? null)

    const submit = (e:React.FormEvent) => {
        e.preventDefault()
        if (mode === 'create') {
            post(`${BASE}`, { forceFormData:true })
        } else {
            put(`${BASE}/${partner?.id}`, { forceFormData:true })
        }
    }

    return (
        <AdminLayout>
            <main className="p-6">
                <div className="text-sm text-slate-500">
                    <Link href={BASE} className="text-sky-700 hover:underline">Partnerzy</Link>
                    &nbsp;&rsaquo;&nbsp; {mode==='create' ? 'Utwórz' : `Aktualizacja Partner: ${partner?.id}`}
                </div>

                <form onSubmit={submit} className="mt-4 rounded-xl border bg-white p-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Link</label>
                        <input value={data.link} onChange={(e)=>setData('link', e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2"/>
                        {errors.link && <div className="text-sm text-rose-600 mt-1">{errors.link}</div>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Zdjęcie</label>
                        <input type="file" ref={fileRef} accept="image/*"
                               onChange={(e)=>{
                                   const f = e.target.files?.[0] ?? null
                                   setData('image', f as any)
                                   setPreview(f ? URL.createObjectURL(f) : (partner?.image_url ?? null))
                               }}
                               className="mt-1 block w-full rounded-md border px-3 py-2 bg-white"/>
                        {preview && <img src={preview} alt="" className="mt-3 h-16 object-contain"/>}
                        {errors.image && <div className="text-sm text-rose-600 mt-1">{errors.image}</div>}
                    </div>

                    <label className="inline-flex items-center gap-2">
                        <input type="checkbox" checked={!!data.is_visible} onChange={(e)=>setData('is_visible', e.target.checked)} />
                        <span>Widoczny</span>
                    </label>

                    <div className="flex items-center gap-2">
                        <button disabled={processing} className="rounded-md bg-mint px-3 py-2 text-white text-sm">
                            {mode==='create' ? 'Utwórz Partner' : 'Aktualizuj Partner'}
                        </button>
                        {mode==='edit' && (
                            <button
                                type="button"
                                onClick={()=>{
                                    setData('stay', true)
                                    router.post(`${BASE}/${partner?.id}`, {...data, _method:'PUT'}, { forceFormData:true })
                                }}
                                className="rounded-md border px-3 py-2 text-sm"
                            >
                                Aktualizuj i Kontynuuj Edycję
                            </button>
                        )}
                        <Link href={BASE} className="rounded-md border px-3 py-2 text-sm">Anuluj</Link>
                    </div>
                </form>
            </main>
        </AdminLayout>
    )
}
