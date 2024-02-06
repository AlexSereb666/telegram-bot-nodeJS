const generateMenu = async (userRole) => {
    let menu = [
        [{text: 'Меню 😋☕️'}],
        [{text: 'Корзина 🛒'}],
        [{text: 'Мои данные 👤'}, {text: 'Мои заказы 📦'}],
        [{text: 'Информация об организации 🏢'}, {text: 'Информация о боте 🤖'}],
        [{text: 'Тех. поддержка 🛠️'}]
    ];

    if (userRole === 'ADMIN') {
        menu.push([{text: 'Для администратора 👨‍💼'}])
    } else if (userRole === 'BARISTA') {
        menu.push([{text: 'Для бариста ☕'}])
    }else if (userRole === 'COURIER') {
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

module.exports = {
    generateMenu,
    generateAdminMenu,
};
