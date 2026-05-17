async function getProducts() {
  const base = process.env.NEXT_PUBLIC_API_URL ?? 'http://api:3001/api';
  const res = await fetch(`${base}/products`, { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

export default async function CatalogPage() {
  const products = await getProducts();
  return <div><h1>catalog</h1><ul>{products.map((p: any) => <li key={p.id}>{p.title} — {p.currentPrice}</li>)}</ul></div>;
}
