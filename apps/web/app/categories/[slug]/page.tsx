import { products } from '../../../lib/mock-data';
import { ProductCard } from '../../../components/site/product-card';
export default function Page({params}:{params:{slug:string}}){const list=products.filter(p=>p.category===params.slug); return <div><h1 className='text-3xl font-bold mb-3'>Категория: {params.slug}</h1><div className='grid md:grid-cols-3 gap-3'>{list.map(p=><ProductCard key={p.id} p={p}/>)}</div></div>}
