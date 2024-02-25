const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
    id: {type:DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING},
    telegramId: {type: DataTypes.BIGINT},
    role: {type: DataTypes.STRING, defaultValue: 'USER'},
    dateRegistration: {type: DataTypes.DATE, defaultValue: new Date()},
    chatId: {type: DataTypes.BIGINT},
    address: {type: DataTypes.STRING, defaultValue: 'Не указан'},
})

const Basket = sequelize.define('basket', {
    id: {type:DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const BasketProductr = sequelize.define('basket_product', {
    id: {type:DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const Product = sequelize.define('product', {
    id: {type:DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type:DataTypes.STRING},
    price: {type:DataTypes.INTEGER},
    img: {type:DataTypes.STRING},
    block: {type:DataTypes.BOOLEAN},
})

const ProductInfo = sequelize.define('product_info', {
    id: {type:DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type:DataTypes.STRING},
    description: {type:DataTypes.STRING},
})

const ProductType = sequelize.define('product_type', {
    id: {type:DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type:DataTypes.STRING},
})

const ProductView = sequelize.define('product_view', {
    id: {type:DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type:DataTypes.STRING},
})

const PromoCodeInfo = sequelize.define('promo_code_info', {
    id: {type:DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    discount: {type: DataTypes.INTEGER},
    status: {type: DataTypes.STRING},
    validUntilDate: {type: DataTypes.DATE}
})

const PromoCode = sequelize.define('promo_code', {
    id: {type:DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    code: {type: DataTypes.STRING}
})

const Rating = sequelize.define('rating', {
    id: {type:DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    rate: {type:DataTypes.INTEGER},
    date: {type: DataTypes.DATE, defaultValue: new Date()}
})

const Feedback = sequelize.define('feedback', {
    id: {type:DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type:DataTypes.STRING},
    message: {type:DataTypes.STRING},
    date: {type: DataTypes.DATE, defaultValue: new Date()},
    status: {type:DataTypes.STRING, defaultValue: 'Открыта'},
})

const Order = sequelize.define('order', {
    id: {type:DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    date: {type:DataTypes.DATE},
    status: {type:DataTypes.STRING}
})

const OrderProduct = sequelize.define('order_product', {
    id: {type:DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const HistoryMaintenance = sequelize.define('history_maintenance', {
    id: {type:DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type:DataTypes.STRING},
    description: {type:DataTypes.STRING},
    notes: {type:DataTypes.STRING},
    status: {type:DataTypes.STRING},
    dateBegin: {type: DataTypes.DATE},
    dateEnd: {type: DataTypes.DATE},
})

User.hasMany(Feedback)
Feedback.belongsTo(User)

User.hasOne(Basket)
Basket.belongsTo(User)

User.hasMany(Rating)
Rating.belongsTo(User)

User.hasMany(Order)
Order.belongsTo(User)

Basket.hasMany(BasketProductr)
BasketProductr.belongsTo(Basket)

Product.hasMany(PromoCodeInfo)
PromoCodeInfo.belongsTo(Product)

PromoCode.hasMany(PromoCodeInfo)
PromoCodeInfo.belongsTo(PromoCode)

Product.hasMany(BasketProductr)
BasketProductr.belongsTo(Product)

Product.hasMany(Rating)
Rating.belongsTo(Product)

Product.hasMany(ProductInfo, {as: 'product_info'})
ProductInfo.belongsTo(Product)

ProductType.hasMany(Product)
Product.belongsTo(ProductType)

ProductView.hasMany(Product)
Product.belongsTo(ProductView)

Order.hasMany(OrderProduct)
OrderProduct.belongsTo(Order)

Product.hasMany(OrderProduct)
OrderProduct.belongsTo(Product)

module.exports = {
    User,
    Basket,
    BasketProductr,
    Product,
    ProductInfo,
    ProductType,
    ProductView,
    PromoCode,
    PromoCodeInfo,
    Rating,
    Feedback,
    Order,
    OrderProduct,
    HistoryMaintenance
}
