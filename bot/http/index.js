const axios = require('axios');
const config = require('../config');

const $host = axios.create({
    baseURL: config.API_URL
})

module.exports = { 
    $host 
};
