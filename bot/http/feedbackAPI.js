const { $host } = require("./index");

const createFeedback = async (userId, title, message) => {
    try {
        const { data } = await $host.post('api/feedback/create', { userId, title, message });
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
    createFeedback,
};
