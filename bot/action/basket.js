const { addToBasket } = require('../http/basketAPI');

const productBasketAdd = async (userId, data) => {
    try {
        for (const item of data) {
            for (let i = 0; i < item.count; i++) {
                await addToBasket(userId, item.id)
            }
        }
    } catch (e) {
        console.log(e);
    }
};

module.exports = {
    productBasketAdd,
};
