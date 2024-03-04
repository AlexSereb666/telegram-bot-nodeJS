const { getUserByTelegramId, userRegistration } = require('../http/userAPI');
const { generateMenu } = require('../keyboard/generateKeyboard');
const { adminMenu } = require('../action/index')
const { validatePhoneNumber } = require('../validation/index')

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
            bot.sendMessage(msg.chat.id, storage.lastBotMessage);
        } else {
            if (storage.lastBotMessage === 'Отправь мне свой номер телефона к которому привязан банк 💵') {
                if (validatePhoneNumber(text)) {
                    // удаляем из корзины пользователя оформленные продукты //

                    // делаем запись в БД о заказе //

                    // добавляем продукты заказа в БД //

                    // благодарим за покупку //

                    // отправляем в главное меню //
                } else {
                    // просим повторить //





                }
            }
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
