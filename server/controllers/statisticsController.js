const { Order, OrderProduct, Product, User } = require('../models/models');
const { Op } = require('sequelize');

class statisticsController {
    // статистика по продуктам //
    async getProductStatistics(req, res) {
        try {
            const { startDate, endDate } = req.body;

            // Найти все заказы за указанный период времени
            const orders = await Order.findAll({
                where: {
                    date: {
                        [Op.between]: [startDate, endDate]
                    }
                },
                include: {
                    model: OrderProduct,
                    include: Product // Включить связанную модель OrderProduct и продукты
                }
            });

            // Создать объект для хранения статистики продуктов
            const productStatistics = {};

            orders.forEach(order => (
                order.order_products.forEach(orderProduct => {
                    const { product } = orderProduct;
                    if (product) {
                        if (!productStatistics[product.id]) {
                            productStatistics[product.id] = {
                                product: product.name,
                                quantity: 1
                            };
                        } else {
                            productStatistics[product.id].quantity++;
                        }
                    }
                })
            ))

            const productStatisticsArray = Object.values(productStatistics);

            // Отсортировать массив по убыванию количества продуктов
            productStatisticsArray.sort((a, b) => b.quantity - a.quantity);

            return res.json(productStatisticsArray);
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    // статистика продаж //
    async getSalesStatistics(req, res) {
        try {
            const { startDate, endDate } = req.body;

            // Найти все заказы за указанный период времени
            const orders = await Order.findAll({
                where: {
                    date: {
                        [Op.between]: [startDate, endDate]
                    }
                },
                include: OrderProduct
            });

            // Инициализировать статистику
            let totalOrders = 0;
            let totalProductsSold = 0;
            let totalRevenue = 0;
            let completedOrders = 0;
            let cancelledOrders = 0;

            // Подсчитать статистику
            orders.forEach(order => {
                totalOrders++;
                if (order.status === 'Выполнен') {
                    completedOrders++;
                    order.order_products.forEach(orderProduct => {
                        totalProductsSold ++;
                        totalRevenue += orderProduct.currentPrice;
                    });
                } else if (order.status === 'Отменен') {
                    cancelledOrders++;
                }
            });

            // Вернуть результаты статистики
            return res.json({
                totalOrders,
                totalProductsSold,
                totalRevenue,
                completedOrders,
                cancelledOrders
            });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    // статистика сотрудников //
    async getEmployeeStatistics(req, res) {
        try {
            const { startDate, endDate } = req.body;

            // Найти всех пользователей, являющихся баристами или курьерами
            const employees = await User.findAll({
                where: {
                    role: {
                        [Op.or]: ['BARISTA', 'COURIER']
                    }
                }
            });

            // Инициализировать массив для хранения статистики сотрудников
            const employeeStatistics = [];

            // Подсчитать статистику для каждого сотрудника
            for (const employee of employees) {
                const orders = await Order.findAll({
                    where: {
                        [Op.and]: [
                            { [Op.or]: [{ baristaId: employee.id }, { courierId: employee.id }] },
                            { status: 'Выполнен' },
                            { date: { [Op.between]: [startDate, endDate] } }
                        ]
                    }
                });

                employeeStatistics.push({
                    id: employee.id,
                    name: employee.name,
                    role: employee.role,
                    successfulOrders: orders.length
                });
            }

            // Вернуть результаты статистики сотрудников
            return res.json(employeeStatistics);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    // статистика клиентов //
    async getClientStatistics(req, res) {
        try {
            const { startDate, endDate } = req.body;

            // Найти всех пользователей
            const users = await User.findAll();

            // Инициализировать массив для хранения статистики клиентов
            const clientStatistics = [];

            // Подсчитать статистику для каждого клиента
            for (const user of users) {
                const orders = await Order.findAll({
                    where: {
                        userId: user.id,
                        date: { [Op.between]: [startDate, endDate] }
                    },
                    include: OrderProduct
                });

                let successfulOrders = 0;
                let cancelledOrders = 0;
                let totalRevenue = 0;

                orders.forEach(order => {
                    if (order.status === 'Выполнен') {
                        successfulOrders++;
                        order.order_products.forEach(orderProduct => {
                            totalRevenue += orderProduct.currentPrice;
                        });
                    } else if (order.status === 'Отменен') {
                        cancelledOrders++;
                    }
                });

                clientStatistics.push({
                    id: user.id,
                    name: user.name,
                    successfulOrders,
                    cancelledOrders,
                    totalRevenue
                });
            }

            // Вернуть результаты статистики клиентов
            return res.json(clientStatistics);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new statisticsController()