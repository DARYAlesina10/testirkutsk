import 'dotenv/config';
import { Telegraf, Markup } from 'telegraf';

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN || '');
const buyKeyboard = (id: string) => Markup.inlineKeyboard([Markup.button.url('Купить', `${process.env.PUBLIC_WEB_URL ?? 'http://localhost:3000'}/r/${id}`)]);

bot.start((ctx) => ctx.reply('Добро пожаловать в Честную Скидку!'));
bot.command('deals', (ctx) => ctx.reply('Топ скидки дня', buyKeyboard('demo-product')));
bot.command('search', (ctx) => ctx.reply('Поиск: отправьте название товара'));
bot.command('favorites', (ctx) => ctx.reply('Ваше избранное'));
bot.command('watch', (ctx) => ctx.reply('Отслеживание цены включено'));
bot.command('settings', (ctx) => ctx.reply('Настройки уведомлений'));

if (process.env.TELEGRAM_BOT_TOKEN) bot.launch();
