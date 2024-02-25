const { createFeedback } = require('../http/feedbackAPI')
const { getUserByTelegramId } = require('../http/userAPI');

const feedbackAdd = async (data, bot, msg) => {
    try {
        const { id } = await getUserByTelegramId(msg.from.id);
        await createFeedback(id, data.selectProblem, data.message)
        await bot.sendMessage(msg.chat.id, "Спасибо за обратную связь! Мы ответим Вам в близжайшее время 😊")
    } catch (e) {
        console.log(e)
    } 
}

module.exports = {
    feedbackAdd,
};
