import { ProductCard } from '../../components/site/product-card';

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

export default async function Deals() {
const products = await loadProducts();
const categories = Array.from(new Set(products.map((p: any) => p.category))).map((slug) => ({ slug, name: slug }));
return <div><h1 className='text-3xl font-bold mb-3'>/deals</h1><div className='grid md:grid-cols-6 gap-2 mb-4'><input className='border p-2 rounded' placeholder='Поиск'/><select className='border p-2 rounded'><option>Категория</option>{categories.map(c=><option key={c.slug}>{c.name}</option>)}</select><input className='border p-2 rounded' placeholder='Бренд'/><input className='border p-2 rounded' placeholder='Цена до'/><input className='border p-2 rounded' placeholder='% скидки от'/><select className='border p-2 rounded'><option>Рейтинг честности</option></select></div><div className='flex justify-between mb-3'><select className='border p-2 rounded'><option>Сортировка</option></select><div className='text-sm text-slate-500'>Пагинация: 1 / 1</div></div><div className='grid md:grid-cols-3 gap-3'>{products.map((p: any)=><ProductCard key={p.id} p={p}/>)}</div></div>
}
