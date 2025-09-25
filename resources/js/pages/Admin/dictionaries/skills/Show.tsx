import { Link, usePage } from '@inertiajs/react'
import AdminLayout from '@/layouts/admin-layout'

type Skill = {
    id:number; name_pl:string; name_de:string|null;
    is_visible_pl:boolean; is_visible_de:boolean;
    created_at?:string; updated_at?:string;
}
const BASE = '/admin/dictionaries/skills'

export default function Show(){
    const { skill } = usePage<{ skill: Skill }>().props

    return (
        <AdminLayout>
            <main className="p-6">
                <div className="text-sm text-slate-500">Szczegóły Umiejętność: {skill.id}</div>
                <div className="mt-1 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Szczegóły Umiejętność: {skill.id}</h1>
                    <div className="flex gap-2">
                        <Link href={`${BASE}/${skill.id}/edit`} className="rounded-lg border px-3 py-1 hover:bg-slate-50">✎</Link>
                        <Link href={BASE} className="rounded-lg border px-3 py-1 hover:bg-slate-50">↩︎</Link>
                    </div>
                </div>

                <div className="mt-6 overflow-hidden rounded-xl border bg-white">
                    <dl className="divide-y">
                        <Row label="ID">{skill.id}</Row>
                        <Row label="Nazwa">{skill.name_pl}</Row>
                        <Row label="Widoczność na polskiej stronie">{skill.is_visible_pl ? '✅' : '❌'}</Row>
                        <Row label="Widoczność na niemieckiej stronie">{skill.is_visible_de ? '✅' : '❌'}</Row>
                    </dl>
                </div>

                <div className="py-6 text-center text-xs text-slate-500">Senior na plus {new Date().getFullYear()}</div>
            </main>
        </AdminLayout>
    )
}
function Row({label, children}:{label:string; children:React.ReactNode}){
    return (
        <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-3">
            <dt className="text-sm font-medium">{label}</dt>
            <dd className="md:col-span-2">{children}</dd>
        </div>
    )
}
