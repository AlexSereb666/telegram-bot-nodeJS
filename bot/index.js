const TelegramBot = require('node-telegram-bot-api');
const config = require('./config');
const storage = require('./store/index')

const { startCommand, choiceMenu } = require('./commands/commands');
const { feedbackAdd } = require('./action/feedback');
const { productBasketAdd } = require('./action/basket');
const { getUserByTelegramId, getUserById, getAllClient } = require('./http/userAPI');
const { generateChoicePayment } = require('./keyboard/generateKeyboard');
const { freeShippingThreshold, costDelivery } = require('./const/info');
const { getProductStatistics, getSalesStatistics,
    getEmployeeStatistics, getClientStatistics } = require('./http/statisticsAPI');

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
            } else if (data.type === 'menuProducts') {
                const user = await getUserByTelegramId(msg.from.id)
                productBasketAdd(user.id, data.cartItems)
                await bot.sendMessage(msg.chat.id, "Вы успешно добавили продукты в корзину! Перейдите в меню корзины для оформления заказ 🛒")
            } else if (data.type === 'basketProducts') {
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
            } else if (data.type === 'message') {
                const user = await getUserById(data.idUser);
                bot.sendMessage(user.user.chatId, data.message);
            } else if (data.type === 'messageAll') {
                const users = await getAllClient();
                users.map((item) => {
                    bot.sendMessage(item.chatId, data.message);
                })
            } else if (data.type === 'messageWork') {
                const users = await getAllClient();
                users.map((item) => {
                    if (item.role !== 'USER') {
                        bot.sendMessage(item.chatId, data.message);
                    }
                })
            } else if (data.type === 'Продажи' || data.type === 'Продукты' 
            || data.type === 'Клиенты' || data.type === 'Сотрудники') {

                const user = await getUserByTelegramId(msg.from.id)
                let message = `Результат запроса\n\n`

                if (data.type === 'Продукты') {
                    const list = await getProductStatistics(data.from, data.before)

                    list.map((item) => {
                        message += `${item.product} - продано: ${item.quantity} ед.\n`
                    })

                } else if (data.type === 'Продажи') {
                    const list = await getSalesStatistics(data.from, data.before)

                    message += `Всего заказов: ${list.totalOrders} ед.\n`
                    message += `Продано продуктов: ${list.totalProductsSold} ед.\n`
                    message += `Прибыль: ${list.totalRevenue} руб.\n`
                    message += `Успешных заказов: ${list.completedOrders}\n`
                    message += `Отмененных заказов: ${list.cancelledOrders}\n`

                } else if (data.type === 'Сотрудники') {
                    const list = await getEmployeeStatistics(data.from, data.before)

                    list.map((item) => {
                        message += `${item.name}\n`
                        message += `${item.role === 'BARISTA' ? 'Бариста' : 'Курьер'}\n`
                        message += `Выполнено заказов: ${item.successfulOrders}\n\n`
                    })
                } else if (data.type === 'Клиенты') {
                    const list = await getClientStatistics(data.from, data.before)

                    list.map((item) => {
                        message += `${item.name}\n`
                        message += `Сделано заказов: ${item.successfulOrders} ед.\n`
                        message += `Отменено заказов: ${item.cancelledOrders} ед.\n`
                        message += `Принес прибыли: ${item.totalRevenue} руб.\n\n`
                    })
                }

                bot.sendMessage(user.chatId, message);
            }
        } catch (e) {
            console.log(e)
        }
    }

    choiceMenu(bot, msg, storage);
});
