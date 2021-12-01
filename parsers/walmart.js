const { parsePrice, getSpanText, getH1Text, findTextInSpan } = require('../util');

class Walmart {
    constructor(body) {
        this.body = body;
    }

    getCurrentPrice() {
        return parsePrice(getSpanText(this.body, {itemprop: 'price'}));
    }

    soldOut() {
        return findTextInSpan(this.body, 'Out of stock')
    }

    getProductName() {
        return getH1Text(this.body, {itemprop: 'name'});
    }

    getBasePrice() {
        let basePriceStr = getSpanText(this.body, {class: ['strike', 'mr2', 'f6', 'gray']});
        return basePriceStr ? parsePrice(basePriceStr) : this.getCurrentPrice();
    }
};

module.exports = Walmart;