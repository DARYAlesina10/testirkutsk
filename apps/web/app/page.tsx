import Link from 'next/link';
import { ProductCard } from '../components/site/product-card';

type PageProps = { searchParams?: { q?: string } };

export const metadata = {
  title: 'Честная Скидка — реальные скидки на Яндекс Маркете',
  description: 'Сравнивайте историю цен, находите настоящие скидки и покупайте выгодно. Мониторинг цен, подбор лучших предложений и уведомления о снижении стоимости.'
};

async function loadProducts(query?: string) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://api:3001/api';
  try {
    const res = await fetch(`${base}/products?limit=120`, { cache: 'no-store' });
    if (!res.ok) return [];
    const products = await res.json();
    const normalized = (products || []).map((p: any) => ({
      id: p.id,
      slug: p.slug,
      name: p.title,
      image: p.imageUrl || 'https://placehold.co/400x400',
      brand: 'Яндекс Маркет',
      category: p.categoryId,
      current: Number(p.currentPrice),
      old: Number(p.oldPrice ?? p.currentPrice),
      verdict: Number(p.oldPrice ?? p.currentPrice) > Number(p.currentPrice) ? 'REAL_DISCOUNT' : 'WEAK_DISCOUNT',
      rating: 80
    }));

    const q = (query || '').trim().toLowerCase();
    if (!q) return normalized;
    return normalized.filter((p: any) => p.name.toLowerCase().includes(q));
  } catch {
    return [];
  }
}

async function loadCategories() {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://api:3001/api';
  try {
    const res = await fetch(`${base}/categories`, { cache: 'no-store' });
    if (!res.ok) return [];
    const categories = await res.json();
    return (categories || []).map((c: any) => ({ slug: c.slug, name: c.name }));
  } catch {
    return [];
  }
}

export default async function Home({ searchParams }: PageProps) {
  const query = searchParams?.q ?? '';
  const products = await loadProducts(query);
  const categories = await loadCategories();

  return <main className='space-y-12 pb-10'>
    <header className='rounded-[2rem] overflow-hidden bg-slate-950 text-white border border-slate-800'>
      <section className='px-8 py-10 bg-gradient-to-r from-slate-950 via-slate-900 to-lime-900'>
        <p className='text-lime-300 text-xs uppercase tracking-widest font-semibold'>Агрегатор честных скидок</p>
        <h1 className='text-4xl md:text-5xl font-black mt-3 max-w-3xl'>Проверяем цены и показываем только реальные скидки на Яндекс Маркете</h1>
        <p className='text-slate-200 mt-4 max-w-2xl'>Честная Скидка — сервис для умных покупок: анализ истории цен, понятная оценка скидки и быстрый переход к выгодному предложению.</p>
        <form method='GET' className='mt-6 flex gap-2 max-w-2xl'>
          <label htmlFor='search' className='sr-only'>Поиск товаров со скидкой</label>
          <input id='search' name='q' defaultValue={query} className='flex-1 rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-white placeholder:text-slate-400' placeholder='Например: телевизор 55 4k, робот пылесос xiaomi' />
          <button type='submit' className='rounded-xl bg-lime-400 text-slate-950 font-semibold px-5 py-3 hover:bg-lime-300'>Найти скидки</button>
        </form>
      </section>
    </header>

    <section aria-labelledby='deals-title'>
      <div className='flex items-center justify-between mb-4'>
        <h2 id='deals-title' className='text-2xl font-bold text-slate-900'>Лучшие скидки сегодня</h2>
        {query ? <span className='text-sm text-slate-600'>Результаты по запросу: <b>{query}</b> ({products.length})</span> : null}
      </div>
      <div className='grid md:grid-cols-3 gap-4'>{products.map((p: any) => <ProductCard key={p.id} p={p} />)}</div>
      {products.length === 0 && <p className='text-slate-600 mt-4'>По запросу ничего не найдено. Измените формулировку и повторите поиск.</p>}
    </section>

    <section aria-labelledby='categories-title' className='rounded-3xl border border-slate-200 bg-white p-6'>
      <h2 id='categories-title' className='text-2xl font-bold'>Популярные категории товаров</h2>
      <p className='text-slate-600 mt-1'>Выберите направление и смотрите только релевантные предложения с проверенной скидкой.</p>
      <nav className='flex gap-2 flex-wrap mt-4' aria-label='Категории каталога'>
        {categories.map((c: any) => <Link key={c.slug} className='border border-slate-200 bg-slate-50 rounded-full px-4 py-2 hover:bg-slate-100' href={`/categories/${c.slug}`}>{c.name}</Link>)}
      </nav>
    </section>

    <section aria-labelledby='seo-about' className='grid md:grid-cols-3 gap-4'>
      <article className='rounded-2xl bg-lime-600 text-white p-5'>
        <h3 id='seo-about' className='font-bold text-xl'>Как мы определяем настоящую скидку</h3>
        <p className='mt-2 text-lime-50'>Сервис анализирует динамику цены за 7/30/90 дней и отмечает предложения, где снижение стоимости подтверждается историей.</p>
      </article>
      <article className='rounded-2xl border border-slate-200 bg-white p-5'>
        <h3 className='font-bold text-xl'>SEO-фразы для охвата</h3>
        <p className='mt-2 text-slate-600'>Реальные скидки, мониторинг цен, выгодные покупки на Яндекс Маркете, сравнение цен и уведомления о снижении стоимости.</p>
      </article>
      <article className='rounded-2xl border border-slate-200 bg-white p-5'>
        <h3 className='font-bold text-xl'>Быстрый старт</h3>
        <p className='mt-2 text-slate-600'>Подключите Telegram-бота, сохраните товары в избранное и получайте уведомления, когда цена становится действительно выгодной.</p>
      </article>
    </section>
  </main>;
}
