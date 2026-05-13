import Link from 'next/link';
import { categories, products } from '../lib/mock-data';
import { ProductCard } from '../components/site/product-card';

export default function Home(){
return <main className='space-y-8'><section><h1 className='text-4xl font-bold'>Честная Скидка</h1><p className='text-slate-600'>Мониторинг реальных скидок на Яндекс Маркете</p><div className='mt-3 flex gap-2'><input className='border p-2 rounded w-full max-w-lg' placeholder='Поиск товара'/><button className='border px-4 rounded'>Найти</button></div></section>
<section><h2 className='text-2xl font-semibold mb-3'>Лучшие скидки дня</h2><div className='grid md:grid-cols-3 gap-3'>{products.map(p=><ProductCard key={p.id} p={p}/>)}</div></section>
<section><h2 className='text-2xl font-semibold'>Категории</h2><div className='flex gap-2 flex-wrap mt-2'>{categories.map(c=><Link key={c.slug} className='border rounded px-3 py-1' href={`/categories/${c.slug}`}>{c.name}</Link>)}</div></section>
<section><h2 className='text-2xl font-semibold'>Как это работает</h2><ol className='list-decimal ml-5 text-slate-700'><li>Мы собираем историю цен</li><li>Считаем честность скидки</li><li>Присылаем уведомления</li></ol></section>
<section><h2 className='text-2xl font-semibold'>Telegram-бот</h2><p>Подключите бота и получайте скидки мгновенно.</p></section>
<section><h2 className='text-2xl font-semibold'>Тарифы</h2><Link className='text-blue-600' href='/pricing'>Смотреть тарифы</Link></section>
<section><h2 className='text-2xl font-semibold'>FAQ</h2><p className='text-slate-600'>Почему скидка может быть ложной? Мы проверяем историю цен за 7/30/90 дней.</p></section></main>
}
