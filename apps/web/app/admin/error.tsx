'use client';
export default function Error({error}:{error:Error}){return <div className='text-red-600 border p-3 rounded'>Ошибка: {error.message}</div>}
