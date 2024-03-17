const TelegramBot = require('node-telegram-bot-api');
const config = require('./config');
const storage = require('./store/index')

const { startCommand, choiceMenu } = require('./commands/commands');
const { feedbackAdd } = require('./action/feedback');
const { productBasketAdd } = require('./action/basket');
const { getUserByTelegramId } = require('./http/userAPI');
const { generateChoicePayment } = require('./keyboard/generateKeyboard');
const { freeShippingThreshold, costDelivery } = require('./const/info')

const token = config.TELEGRAM_BOT_TOKEN;

const bot = new TelegramBot(token, {polling: true});

// первый контакт с ботом //
bot.onText(/\/start/, async (msg) => {
    startCommand(bot, msg, storage);
});

bot.on('message', async (msg) => {
    // вернулись данные с веб-приложения //
    if (msg?.web_app_data?.data) {
        try {
            const data = JSON.parse(msg.web_app_data.data)
            if (data.type === 'feedback') {
                feedbackAdd(data, bot, msg)
            }
            else if (data.type === 'menuProducts') {
                const user = await getUserByTelegramId(msg.from.id)
                productBasketAdd(user.id, data.cartItems)
                await bot.sendMessage(msg.chat.id, "Вы успешно добавили продукты в корзину! Перейдите в меню корзины для оформления заказ 🛒")
            }
            else if (data.type === 'basketProducts') {
                console.log(data?.delivery)
                storage.setProductOrder(data)

                const menuKeyboard = await generateChoicePayment()

                let priceOrder = data.products.reduce((accumulator, currentValue) => {
                    return accumulator + currentValue.price;
                }, 0);

                if (data.delivery && priceOrder < freeShippingThreshold()) {
                    priceOrder += costDelivery();
                }

                let message = `Выберите банк оплаты 🏦\nСтоимость заказа ${priceOrder}₽`;
                if (data.delivery) {
                    message += `\nС доставкой*`;
                }

                bot.sendMessage(msg.chat.id, message, {
                    reply_markup: {
                        keyboard: menuKeyboard,
                        resize_keyboard: true,
                        one_time_keyboard: true
                    }
                });
            }
        } catch (e) {
            console.log(e)
        }
    }

    choiceMenu(bot, msg, storage);
});
