const { Basket, BasketProduct, Product, Rating } = require('../models/models');

class basketController {
    // получить корзину пользователя //
    async getBasket(req, res) {
        try {
            const {id} = req.params;
            const basket = await Basket.findOne({where: {userId: id}, include: [BasketProduct]});
            return res.json(basket);
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    // добавить продукт в корзину //
    async addToBasket(req, res) {
        try {
            const {userId, productId} = req.body;
            const basket = await Basket.findOne({where: {userId: userId}});
            if (!basket) {
                return res.status(404).json({ message: `Корзина пользователя не найдена` });
            }

            await BasketProduct.create({basketId: basket.id, productId: productId});
            return res.json({message: 'Продукт добавлен в корзину'});
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    // удалить продукт из корзины //
    async removeFromBasket(req, res) {
        try {
            const { userId } = req.body;
            const { id } = req.params;
    
            const basket = await Basket.findOne({ where: { userId: userId } });
            if (!basket) {
                return res.status(404).json({ message: `Корзина пользователя не найдена` });
            }
    
            const basketProduct = await BasketProduct.findOne({ where: { productId: id, basketId: basket.id } });
            if (!basketProduct) {
                return res.status(404).json({ message: `Продукт в корзине не найден` });
            }
    
            await basketProduct.destroy();
            return res.json({ message: 'Продукт удален из корзины' });
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    // получение всех продуктов корзины //
    async getAllProductsInBasket(req, res) {
        try {
            const { id } = req.params;
    
            const basket = await Basket.findOne({ where: { userId: id } });
            if (!basket) {
                return res.status(404).json({ message: `Корзина пользователя не найдена` });
            }
    
            const basketProducts = await BasketProduct.findAll({ where: { basketId: basket.id }, include: [Product] });
    
            // Создаем массив для хранения всех продуктов в корзине
            const allProductsInBasket = [];
    
            // Проходим по каждому продукту в корзине
            for (let basketProduct of basketProducts) {
                // Получаем средний рейтинг продукта
                const ratings = await Rating.findAll({ where: { productId: basketProduct.product.id } });
                let averageRating = 0;
                if (ratings && ratings.length > 0) {
                    const totalRating = ratings.reduce((acc, rating) => acc + rating.rate, 0);
                    averageRating = totalRating / ratings.length;
                }
    
                // Добавляем средний рейтинг к продукту
                const productWithRating = { ...basketProduct.product.dataValues, averageRating };
                allProductsInBasket.push(productWithRating);
            }
    
            return res.json(allProductsInBasket);
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }
}

module.exports = new basketController();
