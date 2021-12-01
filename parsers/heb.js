const { parsePrice, getH1Text, getH2Text } = require('../util');

class Heb {
    constructor(body) {
        this.body = body;
    }

    getCurrentPrice() {
        return parsePrice(getH2Text(this.body, {'data-price-type': 'finalPrice'}));
    }

    soldOut() {
        return false // TODO: Change when finding SOLD OUT product
    }

    getProductName() {
        return getH1Text(this.body, {class: 'page-title'});
    }

    getBasePrice() {
        let basePriceStr = getH2Text(this.body, {'data-price-type': 'oldPrice'});
        return basePriceStr ? parsePrice(basePriceStr) : this.getCurrentPrice();
    }
};

module.exports = Heb;