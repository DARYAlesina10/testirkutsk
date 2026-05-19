import { products, categories } from '../../lib/mock-data';
import { ProductCard } from '../../components/site/product-card';

export default function Deals(){
return <div><h1 className='text-3xl font-bold mb-3'>/deals</h1><div className='grid md:grid-cols-6 gap-2 mb-4'><input className='border p-2 rounded' placeholder='Поиск'/><select className='border p-2 rounded'><option>Категория</option>{categories.map(c=><option key={c.slug}>{c.name}</option>)}</select><input className='border p-2 rounded' placeholder='Бренд'/><input className='border p-2 rounded' placeholder='Цена до'/><input className='border p-2 rounded' placeholder='% скидки от'/><select className='border p-2 rounded'><option>Рейтинг честности</option></select></div><div className='flex justify-between mb-3'><select className='border p-2 rounded'><option>Сортировка</option></select><div className='text-sm text-slate-500'>Пагинация: 1 / 1</div></div><div className='grid md:grid-cols-3 gap-3'>{products.map(p=><ProductCard key={p.id} p={p}/>)}</div></div>
}
