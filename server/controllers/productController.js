const { Product, ProductInfo, Rating, BasketProduct, OrderProduct, PromoCodeProduct } = require('../models/models');
const uuid = require('uuid')
const path = require('path')

class productController {

    // создание нового продукта //
    async addProduct(req, res) {
        try {
            let {name, price, productViewId, productTypeId, block} = req.body
            const {img} = req.files
            let fileName = uuid.v4() + ".jpg" 
            img.mv(path.resolve(__dirname, '..', 'static', fileName))
            const product = await Product.create({name, price, productViewId, productTypeId, block, img: fileName})
  
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

        const ratings = await Rating.findAll({ where: { productId: product.id } });
        if (!ratings || ratings.length === 0) {
            product.dataValues.averageRating = 0;
        } else {
            const totalRating = ratings.reduce((acc, rating) => acc + rating.rate, 0);
            product.dataValues.averageRating = totalRating / ratings.length;
        }

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
    async editProduct(req, res) {
        try {
            const { id } = req.params;
            const { name, price, productViewId, productTypeId, block } = req.body;
            const { img } = req.files;
     
            // Проверяем, существует ли продукт с указанным ID //
            let product = await Product.findOne({ where: { id } });
            if (!product) {
                return res.status(404).json({ message: `Продукт не найден` });
            }

            if (img) {
                let fileName = uuid.v4() + ".jpg";
                product.img = fileName;

                // Перемещаем изображение на сервер //
                img.mv(path.resolve(__dirname, '..', 'static', fileName));
            }
            
            // Обновляем данные продукта //
            product.name = name;
            product.price = price;
            product.productViewId = productViewId;
            product.productTypeId = productTypeId;
            product.block = block;
            
            // Сохраняем изменения //
            await product.save();
            
            return res.json(product);
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    // удаление продукта //
    async deleteProduct(req, res) {
        try {
            const { id } = req.params;
    
            // Проверяем, существует ли продукт
            const product = await Product.findOne({ where: { id } });
            if (!product) {
                return res.status(404).json({ message: `Продукт не найден` });
            }
    
            await ProductInfo.destroy({ where: { productId: id } });
            await BasketProduct.destroy({ where: { productId: id } });
            await OrderProduct.destroy({ where: { productId: id } });
            await PromoCodeProduct.destroy({ where: { productId: id } });
    
            await Product.destroy({ where: { id } });
    
            return res.json({ message: 'Продукт успешно удален' });
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    // Создать новое описание для выбранного продукта //
    async createDescription(req, res) {
        try {
            const { productId, title, description } = req.body;

            // Создаем новую запись с описанием для указанного продукта
            const newDescription = await ProductInfo.create({ productId, title, description });

            return res.status(201).json(newDescription);
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    // получить все описание выбранного продукта //
    async getDescriptionById(req, res) {
        try {
            const { productId } = req.params;
            const productInfo = await ProductInfo.findAll({ where: { productId } }); // Находим информацию о продукте по его ID
            if (!productInfo) {
                return res.status(404).json({ message: "Информация о продукте не найдена" });
            }
            return res.status(200).json(productInfo);

        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    // Отредактировать описание выбранного продукта //
    async editDescriptionById(req, res) {
        try {
            const { productId, descriptionId } = req.params;
            const { title, description } = req.body;
    
            // Проверяем, существует ли такая запись описания для данного продукта
            const existingDescription = await ProductInfo.findOne({ where: { id: descriptionId, productId: productId } });
            if (!existingDescription) {
                return res.status(404).json({ message: "Запись описания не найдена для указанного продукта" });
            }
    
            // Обновляем информацию описания
            await ProductInfo.update({ title, description }, { where: { id: descriptionId } });
    
            return res.status(200).json({ message: "Информация описания успешно отредактирована" });
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    // удалить описание выбранного продукта //
    async deleteDescriptionById(req, res) {
        try {
            const { id } = req.params;
    
            // Проверяем, существует ли продукт
            const desc = await ProductInfo.findOne({ where: { id } });
            if (!desc) {
                return res.status(404).json({ message: `Описание не найдено` });
            }
    
            await ProductInfo.destroy({ where: { id } });
    
            return res.json({ message: 'Описание успешно удалено' });
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }
}

module.exports = new productController()
