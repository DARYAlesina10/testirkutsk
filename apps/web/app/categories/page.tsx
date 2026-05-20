import Link from 'next/link';

async function loadCategories() {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://api:3001/api';
  const res = await fetch(`${base}/products?limit=150`, { cache: 'no-store' });
  if (!res.ok) return [];
  const items = await res.json();
  const slugs = Array.from(new Set((items || []).map((p: any) => p.categorySlug).filter(Boolean)));
  return slugs.map((slug) => ({ slug, name: slug }));
}

export default async function Categories(){
  const categories = await loadCategories();
  return <div><h1 className='text-3xl font-bold mb-3'>Категории</h1><div className='grid md:grid-cols-3 gap-3'>{categories.map((c: any)=><Link className='border rounded p-4' href={`/categories/${c.slug}`} key={c.slug}>{c.name}</Link>)}</div></div>
}
