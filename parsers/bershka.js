const { parsePrice, getSpanText, getH1Text, findTextInSpan } = require('../util');

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
        return false; // Unable to extract with current implementation (updated with js on client-side).
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