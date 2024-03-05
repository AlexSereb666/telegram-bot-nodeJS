const { $host } = require("./index");

const addOrder = async (userId, date, status, delivery, bank, phonePayment) => {
    const {data} = await $host.post('api/order/addOrder', {userId, date, status, delivery, bank, phonePayment})
    return data
}

const updateStatusOrder = async (id, status) => {
    const {data} = await $host.put(`api/order/updateStatus/${id}`, {status})
    return data
}

const deleteOrder = async (id) => {
    const {data} = await $host.delete(`api/order/deleteOrder/${id}`)
    return data
}

const addProductToOrder = async (orderId, productId, currentPrice) => {
    const {data} = await $host.post('api/order/addProductToOrder', {orderId, productId, currentPrice})
    return data
}

const deleteProductToOrder = async (id) => {
    const {data} = await $host.delete(`api/order/deleteProduct/${id}`)
    return data
}

const getOrdersAll = async () => {
    const {data} = await $host.get('api/order/getOrdersAll')
    return data
}

const getOrderOne = async (userId) => {
    const {data} = await $host.get(`api/order/getOrderOne/${userId}`)
    return data
}

const getOrderById = async (id) => {
    const {data} = await $host.get(`api/order/getOrderById/${id}`)
    return data
}

module.exports = {
    addOrder,
    updateStatusOrder,
    deleteOrder,
    addProductToOrder,
    deleteProductToOrder,
    getOrdersAll,
    getOrderOne,
    getOrderById
};
