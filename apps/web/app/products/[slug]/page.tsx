'use client';
import { products, history } from '../../../lib/mock-data';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function ProductPage({params}:{params:{slug:string}}){
  const p=products.find(x=>x.slug===params.slug)??products[0];
  const min7=Math.min(...history.slice(-7).map(h=>h.price));
  const min30=min7, min90=min7; const avg30=Math.round(history.reduce((a,b)=>a+b.price,0)/history.length);
  return <div className='space-y-4'><div className='grid md:grid-cols-2 gap-4'><img src={p.image} alt={p.name} className='rounded border'/><div><h1 className='text-3xl font-bold'>{p.name}</h1><p className='text-2xl font-bold'>₽{p.current} <span className='line-through text-slate-400 text-lg'>₽{p.old}</span></p><p>Скидка: {Math.round(((p.old-p.current)/p.old)*100)}%</p><p>Вердикт: <b>{p.verdict}</b></p><div className='flex gap-2 mt-2'><button className='border rounded px-3 py-2'>Следить за ценой</button><a className='border rounded px-3 py-2' href={`/r/${p.id}?source=site&campaign=product_${p.slug}`}>Купить на Маркете</a></div></div></div>
  <div className='border rounded p-3 h-64'><ResponsiveContainer width='100%' height='100%'><LineChart data={history}><XAxis dataKey='day'/><YAxis/><Tooltip/><Line dataKey='price' stroke='#2563eb'/></LineChart></ResponsiveContainer></div>
  <div className='grid md:grid-cols-4 gap-2 text-sm'><div className='border rounded p-2'>Мин 7д: {min7}</div><div className='border rounded p-2'>Мин 30д: {min30}</div><div className='border rounded p-2'>Мин 90д: {min90}</div><div className='border rounded p-2'>Средняя 30д: {avg30}</div></div>
  <div><h3 className='font-semibold'>Похожие товары</h3><ul className='list-disc ml-5'>{products.filter(x=>x.id!==p.id).map(x=><li key={x.id}>{x.name}</li>)}</ul></div>
  </div>
}
