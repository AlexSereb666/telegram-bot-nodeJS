const { $host } = require("./index");

const addProduct = async (product) => {
    const {data} = await $host.post('api/product/create', product)
    return data
}

const getOne = async (id) => {
    const {data} = await $host.get(`api/product/getOneProduct/${id}`)
    return data
}

const getAllPage = async () => {
    const {data} = await $host.get('api/product/getAllPageProducts')
    return data
}

const getAll = async () => {
    const {data} = await $host.get('api/product/getAllProducts')
    return data
}

const editProduct = async (product, id) => {
    const {data} = await $host.put(`api/product/updateProduct/${id}`, product)
    return data
}

const deleteProduct = async (id) => {
    const {data} = await $host.delete(`api/product/deleteProduct/${id}`)
    return data
}

module.exports = {
    addProduct,
    getOne,
    getAllPage,
    getAll,
    editProduct,
    deleteProduct
};
