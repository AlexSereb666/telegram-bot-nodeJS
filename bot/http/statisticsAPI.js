const { $host } = require("./index");

const getProductStatistics = async (startDate, endDate) => {
    const { data } = await $host.post('api/statistics/productStatistics', { startDate, endDate });
    return data;
}

const getSalesStatistics = async (startDate, endDate) => {
    const { data } = await $host.post('api/statistics/salesStatistics', { startDate, endDate });
    return data;
}

const getEmployeeStatistics = async (startDate, endDate) => {
    const { data } = await $host.post('api/statistics/employeeStatistics', { startDate, endDate });
    return data;
}

const getClientStatistics = async (startDate, endDate) => {
    const { data } = await $host.post('api/statistics/clientStatistics', { startDate, endDate });
    return data;
}

module.exports = {
    getProductStatistics,
    getSalesStatistics,
    getEmployeeStatistics,
    getClientStatistics,
};