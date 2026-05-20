import './globals.css';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Честная Скидка — реальные скидки на Яндекс Маркете',
  description: 'Сервис проверки честности скидок: история цен, актуальные предложения и подборки выгодных товаров.',
  keywords: ['честная скидка', 'скидки яндекс маркет', 'история цен', 'проверка скидок', 'выгодные товары'],
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Честная Скидка',
    description: 'Находим реальные скидки по истории цен, а не по фейковым акциям.',
    type: 'website',
    locale: 'ru_RU'
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang='ru'>
    <body className='font-sans text-slate-900'>
      <header className='sticky top-0 z-40 border-b border-slate-800 bg-slate-950/95 backdrop-blur'>
        <div className='mx-auto max-w-7xl px-4 py-3 flex items-center justify-between gap-3'>
          <Link href='/' className='text-lime-400 font-extrabold tracking-wide'>ЧЕСТНАЯ СКИДКА</Link>
          <nav className='flex gap-2 text-sm'>
            <Link href='/' className='text-slate-200 border border-slate-700 rounded px-3 py-1.5 hover:bg-slate-800'>Главная</Link>
            <Link href='/deals' className='text-slate-200 border border-slate-700 rounded px-3 py-1.5 hover:bg-slate-800'>Сделки</Link>
            <Link href='/categories' className='text-slate-200 border border-slate-700 rounded px-3 py-1.5 hover:bg-slate-800'>Категории</Link>
            <Link href='/account' className='text-slate-200 border border-slate-700 rounded px-3 py-1.5 hover:bg-slate-800'>Личный кабинет</Link>
            <Link href='/admin' className='text-slate-200 border border-slate-700 rounded px-3 py-1.5 hover:bg-slate-800'>Админка</Link>
          </nav>
        </div>
      </header>
      <div className='mx-auto max-w-7xl px-4 py-8'>
        {children}
      </div>
    </body>
  </html>;
}
