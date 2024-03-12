const { $host } = require("./index");

const userRegistration = async (name, telegramId, role, dateRegistration, chatId, address) => {
    try {
        const { data } = await $host.post('api/user/registration', { name, telegramId, role, dateRegistration, chatId, address });
        return data;
    } catch (error) {
        if (error.response) {
            return error.response.status
        } else {
            return 500;
        }
    }
}

const getUserByTelegramId = async (telegramId) => {
    try {
        const { data } = await $host.get(`api/user/getOneUser/${telegramId}`);
        return data.user;
    } catch (error) {
        if (error.response) {
            return error.response.status;
        } else {
            return 500;
        }
    }
}

const updateNameUser = async (msg, user) => {
    try {
        const name = `${msg.from.first_name} ${msg.from.last_name}`;
        const { data } = await $host.put(`api/user/updateData/${user.id}`, {name, role: user.role, chatId: user.chatId, address: user.address });
        return data;
    } catch (error) {
        if (error.response) {
            return error.response.status
        } else {
            return 500;
        }
    }
}

module.exports = {
    userRegistration,
    getUserByTelegramId,
    updateNameUser,
};
