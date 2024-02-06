require('dotenv').config();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const API_URL = process.env.REACT_APP_API_URL

module.exports = {
    TELEGRAM_BOT_TOKEN,
    API_URL,
};
