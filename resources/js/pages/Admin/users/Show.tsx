import { Link, usePage } from '@inertiajs/react'
import AdminLayout from '@/layouts/admin-layout'
import { Pencil } from 'lucide-react'

type U = { id:number; name:string|null; email:string; avatar_url:string }

const BASE = '/admin/users'

export default function Show(){
    const { user } = usePage<{ user:U }>().props
    return (
        <AdminLayout>
            <main className="p-6">
                <div className="text-sm text-slate-500">
                    <Link href={BASE} className="text-sky-700 hover:underline">Użytkownicy</Link>
                    &nbsp;&rsaquo;&nbsp; Szczegóły Użytkownik: {user.name || '—'}
                </div>

                <div className="mt-4 rounded-xl border bg-white p-4">
                    <div className="grid gap-4">
                        <div><div className="text-xs text-slate-500">ID</div><div className="font-semibold">{user.id}</div></div>
                        <div>
                            <div className="text-xs text-slate-500">Avatar</div>
                            <img src={user.avatar_url} alt="" className="mt-2 h-16 w-16 rounded-full"/>
                        </div>
                        <div><div className="text-xs text-slate-500">Imię</div><div>{user.name || '—'}</div></div>
                        <div><div className="text-xs text-slate-500">Email</div><div>{user.email}</div></div>
                    </div>

                    <div className="mt-6">
                        <Link href={`${BASE}/${user.id}/edit`} className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
                            <Pencil className="h-4 w-4" /> Edytuj
                        </Link>
                    </div>
                </div>
            </main>
        </AdminLayout>
    )
}
