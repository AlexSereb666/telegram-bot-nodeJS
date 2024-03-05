const { getUserByTelegramId, userRegistration } = require('../http/userAPI');
const { generateMenu } = require('../keyboard/generateKeyboard');
const { adminMenu } = require('../action/index')
const { validatePhoneNumber } = require('../validation/index')
const { addOrder, addProductToOrder } = require('../http/orderAPI')
const { removeFromBasket } = require('../http/basketAPI')
const { infoOrganization, infoBot } = require('../const/info')

const startCommand = async (bot, msg) => {
    const chatId = msg.chat.id;
    const telegramId = msg.from.id;
    
    try {
        const user = await getUserByTelegramId(telegramId);
        const menuKeyboard = await generateMenu(user.role, user.id);

        if (user === 404) {
            await userRegistration(`${msg.from.first_name} ${msg.from.last_name}`, telegramId, 'USER', new Date(), chatId, 'Не указан');

            bot.sendMessage(chatId, `Приветствуем Вас в Flex Coffee, ${msg.from.first_name}! 😊
            \nВы успешно зарегистрированы в системе!\nГотовы сделать Ваш первый заказ? 🥐☕️`, {
                reply_markup: {
                    keyboard: menuKeyboard,
                    resize_keyboard: true,
                    one_time_keyboard: true
                }
            });
        } else if (user === 500) {
            bot.sendMessage(chatId, 'Произошла ошибка при обработке вашего запроса. Попробуйте позже.');
        } else {
            bot.sendMessage(chatId, `С возвращением, ${msg.from.first_name}! 😊☕️`, {
                reply_markup: {
                    keyboard: menuKeyboard,
                    resize_keyboard: true,
                    one_time_keyboard: true
                }
            });
        }
    } catch (error) {
        console.error('Ошибка при обработке команды /start:', error);
        bot.sendMessage(chatId, 'Произошла ошибка при обработке вашего запроса. Попробуйте позже.');
    }
}

const choiceMenu = async (bot, msg, storage = null) => {
    const chatId = msg.chat.id;
    const telegramId = msg.from.id;
    const text = msg.text;

    try {
        const user = await getUserByTelegramId(telegramId);
        const menuKeyboard = await generateMenu(user.role, user.id);

        if (text === 'Для администратора 👨‍💼' && user.role === 'ADMIN') {
            adminMenu(bot, msg);
        } else if (text === 'Для администратора 👨‍💼') {
            bot.sendMessage(chatId, 'У Вас нет прав для входа в меню администратора 😢');
        } 

        if (text === 'Отменить оформление заказа') {
            const menuKeyboard = await generateMenu(user.role, user.id);
            bot.sendMessage(msg.chat.id, `Главное меню Flex Coffee`, {
                reply_markup: {
                    keyboard: menuKeyboard,
                    resize_keyboard: true,
                    one_time_keyboard: true
                }
            });
        }

        if (text === 'Сбербанк' || text === 'Тинькофф' || text === 'Альфа-банк' ) {
            storage.setLastBotMessage('Отправь мне свой номер телефона к которому привязан банк 💵');
            storage.setBank(text)
            bot.sendMessage(msg.chat.id, storage.lastBotMessage);
        } else {
            if (storage.lastBotMessage === 'Отправь мне свой номер телефона к которому привязан банк 💵') {
                if (validatePhoneNumber(text)) {
                    storage.setPhonePayment(text)

                    // делаем запись в БД о заказе //
                    const order = await addOrder(user.id, new Date(), 'Оформлен', storage.productOrder.delivery, storage.bank, storage.phonePayment)

                    // добавляем продукты заказа в БД //
                    for (const item of storage.productOrder.products) {
                        await addProductToOrder(order.id, item.id, item.price)
                    }

                    // удаляем из корзины пользователя оформленные продукты //  
                    for (const item of storage.productOrder.products) {
                        await removeFromBasket(user.id, item.id)
                    }

                    // благодарим за покупку //
                    bot.sendMessage(msg.chat.id, 'Спасибо за оформление заказа ☕️😊\nПосмотреть статус заказа Вы можете в меню "Мои заказы"', {
                        reply_markup: {
                            keyboard: menuKeyboard,
                            resize_keyboard: true,
                            one_time_keyboard: true
                        }
                    });
                    storage.setLastBotMessage('')
                } else {
                    // просим повторить //
                    bot.sendMessage(msg.chat.id, `Вы указали неверный номер телефона:(\n${storage.lastBotMessage}`);
                }
            }
        }

        if (text === 'Информация об организации 🏢') {
            bot.sendMessage(msg.chat.id, infoOrganization(), {
                reply_markup: {
                    keyboard: menuKeyboard,
                    resize_keyboard: true,
                    one_time_keyboard: true
                }
            });
        }

        if (text === 'Информация о боте 🤖') {
            bot.sendMessage(msg.chat.id, infoBot(), {
                reply_markup: {
                    keyboard: menuKeyboard,
                    resize_keyboard: true,
                    one_time_keyboard: true
                }
            });
        }

    } catch (error) {
        console.error(`Ошибка при выборе пункта меню ${text}`, error);
        bot.sendMessage(chatId, 'Произошла ошибка при обработке вашего запроса. Попробуйте позже.');
    }
}

module.exports = {
    startCommand,
    choiceMenu,
};
