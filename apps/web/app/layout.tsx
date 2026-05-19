import './globals.css';
import Link from 'next/link';
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="ru"><body className="p-6 font-sans"><header className="mb-6 flex gap-3 text-sm"><Link href="/" className="border rounded px-3 py-1.5">Главная</Link><Link href="/account" className="border rounded px-3 py-1.5">Личный кабинет</Link><Link href="/admin" className="border rounded px-3 py-1.5">Админка</Link></header>{children}</body></html>;
}
