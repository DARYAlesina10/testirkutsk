import Link from 'next/link';
export default function Account(){return <div><h1 className='text-3xl font-bold'>Личный кабинет</h1><p>Текущий тариф: Premium</p><div className='flex gap-3 mt-3 flex-wrap'>{['favorites','watchlist','notifications','telegram','billing'].map(x=><Link key={x} className='border rounded px-3 py-2' href={`/account/${x}`}>/account/{x}</Link>)}</div></div>}
