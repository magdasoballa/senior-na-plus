import { Link, useForm, usePage } from '@inertiajs/react'
import AdminLayout from '@/layouts/admin-layout'
import { useRef, useState } from 'react'

const BASE = '/admin/settings/popups'

type Popup = { id?:number; name?:string; link?:string|null; image_url?:string|null; is_visible?:boolean }

export default function Form(){
    const { popup } = usePage<{ popup: Popup | null }>().props
    const isEdit = !!popup?.id

    const form = useForm({
        name: popup?.name ?? '',
        link: popup?.link ?? '',
        image: null as File | null,
        remove_image: false,
        is_visible: popup?.is_visible ?? true,
        redirectTo: 'index' as 'index' | 'continue',
    })

    const fileRef = useRef<HTMLInputElement|null>(null)
    const [preview, setPreview] = useState<string | null>(popup?.image_url ?? null)

    const onFile = (f: File | null)=>{
        form.setData('image', f)
        setPreview(f ? URL.createObjectURL(f) : popup?.image_url ?? null)
        if (f) form.setData('remove_image', false)
    }

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            // EDIcja: POST z _method=PUT
            form.transform(d => ({ ...d, _method: 'PUT' }));
            form.post(`${BASE}/${popup!.id}`, {
                forceFormData: true,
                preserveScroll: true,
                onFinish: () => form.setData('_method' as any, undefined as any), // sprzątanie
            });
        } else {
            // Nowy: zwykły POST
            form.post(`${BASE}`, { forceFormData: true, preserveScroll: true });
        }
    };

    const submitAndContinue = () => {
        form.setData('redirectTo', 'continue');
        if (isEdit) {
            form.transform(d => ({ ...d, _method: 'PUT' }));
            form.post(`${BASE}/${popup!.id}`, {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => form.setData('redirectTo', 'index'),
                onFinish: () => form.setData('_method' as any, undefined as any),
            });
        } else {
            form.post(`${BASE}`, {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => form.setData('redirectTo', 'index'),
            });
        }
    };


    return (
        <AdminLayout>
            <main className="p-6">
                <div className="text-sm text-slate-500">{isEdit ? `Aktualizacja Popup: ${popup!.id}` : 'Nowy Popup'}</div>
                <h1 className="mt-1 text-2xl font-bold">{isEdit ? `Aktualizacja Popup: ${popup!.id}` : 'Utwórz Popup'}</h1>

                <form onSubmit={submit} className="mt-6 rounded-xl border bg-white p-6">
                    <Field label="Nazwa" required>
                        <input className="mt-2 w-full rounded-lg border bg-white px-3 py-2"
                               value={form.data.name} onChange={e=>form.setData('name', e.target.value)} />
                        {form.errors.name && <Err msg={form.errors.name} />}
                    </Field>

                    <Field label="Link">
                        <input className="mt-2 w-full rounded-lg border bg-white px-3 py-2"
                               value={form.data.link ?? ''} onChange={e=>form.setData('link', e.target.value)} placeholder="https://..." />
                        {form.errors.link && <Err msg={form.errors.link} />}
                    </Field>

                    <Field label="Zdjęcie">
                        {preview && (
                            <div className="mt-2">
                                <img src={preview} alt="podgląd" className="h-32 rounded object-cover" />
                            </div>
                        )}

                        <div className="mt-2 rounded-lg border-2 border-dashed p-4 text-center text-sm text-slate-600"
                             onClick={()=>fileRef.current?.click()}
                             onDragOver={e=>{ e.preventDefault() }}
                             onDrop={e=>{ e.preventDefault(); const f=e.dataTransfer.files?.[0]; if(f) onFile(f) }}>
                            <button type="button" className="rounded bg-cyan-600 px-3 py-1 text-white">Wybierz Plik</button>
                            <span className="ml-2">Upuść plik lub kliknij, aby wybrać</span>
                            <input ref={fileRef} type="file" accept="image/*" className="hidden"
                                   onChange={e=>onFile(e.target.files?.[0] ?? null)} />
                        </div>

                        {popup?.image_url && (
                            <label className="mt-2 flex items-center gap-2 text-sm">
                                <input type="checkbox" checked={form.data.remove_image}
                                       onChange={e=>{
                                           form.setData('remove_image', e.target.checked)
                                           if (e.target.checked) { setPreview(null); if (fileRef.current) fileRef.current.value='' ; form.setData('image', null) }
                                       }} />
                                Usuń obecne zdjęcie
                            </label>
                        )}

                        {form.errors.image && <Err msg={form.errors.image} />}
                    </Field>

                    <Field label="Widoczny">
                        <label className="mt-2 inline-flex items-center gap-2 text-sm">
                            <input type="checkbox" checked={form.data.is_visible}
                                   onChange={e=>form.setData('is_visible', e.target.checked)} />
                            {form.data.is_visible ? 'Tak' : 'Nie'}
                        </label>
                    </Field>

                    <div className="mt-8 flex items-center justify-end gap-3">
                        <Link href={`${BASE}`} className="rounded-lg border px-4 py-2 hover:bg-slate-50">Anuluj</Link>
                        <button type="button" onClick={submitAndContinue}
                                className="rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-white" disabled={form.processing}>
                            {isEdit ? 'Aktualizuj i Kontynuuj Edycję' : 'Utwórz i Kontynuuj Edycję'}
                        </button>
                        <button type="submit" className="rounded-lg bg-mint px-4 py-2 font-semibold text-white" disabled={form.processing}>
                            {isEdit ? 'Aktualizacja Popup' : 'Utwórz Popup'}
                        </button>
                    </div>
                </form>
            </main>
        </AdminLayout>
    )
}

function Field({label, children, required=false}:{label:string; children:React.ReactNode; required?:boolean}){
    return (
        <div className="mt-4">
            <label className="block text-sm font-medium">{label}{required && <span className="text-rose-600"> *</span>}</label>
            {children}
        </div>
    )
}
function Err({msg}:{msg?:string}){ return msg ? <p className="mt-1 text-sm text-rose-600">{msg}</p> : null }
