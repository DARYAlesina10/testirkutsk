import Link from 'next/link';

export function ProductCard({ p }: { p: any }) {
  const oldPrice = Number(p.old || p.current || 0);
  const currentPrice = Number(p.current || 0);
  const discount = oldPrice > 0 ? Math.max(0, Math.round(((oldPrice - currentPrice) / oldPrice) * 100)) : 0;
  const real = p.verdict === 'REAL_DISCOUNT' || p.verdict === 'BEST_PRICE_30D';
  const detailsHref = `/products/${encodeURIComponent(p.slug || p.id)}`;

  return <article className='group border border-slate-200 rounded-2xl p-3 bg-white shadow-sm hover:shadow-lg transition'>
    <img src={p.image} alt={p.name} className='w-full rounded-xl aspect-square object-cover bg-slate-100' />
    <h3 className='font-semibold mt-3 text-slate-900 line-clamp-2'>{p.name}</h3>
    <p className='text-sm text-slate-500'>{p.brand}</p>
    <div className='flex gap-2 items-end mt-2'>
      <span className='text-xl font-bold text-slate-900'>₽{currentPrice}</span>
      <span className='line-through text-slate-400 text-sm'>₽{oldPrice}</span>
      <span className='text-emerald-700 text-sm font-medium bg-emerald-50 px-2 py-0.5 rounded-full'>-{discount}%</span>
    </div>
    <div className={`text-xs mt-2 ${real ? 'text-emerald-700' : 'text-amber-700'}`}>{real ? 'Настоящая скидка' : 'Сомнительная скидка'}</div>
    <div className='mt-3 flex gap-2'>
      <Link href={detailsHref} className='text-blue-700 text-sm font-medium'>Подробнее</Link>
      <a href={`/api/r/${p.id}?source=site&campaign=card_${p.slug || p.id}`} className='text-sm border border-slate-300 px-3 py-1.5 rounded-lg hover:bg-slate-50'>Купить на Маркете</a>
    </div>
  </article>;
}
