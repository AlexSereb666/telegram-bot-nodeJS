const { generateAdminMenu } = require('../keyboard/generateKeyboard');

const adminMenu = async (bot, msg) => {
    const chatId = msg.chat.id;
    const menuKeyboard = await generateAdminMenu();
    
    bot.sendMessage(chatId, `Вы вошли в меню администратора! 👨‍💼`, {
        reply_markup: {
            keyboard: menuKeyboard,
            resize_keyboard: true,
            one_time_keyboard: true
        }
    });
}

module.exports = {
    adminMenu,
};