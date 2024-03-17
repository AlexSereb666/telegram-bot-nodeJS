class Storage {
    constructor() {
        this._productOrder = {};
        this._lastBotMessage = '';
        this._bank = '';
        this._phonePayment = '';
        this._listOrdersUser = [];
    }

    setListOrdersUser(listOrdersUser) {
        this._listOrdersUser = listOrdersUser;
    }

    get listOrdersUser() {
        return this._listOrdersUser;
    }

    setPhonePayment(phonePayment) {
        this._phonePayment = phonePayment;
    }

    get phonePayment() {
        return this._phonePayment;
    }

    setBank(bank) {
        this._bank = bank;
    }

    get bank() {
        return this._bank;
    }

    setLastBotMessage(lastBotMessage) {
        this._lastBotMessage = lastBotMessage;
    }

    get lastBotMessage() {
        return this._lastBotMessage;
    }

    setProductOrder(productOrder) {
        this._productOrder = productOrder;
    }

    get productOrder() {
        return this._productOrder;
    }
}

module.exports = new Storage();
