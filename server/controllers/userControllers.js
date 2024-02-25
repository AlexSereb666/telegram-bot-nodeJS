const jwt = require('jsonwebtoken')
const {User, Basket} = require('../models/models')

const generateJwt = (data) => {
    const dataObject = data.toJSON();
    return jwt.sign(dataObject, 
        process.env.SECRET_KEY, 
        { expiresIn: '1h' });
};

class userController {
    // регистрация //
    async registration(req, res, next) {
        const { name, telegramId, role, dateRegistration, chatId, address } = req.body;

        try {
            const user = await User.create({ name, telegramId, role, dateRegistration, chatId, address });
            const basket = await Basket.create({ userId: user.id });

            return res.status(201).json({ message: 'Регистрация прошла успешно', user });
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    // обновление данных //
    async updateUserData(req, res, next) {
        const telegramId = req.params.id;
        const { name, role, chatId, address } = req.body;

        try {
            const updatedUser = await User.update(
                { name, role, chatId, address },
                { where: { telegramId: telegramId }, returning: true }
            );

            if (updatedUser[0] === 0) {
                return res.status(404).json({ message: `Пользователь с id ${telegramId} не найден` });
            }

            const [user] = updatedUser[1];

            return res.json({ message: 'Данные пользователя успешно обновлены', user });
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    // изменение роли пользователя //
    async updateUserRole(req, res, next) {
        const telegramId = req.params.id;
        const { role } = req.body;

        try {
            const updatedUser = await User.update(
                { role },
                { where: { telegramId: telegramId }, returning: true }
            );

            if (updatedUser[0] === 0) {
                return res.status(404).json({ message: `Пользователь с id ${telegramId} не найден` });
            }

            const [user] = updatedUser[1];

            return res.json({ message: 'Роль пользователя успешно обновлена', user });
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    // получение пользователя по id телеграмма //
    async getUserByTelegramId(req, res, next) {
        const telegramId = req.params.id;

        try {
            const user = await User.findOne({ where: { telegramId: telegramId } });

            if (!user) {
                return res.status(404).json({ message: `Пользователь с id ${telegramId} не найден` });
            }

            return res.json({ user });
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    // получение пользователя по id //
    async getUserById(req, res, next) {
        const id = req.params.id;
        try {
            const user = await User.findOne({ where: { id: id } });

            if (!user) {
                return res.status(404).json({ message: `Пользователь с id ${id} не найден` });
            }

            return res.json({ user });
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    // получение всех пользователей //
    async getAllUsers(req, res, next) {
        try {
            const users = await User.findAll();
            return res.json({ users });
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    // получение всех пользователей по ролям //
    async getUsersByRole(req, res, next) {
        const { role } = req.body;

        try {
            const users = await User.findAll({ where: { role: role } });

            if (!users) {
                return res.status(404).json({ message: `Пользователи с ролью ${role} не найдены` });
            }

            return res.json({ users });
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    // удаление пользователя //
    async deleteUserByTelegramId(req, res, next) {
        const telegramId = req.params.id;
    
        try {
            const deletedUserCount = await User.destroy({ where: { telegramId: telegramId } });
    
            if (deletedUserCount === 0) {
                return res.status(404).json({ message: `Пользователь с id ${telegramId} не найден` });
            }
    
            return res.json({ message: `Пользователь с id ${telegramId} успешно удален` });
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }
}

module.exports = new userController()
