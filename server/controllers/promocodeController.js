const {Product, PromoCode, PromoCodeProduct} = require('../models/models')
const { Op } = require('sequelize');

class promocodeController {

    // добавить промокод //
    async addPromoCode(req, res) {
        try {
            const { code, discount, status, validUntilDate } = req.body

            const promoCode = await PromoCode.create({ code, discount, status, validUntilDate })

            return res.json(promoCode);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    // изменить промокод по его id //
    async editPromoCode(req, res) {
        try {
            const { id } = req.params;
            const { code, discount, status, validUntilDate } = req.body;

            // Проверяем, существует ли продукт с указанным ID //
            let promoCode = await PromoCode.findOne({ where: { id } });
            if (!promoCode) {
                return res.status(404).json({ message: `Промокод не найден` });
            }

            promoCode.code = code
            promoCode.discount = discount
            promoCode.status = status
            promoCode.validUntilDate = validUntilDate
            
            // Сохраняем изменения //
            await promoCode.save();
            
            return res.json(promoCode);

        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    // получить промокод по его id и список продуктов к которому он применяется //
    async getPromoCodeById(req, res) {
        try {
            const {id} = req.params
            const promoCode = await PromoCode.findOne({ where: { id } });
            if (!promoCode) {
                return res.status(404).json({ message: `Промокод не найден` });
            }
            
            // Находим список продуктов, к которым применяется данный промокод //
            const products = await Product.findAll({
                include: [{
                    model: PromoCodeProduct,
                    where: { promoCodeId: promoCode.id },
                }]
            });

            promoCode.dataValues.products = products;

            return res.json({ promoCode });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    // получить промокод по его коду и список продуктов к которому он применяется //
    async getPromoCodeByCode(req, res) {
        try {
            const {code} = req.params
            const promoCode = await PromoCode.findOne({ where: { code } });
            if (!promoCode) {
                return res.status(404).json({ message: `Промокод не найден` });
            }

            // Находим список продуктов, к которым применяется данный промокод //
            const products = await Product.findAll({
                include: [{
                    model: PromoCodeProduct,
                    where: { promoCodeId: promoCode.id },
                }]
            });

            promoCode.dataValues.products = products;

            return res.json({ promoCode });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    // получить все промокоды принадлежащие определенному продукту //
    async getPromoCodesByProduct(req, res) {
        try {
            const {id} = req.params
            const product = await Product.findOne({ where: { id } });

            // список промокодов принадлежащие этому продукту //
            const promoCodes = await PromoCode.findAll({
                include: [{
                    model: PromoCodeProduct,
                    where: { productId: product.id },
                }]
            });

            product.dataValues.promoCodes = promoCodes;

            return res.json({ product });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    // получить все промокоды (с флагом true - все актуальные, с флагом false - все любые) и списки продуктов к котором они применяются //
    async getAllPromoCodesCurrent(req, res) {
        try {
            const { current } = req.params;
            let promoCodes;
    
            if (current === 'true') {
                promoCodes = await PromoCode.findAll({
                    where: {
                        validUntilDate: {
                            [Op.gt]: new Date()
                        }
                    },
                    include: [{
                        model: PromoCodeProduct,
                        include: [{
                            model: Product,
                        }]
                    }]
                });
            } else {
                promoCodes = await PromoCode.findAll({
                    include: [{
                        model: PromoCodeProduct,
                        include: [{
                            model: Product,
                        }]
                    }]
                });
            }
    
            return res.json({ promoCodes });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    // удалить промокод по его id //
    async deletePromoCode(req, res) {
        try {
            const {id} = req.params;
            const promoCode = await PromoCode.findOne({ where: { id } });
            if (!promoCode) {
                return res.status(404).json({ message: `Промокод не найден` });
            }

            await PromoCodeProduct.destroy({ where: { promoCodeId: id } });
            await PromoCode.destroy({ where: { id: id } });

            return res.json({ message: 'Промокод успешно удален' });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    // добавить к продукту промокод //
    async addPromoCodeToProduct(req, res) {
        try {
            const { promoCodeId, productId } = req.body;
            
            const promoCode = await PromoCode.findOne({ where: { id: promoCodeId } });
            if (!promoCode) {
                return res.status(404).json({ message: `Промокод не найден` });
            }

            const product = await Product.findOne({ where: { id: productId } });
            if (!product) {
                return res.status(404).json({ message: `Продукт не найден` });
            }

            const promoCodeProduct = PromoCodeProduct.create({promoCodeId, productId})

            return res.json({ message: 'Промокод успешно подвязан к продукту', promoCodeProduct, product, promoCode });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new promocodeController()
