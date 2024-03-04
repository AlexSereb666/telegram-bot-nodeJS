class Storage {
    constructor() {
        this._productOrder = {};
        this._lastBotMessage = '';
    }

    setLastBotMessage(value) {
        this._lastBotMessage = value;
    }

    get lastBotMessage() {
        return this._lastBotMessage;
    }

    setProductOrder(value) {
        this._productOrder = value;
    }

    get productOrder() {
        return this._productOrder;
    }
}

module.exports = new Storage();
