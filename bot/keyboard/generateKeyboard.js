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
        [{ text: 'Управление данными 🛢️' }, { text: 'Мониторинг и учет 📊', web_app: {url: config.WEB_URL + 'statisctic'}}],
        [{ text: 'Управление заказами 📋', web_app: {url: config.WEB_URL + 'adminOrders'} }, {text: 'Обслуживание бота 👾'}],
        [{ text: 'Управление сотрудниками 👷‍♂️' }, {text: 'Взаимодействие с клиентами 😄'}],
        [{ text: 'Вернуться в главное меню'}]
    ];
};

const generateAdminMenuClient = async (userId) => {
    return [
        [{ text: 'Техническая поддержка', web_app: {url: config.WEB_URL + 'adminFeedback/' + userId}}],
        [{ text: 'Массовая рассылка', web_app: {url: config.WEB_URL + 'messageAll'}}],
        [{ text: 'Вернуться в меню администратора' }]
    ];
};

const generateAdminMenuWork = async (userId) => {
    return [
        [{ text: 'Список сотрудников'}],
        [{ text: 'Массовая рассылка', web_app: {url: config.WEB_URL + 'messageWork'}}],
        [{ text: 'Вернуться в меню администратора' }]
    ];
};

const generateBaristaMenu = async (userId) => {
    return [
        [{ text: 'Заказы 🛒', web_app: {url: config.WEB_URL + 'ordersBarista/' + userId}},
        {text: 'Связь с курьерами 📞', web_app: {url: config.WEB_URL + 'listCourier/' + userId}}],
        [{ text: 'Вернуться в главное меню' }],
    ];
};

const generateCourierMenu = async (userId) => {
    return [
        [{ text: 'Меню заказов 🛒', web_app: {url: config.WEB_URL + 'ordersCourier/' + userId}}],
        [{ text: 'Вернуться в главное меню' }],
    ];
};

const generateChoicePayment = async () => {
    return [
        [{ text: 'Сбербанк' }, { text: 'Тинькофф' }, { text: 'Альфа-банк' }],
        [{ text: 'Отменить оформление заказа' }],
    ];
};

const geterateDataManagement = async (userId) => {
    return [
        [{text: 'Пользователи 👶', web_app: {url: config.WEB_URL + 'adminListUser/' + userId}}],
        [{text: 'Продукты 🛍️', web_app: {url: config.WEB_URL + 'adminListProduct/'}}],
        [{text: 'Промокоды 🤑', web_app: {url: config.WEB_URL + 'adminListPromo/'}}],
        [{text: 'Вернуться в меню администратора'}]
    ]
}

const generateMaintenances = async () => {
    return [
        [{text: 'Запланировать обслуживание', web_app: {url: config.WEB_URL + 'scheduleMaintenance'}}],
        [{text: 'Список обслуживаний', web_app: {url: config.WEB_URL + 'listMaintenance'}}],
        [{text: 'Вернуться в меню администратора'}]
    ]
}

module.exports = {
    generateMenu,
    generateAdminMenu,
    generateChoicePayment,
    generateBaristaMenu,
    generateCourierMenu,
    geterateDataManagement,
    generateAdminMenuClient,
    generateAdminMenuWork,
    generateMaintenances,
};
