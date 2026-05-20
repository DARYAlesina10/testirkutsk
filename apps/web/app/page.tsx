import Link from 'next/link';
import { ProductCard } from '../components/site/product-card';

type PageProps = { searchParams?: { q?: string } };

async function loadProducts(query?: string) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://api:3001/api';
  const res = await fetch(`${base}/products?limit=150`, { cache: 'no-store' });
  if (!res.ok) return [];
  const items = await res.json();
  const mapped = (items || []).map((p: any) => ({
    id: p.id,
    slug: p.slug,
    name: p.title,
    image: p.imageUrl || 'https://placehold.co/400x400',
    brand: 'Яндекс Маркет',
    current: Number(p.currentPrice),
    old: Number(p.oldPrice ?? p.currentPrice),
    verdict: Number(p.oldPrice ?? p.currentPrice) > Number(p.currentPrice) ? 'REAL_DISCOUNT' : 'WEAK_DISCOUNT'
  }));
  const q = (query || '').trim().toLowerCase();
  if (!q) return mapped;
  return mapped.filter((p: any) => p.name.toLowerCase().includes(q));
}

export default async function Home({ searchParams }: PageProps) {
  const query = searchParams?.q ?? '';
  const products = await loadProducts(query);

  return <main className='space-y-10 pb-12'>
    <section className='rounded-[32px] overflow-hidden bg-[#1f2421] text-white border border-[#313b35]'>
      <div className='p-8 md:p-10 bg-gradient-to-r from-[#1b201d] via-[#202724] to-[#6f9827]'>
        <p className='text-[#b9ea53] font-semibold text-sm uppercase tracking-wide'>Честная Скидка</p>
        <h1 className='text-4xl md:text-5xl font-black mt-3 max-w-3xl'>Где найти реальные скидки на Яндекс Маркете без фейковых акций?</h1>
        <p className='mt-3 text-slate-100 max-w-2xl'>Мы анализируем историю цен и показываем только предложения, где скидка подтверждена данными.</p>
        <form method='GET' action='/' className='mt-6 flex gap-2 max-w-2xl'>
          <label htmlFor='q' className='sr-only'>Поиск товаров</label>
          <input id='q' name='q' defaultValue={query} className='flex-1 rounded-xl border border-[#6f7e71] bg-[#2a312d] px-4 py-3 text-white placeholder:text-slate-300' placeholder='Например: iphone 16, робот пылесос, телевизор 55 4k' />
          <button type='submit' className='rounded-xl bg-[#a8d23e] text-[#182110] font-bold px-5 py-3 hover:bg-[#b7de56]'>Найти</button>
        </form>
      </div>
    </section>

    <section>
      <h2 className='text-3xl font-black text-slate-900 mb-4'>Лучшие скидки дня</h2>
      {query ? <p className='text-sm text-slate-600 mb-3'>Запрос: <b>{query}</b> — найдено {products.length}</p> : null}
      <div className='grid md:grid-cols-3 gap-4'>{products.map((p: any) => <ProductCard key={p.id} p={p} />)}</div>
      {products.length === 0 && <p className='text-slate-600 mt-4'>По этому запросу ничего не найдено. Попробуйте другое название товара.</p>}
    </section>

    <section className='rounded-3xl bg-[#9fc43b] p-8 text-white'>
      <h2 className='text-3xl font-black'>Как работает сервис</h2>
      <ol className='mt-4 space-y-3'>
        <li className='bg-white/90 text-slate-800 rounded-xl p-4'><b>Шаг 1.</b> Собираем историю цен по товарам и категориям.</li>
        <li className='bg-white/90 text-slate-800 rounded-xl p-4'><b>Шаг 2.</b> Вычисляем честность скидки за 7/30/90 дней.</li>
        <li className='bg-white/90 text-slate-800 rounded-xl p-4'><b>Шаг 3.</b> Показываем выгодные предложения и ведём на покупку через безопасный редирект.</li>
      </ol>
      <div className='mt-5'>
        <Link href='/deals' className='inline-block rounded-xl bg-[#202720] px-4 py-2 font-semibold'>Смотреть все сделки</Link>
      </div>
    </section>
  </main>;
}
