import Link from 'next/link';
import { categories } from '../../lib/mock-data';
export default function Categories(){return <div><h1 className='text-3xl font-bold mb-3'>Категории</h1><div className='grid md:grid-cols-3 gap-3'>{categories.map(c=><Link className='border rounded p-4' href={`/categories/${c.slug}`} key={c.slug}>{c.name}</Link>)}</div></div>}
