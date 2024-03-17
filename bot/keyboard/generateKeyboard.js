const config = require('../config');

const generateMenu = async (userRole, userId) => {
    let menu = [
        [{text: 'Меню 😋☕️', web_app: {url: config.WEB_URL + 'menu/' + userId}}],
        [{text: 'Корзина 🛒', web_app: {url: config.WEB_URL + 'basket/' + userId}}],
        [{text: 'Мои данные 👤', web_app: {url: config.WEB_URL + 'personalData/' + userId}}, 
        {text: 'Мои заказы 📦', web_app: {url: config.WEB_URL + 'personalOrders/' + userId}}],
        [{text: 'Информация об организации 🏢'}, {text: 'Информация о боте 🤖'}],
        [{text: 'Тех. поддержка 🛠️', web_app: {url: config.WEB_URL + 'feedback'}}]
    ];

    if (userRole === 'ADMIN') {
        menu.push([{text: 'Для администратора 👨‍💼'}])
    } else if (userRole === 'BARISTA') {
        menu.push([{text: 'Для бариста ☕'}])
    } else if (userRole === 'COURIER') {
        menu.push([{text: 'Для курьера 🛵'}])
    }

    return menu;
}

const generateAdminMenu = async () => {
    return [
        [{ text: 'Меню управления базой данных 🛢️' }],
        [{ text: 'Управление заказами 📋' }, {text: 'Управление ботом 👾'}],
        [{ text: 'Управление сотрудниками 👷‍♂️' }, {text: 'Управление клиентами 😄'}],
    ];
};

const generateBaristaMenu = async (userId) => {
    return [
        [{ text: 'Заказы 🛒', web_app: {url: config.WEB_URL + 'ordersBarista/' + userId}}, {text: 'Связь с курьерами 📞'}],
        [{ text: 'Вернуться в главное меню' }],
    ];
};

const generateChoicePayment = async () => {
    return [
        [{ text: 'Сбербанк' }, { text: 'Тинькофф' }, { text: 'Альфа-банк' }],
        [{ text: 'Отменить оформление заказа' }],
    ];
};

module.exports = {
    generateMenu,
    generateAdminMenu,
    generateChoicePayment,
    generateBaristaMenu,
};
