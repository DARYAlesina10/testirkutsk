import Link from 'next/link';
import { notFound } from 'next/navigation';

type Props = { params: { slug: string } };

async function loadProduct(slug: string) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://api:3001/api';
  const res = await fetch(`${base}/products/slug/${slug}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

async function loadRelated(categoryId: string, currentId: string) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://api:3001/api';
  const res = await fetch(`${base}/products?limit=8`, { cache: 'no-store' });
  if (!res.ok) return [];
  const list = await res.json();
  return (list || []).filter((p: any) => p.categoryId === categoryId && p.id !== currentId).slice(0, 4);
}

export default async function ProductPage({ params }: Props) {
  const product = await loadProduct(params.slug);
  if (!product) return notFound();

  const oldPrice = Number(product.oldPrice ?? product.currentPrice);
  const currentPrice = Number(product.currentPrice);
  const discount = oldPrice > 0 ? Math.max(0, Math.round(((oldPrice - currentPrice) / oldPrice) * 100)) : 0;
  const related = await loadRelated(product.categoryId, product.id);

  return <div className='space-y-5'>
    <div className='grid md:grid-cols-2 gap-5 rounded-2xl border border-slate-200 bg-white p-5'>
      <img src={product.imageUrl || 'https://placehold.co/600x600'} alt={product.title} className='rounded-xl border w-full max-w-xl aspect-square object-cover bg-slate-100' />
      <div>
        <h1 className='text-3xl font-bold'>{product.title}</h1>
        <p className='text-2xl font-bold mt-3'>₽{currentPrice} <span className='line-through text-slate-400 text-lg'>₽{oldPrice}</span></p>
        <p className='mt-1 text-emerald-700 font-medium'>Скидка: {discount}%</p>
        <div className='flex gap-2 mt-4'>
          <button className='border rounded px-4 py-2 bg-white hover:bg-slate-50'>Следить за ценой</button>
          <a className='rounded px-4 py-2 bg-slate-900 text-white hover:bg-slate-700' href={`/api/r/${product.id}?source=site&campaign=product_${product.slug}`}>Купить на Маркете</a>
        </div>
      </div>
    </div>

    <div className='rounded-2xl border border-slate-200 bg-white p-5'>
      <h3 className='font-semibold mb-3'>Похожие товары</h3>
      {related.length === 0 ? <p className='text-slate-500'>Похожих товаров пока нет.</p> :
        <ul className='list-disc ml-5 space-y-1'>{related.map((x: any) => <li key={x.id}><Link className='text-blue-700 hover:underline' href={`/products/${x.slug}`}>{x.title}</Link></li>)}</ul>}
    </div>
  </div>;
}
