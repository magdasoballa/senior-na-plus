import AppLayout from '@/layouts/app-layout'
import { Link } from '@inertiajs/react'

export default function Show({ record }: { record:{
        id:number; name:string; url:string; icon?:string|null; visible_pl:boolean; visible_de:boolean
    }}) {
    return (
        <AppLayout>
            <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Szczegóły Link społecznościowy: {record.name}</h1>
                    <Link href={`/admin/settings/social-links/${record.id}/edit`} className="rounded-full bg-mint px-4 py-2 font-semibold">Edytuj</Link>
                </div>

                <div className="overflow-hidden rounded-xl border bg-white">
                    <table className="min-w-full text-sm">
                        <tbody>
                        <tr className="border-b"><th className="w-64 px-4 py-3 text-left">ID</th><td className="px-4 py-3">{record.id}</td></tr>
                        <tr className="border-b"><th className="px-4 py-3 text-left">Nazwa</th><td className="px-4 py-3">{record.name}</td></tr>
                        <tr className="border-b"><th className="px-4 py-3 text-left">Link</th><td className="px-4 py-3"><a className="text-teal-600 underline" href={record.url} target="_blank">{record.url}</a></td></tr>
                        <tr className="border-b"><th className="px-4 py-3 text-left">Ikona</th><td className="px-4 py-3">{record.icon ?? '—'}</td></tr>
                        <tr className="border-b"><th className="px-4 py-3 text-left">Widoczność na polskiej stronie</th><td className="px-4 py-3">{record.visible_pl ? '✓' : '✗'}</td></tr>
                        <tr><th className="px-4 py-3 text-left">Widoczność na niemieckiej stronie</th><td className="px-4 py-3">{record.visible_de ? '✓' : '✗'}</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    )
}
