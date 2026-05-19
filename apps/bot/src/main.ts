import 'dotenv/config';
import { Markup, Telegraf } from 'telegraf';

type User = { telegramId: string; username?: string; favorites: string[]; watch?: { productId: string; target?: number } };
const users = new Map<string, User>();
const products = [
  { id: 'p1', title: 'iPhone 15 128GB', current: 72490, old: 79990, min30: 72490, category: 'Смартфоны' },
  { id: 'p2', title: 'Samsung S24', current: 58990, old: 64990, min30: 57990, category: 'Смартфоны' },
  { id: 'p3', title: 'Xiaomi 14', current: 49990, old: 54990, min30: 48990, category: 'Смартфоны' }
];
const categories = ['Смартфоны', 'Телевизоры', 'Дом'];
const searchRequests: string[] = [];
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN || '');
const publicBase = process.env.PUBLIC_WEB_URL ?? 'https://domain.ru';

const mainMenu = Markup.keyboard([['🔥 Скидки дня', '🔎 Найти товар'], ['⭐ Избранное', '📉 Следить за ценой'], ['⚙️ Настройки']]).resize();
const buyUrl = (productId: string, campaign: string) => `${publicBase}/r/${productId}?source=telegram&campaign=${campaign}`;
const userOf = (ctx: any) => {
  const id = String(ctx.from.id);
  if (!users.has(id)) users.set(id, { telegramId: id, username: ctx.from.username, favorites: [] });
  return users.get(id)!;
};

bot.start((ctx) => {
  userOf(ctx); // create user + save telegramId
  ctx.reply('Привет! Я бот Честной Скидки. Помогу найти реальные скидки.', mainMenu);
});

bot.help((ctx) => ctx.reply('/start /help /deals /search /watch /favorites /categories /settings /premium'));

bot.command('deals', (ctx) => {
  products.slice(0, 3).forEach((p) => {
    const discount = Math.round(((p.old - p.current) / p.old) * 100);
    ctx.reply(`🔥 ${p.title}\nБыло: ${p.old} ₽\nСтало: ${p.current} ₽\nСкидка: ${discount}%`, Markup.inlineKeyboard([
      [Markup.button.callback('Следить', `watch_${p.id}`), Markup.button.url('Купить', buyUrl(p.id, `deal_${p.id}`))],
      [Markup.button.url('Подробнее', `${publicBase}/products/${p.id}`), Markup.button.callback('В избранное', `fav_${p.id}`)]
    ]));
  });
});

bot.command('search', (ctx) => {
  const query = ctx.message.text.replace('/search', '').trim();
  if (!query) return ctx.reply('Использование: /search iphone 15');
  const found = products.filter((p) => p.title.toLowerCase().includes(query.toLowerCase()));
  if (!found.length) {
    searchRequests.push(query);
    return ctx.reply('Пока не нашли этот товар в базе. Я добавил запрос в очередь на проверку.');
  }
  found.forEach((p) => ctx.reply(`${p.title} — ${p.current} ₽`, Markup.inlineKeyboard([[Markup.button.url('Купить', buyUrl(p.id, `search_${query}`)), Markup.button.callback('Следить', `watch_${p.id}`)]])));
});

bot.command('watch', (ctx) => ctx.reply('Выберите товар для отслеживания:', Markup.inlineKeyboard(products.map((p) => [Markup.button.callback(p.title, `watch_${p.id}`)]))));

bot.command('favorites', (ctx) => {
  const user = userOf(ctx);
  if (!user.favorites.length) return ctx.reply('Избранное пока пусто.');
  user.favorites.forEach((id) => {
    const p = products.find((x) => x.id === id);
    if (p) ctx.reply(`⭐ ${p.title} — ${p.current} ₽`, Markup.inlineKeyboard([[Markup.button.url('Купить', buyUrl(p.id, `favorite_${p.id}`))]]));
  });
});

bot.command('categories', (ctx) => ctx.reply(`Категории:\n${categories.join('\n')}`));
bot.command('settings', (ctx) => ctx.reply('Настройки уведомлений: Telegram ✅, Email ⛔'));
bot.command('premium', (ctx) => ctx.reply('Premium открывает быстрые уведомления и расширенную аналитику.'));

bot.hears('🔥 Скидки дня', (ctx) => ctx.telegram.sendMessage(ctx.chat.id, '/deals'));
bot.hears('🔎 Найти товар', (ctx) => ctx.reply('Напишите команду: /search iphone 15'));
bot.hears('⭐ Избранное', (ctx) => ctx.telegram.sendMessage(ctx.chat.id, '/favorites'));
bot.hears('📉 Следить за ценой', (ctx) => ctx.telegram.sendMessage(ctx.chat.id, '/watch'));
bot.hears('⚙️ Настройки', (ctx) => ctx.telegram.sendMessage(ctx.chat.id, '/settings'));

bot.action(/fav_(.+)/, (ctx) => {
  const user = userOf(ctx);
  const productId = ctx.match[1];
  if (!user.favorites.includes(productId)) user.favorites.push(productId);
  ctx.answerCbQuery('Добавлено в избранное');
});

bot.action(/watch_(.+)/, (ctx) => {
  const user = userOf(ctx);
  user.watch = { productId: ctx.match[1] };
  ctx.reply('Введите целевую цену (числом):');
  ctx.answerCbQuery();
});

bot.on('text', (ctx) => {
  const user = userOf(ctx);
  if (!user.watch || user.watch.target) return;
  const value = Number(ctx.message.text);
  if (Number.isNaN(value)) return ctx.reply('Введите корректную цену, например 70000');
  user.watch.target = value;
  const p = products.find((x) => x.id === user.watch!.productId);
  ctx.reply(`Сохранил правило: ${p?.title} <= ${value} ₽`);
});

// mock notification example helper
bot.command('mockdrop', (ctx) => {
  const p = products[0];
  ctx.reply(`📉 Цена упала!\n\nТовар: ${p.title}\nБыло: ${p.old.toLocaleString('ru-RU')} ₽\nСтало: ${p.current.toLocaleString('ru-RU')} ₽\nСкидка: 9%\nМинимальная цена за 30 дней: ${p.min30.toLocaleString('ru-RU')} ₽`, Markup.inlineKeyboard([
    [Markup.button.url('Купить на Маркете', buyUrl(p.id, 'drop_alert')), Markup.button.callback('Больше не следить', `unwatch_${p.id}`)]
  ]));
});

bot.action(/unwatch_(.+)/, (ctx) => { const user = userOf(ctx); user.watch = undefined; ctx.answerCbQuery('Отключили отслеживание'); });

if (process.env.TELEGRAM_BOT_TOKEN) bot.launch();
