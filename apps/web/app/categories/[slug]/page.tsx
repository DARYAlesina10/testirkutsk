import { ProductCard } from '../../../components/site/product-card';

async function loadProductsByCategory(slug: string) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://api:3001/api';
  const res = await fetch(`${base}/products?limit=150`, { cache: 'no-store' });
  if (!res.ok) return [];
  const items = await res.json();
  return (items || [])
    .filter((p: any) => p.categorySlug === slug)
    .map((p: any) => ({
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

export default async function Page({params}:{params:{slug:string}}){
  const list = await loadProductsByCategory(params.slug);
  return <div><h1 className='text-3xl font-bold mb-3'>Категория: {params.slug}</h1><div className='grid md:grid-cols-3 gap-3'>{list.map((p: any)=><ProductCard key={p.id} p={p}/>)}</div></div>
}
