import { Link, router, useForm, usePage } from '@inertiajs/react'
import AdminLayout from '@/layouts/admin-layout'

type U = { id?:number; name?:string|null; email?:string } | null
const BASE = '/admin/users'

export default function Form(){
    const { user, mode } = usePage<{ user:U, mode:'create'|'edit' }>().props

    const { data, setData, processing, errors, post, put } = useForm({
        name: user?.name ?? '',
        email: user?.email ?? '',
        password: '' as string,
        stay: false,
    })

    const submit = (e:React.FormEvent) => {
        e.preventDefault()
        if (mode === 'create') {
            post(`${BASE}`, {})
        } else {
            put(`${BASE}/${user?.id}`, {})
        }
    }

    return (
        <AdminLayout>
            <main className="p-6">
                <div className="text-sm text-slate-500">
                    <Link href={BASE} className="text-sky-700 hover:underline">Użytkownicy</Link>
                    &nbsp;&rsaquo;&nbsp; {mode==='create' ? 'Utwórz Użytkownik' : `Aktualizacja Użytkownik: ${user?.name ?? ''}`}
                </div>

                <form onSubmit={submit} className="mt-4 rounded-xl border bg-white p-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Imię *</label>
                        <input value={data.name ?? ''} onChange={(e)=>setData('name', e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" />
                        {errors.name && <div className="text-sm text-rose-600 mt-1">{errors.name}</div>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Email *</label>
                        <input value={data.email} onChange={(e)=>setData('email', e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" />
                        {errors.email && <div className="text-sm text-rose-600 mt-1">{errors.email}</div>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Hasło {mode==='create' ? '*' : ''}</label>
                        <input type="password" value={data.password} onChange={(e)=>setData('password', e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" placeholder="Hasło" />
                        {errors.password && <div className="text-sm text-rose-600 mt-1">{errors.password}</div>}
                    </div>

                    <div className="flex items-center justify-end gap-3 border-t px-4 py-3">
                        <button disabled={processing} className="rounded-lg bg-mint px-4 py-2 font-semibold cursor-pointer">
                            {mode==='create' ? 'Utwórz Użytkownik' : 'Aktualizuj Użytkownik'}
                        </button>

                        {mode==='edit' && (
                            <button
                                type="button"
                                onClick={()=>{
                                    setData('stay', true)
                                    router.post(`${BASE}/${user?.id}`, { ...data, _method: 'PUT' })
                                }}
                                className="rounded-lg bg-mint px-4 py-2 font-semibold cursor-pointer"
                            >
                                Aktualizuj i Kontynuuj Edycję
                            </button>
                        )}

                        <Link href={BASE} className="rounded-lg border px-4 py-2 hover:bg-slate-50">Anuluj</Link>
                    </div>
                </form>
            </main>
        </AdminLayout>
    )
}
