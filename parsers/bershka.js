const { parsePrice, getSpanText, getH1Text } = require('../util');

// Removes "MXN&nbsp;" from price string and returns it in Number type
function extractPriceNumber(priceStr) {
    return parsePrice(priceStr.replace('MXN&nbsp;', ''));
}

class Bershka {
    constructor(body) {
        this.body = body;
    }

    getCurrentPrice() {
        return extractPriceNumber(getSpanText(this.body, {class: 'current-price-elem'}));
    }

    soldOut() { 
        return false // TODO: Change when finding SOLD OUT product
    }

    getProductName() {
        return getH1Text(this.body, {class: 'name-tag'});
    }

    getBasePrice() {
        let basePriceStr = getSpanText(this.body, {class: 'old-price-elem'});
        return basePriceStr ? extractPriceNumber(basePriceStr) : this.getCurrentPrice();
    }
};

module.exports = Bershka;