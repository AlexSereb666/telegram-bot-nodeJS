const { Order, OrderProduct, Product, User } = require('../models/models');

class orderProduct {
    // создать заказ //
    async addOrder(req, res) {
        try {
            const {userId, date, status, delivery, bank, phonePayment} = req.body
            const order = await Order.create({userId, date, status, delivery, bank, phonePayment})

            return res.json(order)
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    // изменить статус заказа //
    async updateStatusOrder(req, res) {
        try {
            const { id } = req.params;
            const { idUser, status } = req.body;

            let order = await Order.findOne({ where: { id } });
            if (!order) {
                return res.status(404).json({ message: `Заказ не найден` });
            }

            order.status = status;
            order.baristaId = idUser;
            await order.save();
            
            return res.json(order);
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    async updateStatusOrderCourier(req, res) {
        try {
            const { id } = req.params;
            const { idUser, status } = req.body;

            let order = await Order.findOne({ where: { id } });
            if (!order) {
                return res.status(404).json({ message: `Заказ не найден` });
            }

            order.status = status;
            order.courierId = idUser;
            await order.save();
            
            return res.json(order);
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    // удалить заказа //
    async deleteOrder(req, res) {
        try {
            const { id } = req.params;

            // Найти заказ по id
            const order = await Order.findOne({ where: { id } });
            if (!order) {
                return res.status(404).json({ message: `Заказ не найден` });
            }

            // Удалить все продукты из таблицы OrderProduct, которые принадлежат этому заказу
            await OrderProduct.destroy({ where: { orderId: id } });

            // Удалить сам заказ
            await Order.destroy({ where: { id } });

            return res.json({ message: 'Заказ успешно удален' });
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    // добавить продукт в заказ //
    async addProductToOrder(req, res) {
        try {
            const {orderId, productId, currentPrice} = req.body
            const orderProduct = await OrderProduct.create({orderId, productId, currentPrice})

            return res.json(orderProduct)
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    // удалить продукт из заказа //
    async deleteProductToOrder(req, res) {
        try {
            const {id} = req.params;

            const orderProduct = await OrderProduct.findOne({ where: { id } });
            if (!orderProduct) {
                return res.status(404).json({ message: `Продукт в заказе не найден` });
            }
    
            await OrderProduct.destroy({ where: { id } });
    
            return res.json({ message: 'Продукт из заказа успешно удален' });
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    // получить все заказы и продукты в них //
    async getOrdersAll(req, res) {
        try {
            const orders = await Order.findAll({
                include: {
                    model: OrderProduct,
                    include: Product
                }
            });
            return res.json(orders);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    // получить заказы одного конкретного пользователя по его id //
    async getOrderOne(req, res) {
        try {
            const { userId } = req.params;
            const orders = await Order.findAll({
                where: { userId },
                include: {
                    model: OrderProduct,
                    include: Product
                }
            });

            return res.json(orders);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    // получить заказ по его id и спиок продуктов //
    async getOrderById(req, res) {
        try {
            const { id } = req.params;
            const order = await Order.findOne({
                where: { id },
                include: {
                    model: OrderProduct,
                    include: Product
                }
            });
            if (!order) {
                return res.status(404).json({ message: `Заказ не найден` });
            }
            return res.json(order);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    // получить все незанятые заказы и заказы конкретного бариста //
    async getUnassignedAndBaristaOrders(req, res) {
        try {
            const { id } = req.params;

            // Найти все заказы, у которых поле baristaId пустое (null)
            const unassignedOrders = await Order.findAll({ 
                where: { baristaId: null }, 
                include: { model: OrderProduct, include: Product } 
            });
    
            // Найти все заказы, у которых id равен baristaId
            const baristaOrders = await Order.findAll({ 
                where: { baristaId: id }, 
                include: { model: OrderProduct, include: Product } 
            });
            
            // Объединить оба списка заказов
            const allOrders = unassignedOrders.concat(baristaOrders);

            if (allOrders.length === 0) {
                return [];
            }
    
            return res.json(allOrders);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    // получить заказы конкретного бариста с определенным статусом //
    async getBaristaOrdersWithStatus(req, res) {
        try {
            let { baristaId, status } = req.params;

            status = status.replace(/_/g, ' ');

            const orders = await Order.findAll({
                where: { baristaId, status },
                include: {
                    model: OrderProduct,
                    include: Product
                }
            });

            return res.json(orders);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    // получить заказы конкретного курьера с определенным статусом //
    async getCourierOrdersWithStatus(req, res) {
        try {
            let { courierId, status } = req.params;

            status = status.replace(/_/g, ' ');

            const orders = await Order.findAll({
                where: { courierId, status, delivery: true },
                include: {
                    model: OrderProduct,
                    include: Product
                }
            });

            // Добавление адреса к каждому заказу
            for (let i = 0; i < orders.length; i++) {
                const order = orders[i];
                const user = await User.findByPk(order.userId); // Находим пользователя по userId
                if (user) {
                    order.dataValues.address = user.address; // Добавляем адрес пользователя к заказу
                }
            }

            if (orders.length === 0) {
                return [];
            }

            return res.json(orders);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    // получить свободные заказы готовые для доставки //
    async getCourierOrdersWithStatusFree(req, res) {
        try {
            let { status } = req.params;

            status = status.replace(/_/g, ' ');

            const orders = await Order.findAll({ 
                where: { courierId: null, status, delivery: true }, 
                include: {
                    model: OrderProduct,
                    include: Product
                } 
            });

            // Добавление адреса к каждому заказу
            for (let i = 0; i < orders.length; i++) {
                const order = orders[i];
                const user = await User.findByPk(order.userId); // Находим пользователя по userId
                if (user) {
                    order.dataValues.address = user.address; // Добавляем адрес пользователя к заказу
                }
            }

            if (orders.length === 0) {
                return [];
            }

            return res.json(orders);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new orderProduct()
