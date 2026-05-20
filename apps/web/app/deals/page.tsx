import { ProductCard } from '../../components/site/product-card';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Сделки дня — Честная Скидка',
  description: 'Подборка актуальных предложений с проверкой реальности скидки и историей цены.',
  alternates: { canonical: '/deals' }
};

async function loadProducts() {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://api:3001/api';
  const res = await fetch(`${base}/products?limit=150`, { cache: 'no-store' });
  if (!res.ok) return [];
  const items = await res.json();
  return (items || []).map((p: any) => ({
    id: p.id,
    slug: p.slug,
    name: p.title,
    image: p.imageUrl || 'https://placehold.co/400x400',
    brand: 'Яндекс Маркет',
    category: p.categorySlug || 'other',
    current: Number(p.currentPrice),
    old: Number(p.oldPrice ?? p.currentPrice),
    verdict: Number(p.oldPrice ?? p.currentPrice) > Number(p.currentPrice) ? 'REAL_DISCOUNT' : 'WEAK_DISCOUNT'
  }));
}

type DealsProps = {
  searchParams?: { q?: string; category?: string };
};

export default async function Deals({ searchParams }: DealsProps) {
const products = await loadProducts();
const categories = Array.from(new Set(products.map((p: any) => p.category))).map((slug) => ({ slug, name: slug }));
const q = (searchParams?.q || '').trim().toLowerCase();
const category = (searchParams?.category || '').trim();
const filtered = products.filter((p: any) => {
  const byQ = !q || String(p.name).toLowerCase().includes(q);
  const byCategory = !category || p.category === category;
  return byQ && byCategory;
});

return <div className='space-y-6'>
  <section className='rounded-3xl bg-gradient-to-r from-[#1d2320] via-[#243029] to-[#719d2a] p-7 text-white'>
    <h1 className='text-4xl font-black'>Сделки дня</h1>
    <p className='mt-2 text-slate-100 max-w-2xl'>Только товары с заметной выгодой и понятной историей цен.</p>
  </section>

  <form method='GET' action='/deals' className='grid md:grid-cols-4 gap-2'>
    <input name='q' defaultValue={searchParams?.q || ''} className='border p-2 rounded-xl' placeholder='Поиск по названию' />
    <select name='category' defaultValue={category} className='border p-2 rounded-xl'>
      <option value=''>Все категории</option>
      {categories.map(c=><option key={c.slug} value={c.slug}>{c.name}</option>)}
    </select>
    <button type='submit' className='rounded-xl bg-slate-900 text-white px-4 py-2 hover:bg-slate-700'>Применить</button>
    <a href='/deals' className='rounded-xl border border-slate-300 px-4 py-2 text-center hover:bg-slate-50'>Сбросить</a>
  </form>

  <p className='text-sm text-slate-600'>Найдено товаров: <b>{filtered.length}</b></p>
  <div className='grid md:grid-cols-3 gap-3'>{filtered.map((p: any)=><ProductCard key={p.id} p={p}/>)}</div>
  {filtered.length === 0 && <p className='text-slate-600'>По выбранным фильтрам ничего не найдено.</p>}
</div>
}
