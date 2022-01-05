const { parsePrice, getH1Text, getSpanText } = require('../util');

class LaCastellana {
    constructor(body) {
        this.body = body;
    }

    getCurrentPrice() {
        return parsePrice(getSpanText(this.body, {'class': 'price-item--sale'}));
    }

    soldOut() {
        return false; // TODO: Change when finding SOLD OUT product
    }

    getProductName() {
        return getH1Text(this.body, {class: 'Product-title'});
    }

    getBasePrice() {
        return parsePrice(getSpanText(this.body, {'class': 'price-item--regular'}));
    }
};

module.exports = LaCastellana;