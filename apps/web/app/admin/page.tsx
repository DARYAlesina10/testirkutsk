import { Card, CardTitle } from '../../components/ui/card';

const stats = [
['Пользователей всего','1240'],['Новых за сутки','12'],['Товаров','5321'],['Товаров со скидкой','841'],['Кликов за сутки','963'],['Партнёрских ссылок','4451'],['Партнёрских артикулов','3780'],['Заказов','223'],['Доход','₽127 450'],['Ошибок API','3'],['Активных подписок','587']
];
export default function Page(){return <div><h1 className="text-2xl font-bold mb-4">/admin Dashboard</h1><div className="grid md:grid-cols-3 gap-3">{stats.map(([k,v])=><Card key={k}><CardTitle>{k}</CardTitle><div className="text-2xl font-bold">{v}</div></Card>)}</div></div>}
