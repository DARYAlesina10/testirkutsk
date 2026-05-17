import Link from 'next/link';
import { requireAdmin } from '../../lib/admin';

const nav = ['','products','users','categories','clicks','affiliate-links','partner-articles','orders','monetization','settings/yandex-affiliate'];

export default async function AdminLayout({children}:{children:React.ReactNode}){
  const isAdmin = await requireAdmin();
  if(!isAdmin) return <div className="p-6 text-red-600">Доступ только для ADMIN</div>;
  return <div className="grid md:grid-cols-[240px_1fr] gap-4"><aside className="border rounded p-3"><h2 className="font-bold mb-2">Admin</h2><ul className="space-y-1">{nav.map(n=><li key={n}><Link className="text-blue-600" href={`/admin${n?`/${n}`:''}`}>/admin{n?`/${n}`:''}</Link></li>)}</ul></aside><main>{children}</main></div>
}
