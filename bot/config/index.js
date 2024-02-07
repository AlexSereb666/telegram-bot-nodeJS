require('dotenv').config();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const API_URL = process.env.REACT_APP_API_URL_BACKEND;
const WEB_URL = process.env.REACT_APP_API_URL_CLIENT;

module.exports = {
    TELEGRAM_BOT_TOKEN,
    API_URL,
    WEB_URL,
};
