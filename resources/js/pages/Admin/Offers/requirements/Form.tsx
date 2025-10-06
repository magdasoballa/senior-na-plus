import { Link, useForm, usePage } from '@inertiajs/react'
import AdminLayout from '@/layouts/admin-layout'

type Req = { id?:number; name?:string; is_visible?:boolean }
type FormShape = { name:string; is_visible:boolean; redirectTo:'index'|'continue' }
const BASE = '/admin/offers/requirements'

export default function Form(){
    const { req } = usePage<{ req: Req | null }>().props
    const isEdit = !!req?.id

    const form = useForm<FormShape>({
        name: req?.name ?? '',
        is_visible: req?.is_visible ?? true,
        redirectTo: 'index',
    })

    const submit = (e: React.FormEvent) => {
        e.preventDefault()
        if (isEdit) {
            form.put(`${BASE}/${req!.id}`, { preserveScroll: true })
        } else {
            form.post(`${BASE}`, { preserveScroll: true })
        }
    }

    const submitAndContinue = () => {
        form.transform((d) => ({ ...d, redirectTo: 'continue' as const }))
        if (isEdit) {
            form.put(`${BASE}/${req!.id}`, {
                preserveScroll: true,
                onFinish: () => form.transform((d) => d),
            })
        } else {
            form.post(`${BASE}`, {
                preserveScroll: true,
                onFinish: () => form.transform((d) => d),
            })
        }
    }

    return (
        <AdminLayout>
            <main className="p-6">
                <div className="text-sm text-slate-500">{isEdit ? `Wymagania › Aktualizacja: ${req!.name}` : 'Wymagania › Utwórz'}</div>
                <p className="mt-1 text-2xl font-bold">{isEdit ? `Aktualizacja Wymaganie: ${req!.id}` : 'Utwórz Wymaganie'}</p>

                <form onSubmit={submit} className="mt-6 rounded-xl border bg-white p-6">
                    <Field label="Nazwa" required>
                        <input className="mt-2 w-full rounded-lg border bg-white px-3 py-2"
                               value={form.data.name} onChange={e=>form.setData('name', e.target.value)} />
                        {form.errors.name && <Err msg={form.errors.name} />}
                    </Field>

                    <Field label="Widoczny">
                        <label className="mt-2 inline-flex items-center gap-2 text-sm">
                            <input type="checkbox" checked={form.data.is_visible} onChange={e=>form.setData('is_visible', e.target.checked)} />
                            {form.data.is_visible ? 'Tak' : 'Nie'}
                        </label>
                    </Field>

                    <div className="mt-8 flex items-center justify-end gap-3">
                        <Link href={`${BASE}`} className="rounded-lg border px-4 py-2 hover:bg-slate-50">Anuluj</Link>
                        <button type="button" onClick={submitAndContinue}
                                className="rounded-lg bg-mint px-4 py-2 font-semibold cursor-pointer" disabled={form.processing}>
                            {isEdit ? 'Aktualizuj i Kontynuuj Edycję' : 'Utwórz i Kontynuuj Edycję'}
                        </button>
                        <button type="submit" className="rounded-lg bg-mint px-4 py-2 font-semibold cursor-pointer" disabled={form.processing}>
                            {isEdit ? 'Aktualizacja Wymaganie' : 'Utwórz Wymaganie'}
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
