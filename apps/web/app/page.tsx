import Link from 'next/link';
import { categories, products } from '../lib/mock-data';
import { ProductCard } from '../components/site/product-card';

export default function Home(){
return <main className='space-y-10'><section className='rounded-3xl bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-100 p-8'><h1 className='text-4xl font-bold text-slate-900'>Честная Скидка</h1><p className='text-slate-600 mt-2'>Мониторинг реальных скидок на Яндекс Маркете</p><div className='mt-4 flex gap-2'><input className='border border-slate-300 p-2.5 rounded-xl w-full max-w-lg bg-white' placeholder='Поиск товара'/><button className='px-5 rounded-xl bg-slate-900 text-white hover:bg-slate-700'>Найти</button></div></section>
<section><h2 className='text-2xl font-semibold mb-3'>Лучшие скидки дня</h2><div className='grid md:grid-cols-3 gap-3'>{products.map(p=><ProductCard key={p.id} p={p}/>)}</div></section>
<section><h2 className='text-2xl font-semibold'>Категории</h2><div className='flex gap-2 flex-wrap mt-2'>{categories.map(c=><Link key={c.slug} className='border border-slate-200 bg-white rounded-full px-4 py-1.5 hover:bg-slate-50' href={`/categories/${c.slug}`}>{c.name}</Link>)}</div></section>
<section className='rounded-2xl border border-slate-200 bg-white p-6'><h2 className='text-2xl font-semibold'>Как это работает</h2><ol className='list-decimal ml-5 mt-2 text-slate-700'><li>Мы собираем историю цен</li><li>Считаем честность скидки</li><li>Присылаем уведомления</li></ol></section>
<section><h2 className='text-2xl font-semibold'>Telegram-бот</h2><p>Подключите бота и получайте скидки мгновенно.</p></section>
<section><h2 className='text-2xl font-semibold'>Тарифы</h2><Link className='text-blue-600' href='/pricing'>Смотреть тарифы</Link></section>
<section><h2 className='text-2xl font-semibold'>FAQ</h2><p className='text-slate-600'>Почему скидка может быть ложной? Мы проверяем историю цен за 7/30/90 дней.</p></section></main>
}
