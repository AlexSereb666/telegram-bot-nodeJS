const jwt = require('jsonwebtoken')
const {User, Basket, Product, Rating, Feedback, Order} = require('../models/models')

const generateJwt = (data) => {
    const dataObject = data.toJSON();
    return jwt.sign(dataObject, 
        process.env.SECRET_KEY, 
        { expiresIn: '1h' });
};

class userController {
    // регистрация //
    async registration(req, res) {
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
    async updateUserData(req, res) {
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

    // Удаление пользователя по id
    async deleteUserById(req, res) {
        const id = req.params.id;
        try {
            // Находим пользователя
            const user = await User.findOne({ where: { id: id } });
    
            if (!user) {
                return res.status(404).json({ message: `Пользователь с id ${id} не найден` });
            }
    
            // Удаляем все связанные записи
            await Feedback.destroy({ where: { userId: id } });
            await Rating.destroy({ where: { userId: id } });
            await Order.destroy({ where: { userId: id } });
    
            // Удаляем пользователя
            await User.destroy({ where: { id: id } });
    
            return res.json({ message: `Пользователь с id ${id} успешно удален, а также все связанные записи` });
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    // обновление адреса пользователя по id //
    async updateUserAddress(req, res) {
        const id = req.params.id;
        const { address } = req.body;

        try {
            const updatedUser = await User.update(
                { address },
                { where: { id: id }, returning: true }
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
    async updateUserRole(req, res) {
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
    async getUserByTelegramId(req, res) {
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
    async getUserById(req, res) {
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
    async getAllUsers(req, res) {
        try {
            const users = await User.findAll();
            return res.json({ users });
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    // получение всех пользователей по ролям //
    async getUsersByRole(req, res) {
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
    async deleteUserByTelegramId(req, res) {
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

    // оценка пользователя о продукте //
    async getUserProductRating(req, res) {
        const { userId, productId } = req.params;

        try {
            // Найти пользователя по id
            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({ message: `Пользователь с id ${userId} не найден` });
            }

            // Найти продукт по id
            const product = await Product.findByPk(productId);
            if (!product) {
                return res.status(404).json({ message: `Продукт с id ${productId} не найден` });
            }

            // Найти оценку пользователя для продукта
            const rating = await Rating.findOne({ where: { userId: userId, productId: productId } });

            if (!rating) {
                return res.json({ rating: 0 });
                //return res.status(404).json({ message: `Оценка пользователя для продукта не найдена` });
            }

            return res.json({ rating });
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    // Добавление оценки пользователя к продукту
    async addRating(req, res) {
        const { userId, productId, rate } = req.body;

        try {
            // Проверить, существует ли пользователь с указанным id
            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({ message: `Пользователь с id ${userId} не найден` });
            }

            // Проверить, существует ли продукт с указанным id
            const product = await Product.findByPk(productId);
            if (!product) {
                return res.status(404).json({ message: `Продукт с id ${productId} не найден` });
            }

            // Проверить, существует ли оценка пользователя для продукта
            let rating = await Rating.findOne({ where: { userId: userId, productId: productId } });

            if (rating) {
                // Если оценка существует, обновить её
                rating.rate = rate;
                await rating.save();
            } else {
                // Если оценка не существует, создать новую оценку
                rating = await Rating.create({ userId, productId, rate });
            }

            return res.status(201).json({ message: 'Оценка пользователя для продукта успешно добавлена', rating });
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }
}

module.exports = new userController()
