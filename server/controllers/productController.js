const { Product, ProductInfo, Rating } = require('../models/models');
const uuid = require('uuid')
const path = require('path')

class productController {

    // создание нового продукта //
    async addProduct(req, res, next) {
        try {
            let {name, price, productViewId, productTypeId, block, info} = req.body
            const {img} = req.files
            let fileName = uuid.v4() + ".jpg" 
            img.mv(path.resolve(__dirname, '..', 'static', fileName))
            const product = await Product.create({name, price, productViewId, productTypeId, block, img: fileName})

            if (info) {
                info = JSON.parse(info)
                info.forEach(i => {
                    Product_info.create({
                        title: i.title,
                        description: i.description,
                        productId: product.id
                    })
                });
            }
  
            return res.json(product)
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    // получение одного продукта по id //
    async getOne(req, res) {
        const {id} = req.params
        const product = await Product.findOne({
            where: {id},
            include: [{model: ProductInfo, as: 'product_info'}]
        })
        return res.json(product)
    }

    // получение всех продуктов с плагинацией //
    async getAllPage(req, res) {
        let {ProductViewId, ProductTypeId, limit, page} = req.query
        page = page || 1 // количество страниц
        limit = limit || 8 // количество продуктов на 1 странице
        let offset = page * limit - limit
        let products;
        if (!ProductViewId && !ProductTypeId) {
            products = await Product.findAndCountAll({limit, offset})
        } 
        else if (ProductViewId && !ProductTypeId) {
            products = await Product.findAndCountAll({where: {ProductViewId}, limit, offset})
        } 
        else if (!ProductViewId && ProductTypeId) {
            products = await Product.findAndCountAll({where: {ProductTypeId}, limit, offset})
        } 
        else if (ProductViewId && ProductTypeId) {
            products = await Product.findAndCountAll({where: {ProductTypeId, ProductViewId}, limit, offset})
        }
        return res.json(products)
    }

    // получение всех продуктов без плагинации //
    async getAll(req, res) {
        try {
            const products = await Product.findAll();
            
            // Для каждого продукта получаем средний рейтинг и добавляем его в объект продукта
            for (let product of products) {
                const ratings = await Rating.findAll({ where: { productId: product.id } });
                if (!ratings || ratings.length === 0) {
                    product.dataValues.averageRating = 0;
                } else {
                    const totalRating = ratings.reduce((acc, rating) => acc + rating.rate, 0);
                    product.dataValues.averageRating = totalRating / ratings.length;
                }
            }

            return res.json(products);
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    // редактирование продукта //
    async editProduct(req, res, next) {
        try {
            const { id } = req.params;
            const { name, price, productViewId, productTypeId, block } = req.body;
            const { img } = req.files;
            let fileName = uuid.v4() + ".jpg";
            
            // Проверяем, существует ли продукт с указанным ID //
            let product = await Product.findOne({ where: { id } });
            if (!product) {
                return res.status(404).json({ message: `Продукт не найден` });
            }
            
            // Обновляем данные продукта //
            product.name = name;
            product.price = price;
            product.productViewId = productViewId;
            product.productTypeId = productTypeId;
            product.block = block;
            product.img = fileName;
            
            // Перемещаем изображение на сервер //
            img.mv(path.resolve(__dirname, '..', 'static', fileName));
            
            // Сохраняем изменения //
            await product.save();
            
            return res.json(product);
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    // удаление продукта //
    async deleteProduct(req, res, next) {
        try {
            const {id} = req.params;
    
            // Проверяем, существует ли продукт с указанным ID //
            const product = await Product.findOne({ where: { id } });
            if (!product) {
                return res.status(404).json({ message: `Продукт не найден` });
            }
    
            // Удаляем информацию о продукте //
            await ProductInfo.destroy({ where: { productId: id } });
    
            // Удаляем сам продукт //
            await Product.destroy({ where: { id } });
    
            return res.json({ message: 'Продукт успешно удален' });
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }
}

module.exports = new productController()
