const TelegramBot = require('node-telegram-bot-api');
const config = require('./config');
const { startCommand, choiceMenu } = require('./commands/commands');

const token = config.TELEGRAM_BOT_TOKEN;

const bot = new TelegramBot(token, {polling: true});

// первый контакт с ботом //
bot.onText(/\/start/, async (msg) => {
    startCommand(bot, msg);
});

bot.on('message', async (msg) => {
    choiceMenu(bot, msg);
});
