const { updateNameUser } = require('../http/userAPI');

const checkNameUser = async (msg, user) => {
    if (user.name !== `${msg.from.first_name} ${msg.from.last_name}`) {
        await updateNameUser(msg, user);
    }
}

module.exports = {
    checkNameUser,
};