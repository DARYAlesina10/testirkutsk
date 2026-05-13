import Link from 'next/link';

export function ProductCard({p}:{p:any}){
  const discount=Math.round(((p.old-p.current)/p.old)*100);
  const real=p.verdict==='REAL_DISCOUNT'||p.verdict==='BEST_PRICE_30D';
  return <div className='border rounded-xl p-3 bg-white'><img src={p.image} alt={p.name} className='w-full rounded'/><h3 className='font-semibold mt-2'>{p.name}</h3><p className='text-sm text-slate-500'>{p.brand}</p><div className='flex gap-2 items-end'><span className='font-bold'>₽{p.current}</span><span className='line-through text-slate-400 text-sm'>₽{p.old}</span><span className='text-green-600 text-sm'>-{discount}%</span></div><div className={`text-xs mt-1 ${real?'text-emerald-600':'text-amber-600'}`}>{real?'Настоящая скидка':'Сомнительная скидка'}</div><div className='mt-2 flex gap-2'><Link href={`/products/${p.slug}`} className='text-blue-600 text-sm'>Подробнее</Link><a href={`/r/${p.id}?source=site&campaign=card_${p.slug}`} className='text-sm border px-2 rounded'>Купить</a></div></div>
}
