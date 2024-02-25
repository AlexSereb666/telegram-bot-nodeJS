const TelegramBot = require('node-telegram-bot-api');
const config = require('./config');
const { startCommand, choiceMenu } = require('./commands/commands');
const { feedbackAdd } = require('./action/feedback')
const { productBasketAdd } = require('./action/basket')
const { getUserByTelegramId } = require('./http/userAPI');

const token = config.TELEGRAM_BOT_TOKEN;

const bot = new TelegramBot(token, {polling: true});

// первый контакт с ботом //
bot.onText(/\/start/, async (msg) => {
    startCommand(bot, msg);
});

bot.on('message', async (msg) => {
    choiceMenu(bot, msg);

    // вернулись данные с веб-приложения //
    if (msg?.web_app_data?.data) {
        try {
            const data = JSON.parse(msg.web_app_data.data)
            if (data.type === 'feedback') {
                feedbackAdd(data, bot, msg)
            }
            else if (data.type === 'menuProducts') {
                const user = await getUserByTelegramId(msg.from.id);
                productBasketAdd(user.id, data.cartItems)
                await bot.sendMessage(msg.chat.id, "Вы успешно добавили продукты в корзину! Перейдите в меню корзины для оформления заказ 🛒")
            }
        } catch (e) {
            console.log(e)
        }
    }
});
