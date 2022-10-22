const { getSpanText, getH1Text, toTitleCase } = require('../util');

function parsePrice(priceStr) {
    return parseFloat(priceStr.replace(/\./g, "").replace(/,/g, ".").replace(/\$MXN/g, ""));
}

class Zara {
    constructor(body) {
        this.body = body;
    }

    getCurrentPrice() {
        return parsePrice(getSpanText(this.body, {class: 'price-current__amount'}));
    }

    soldOut() {
        return false // TODO: Change when finding SOLD OUT product
    }

    getProductName() {
        return toTitleCase(getH1Text(this.body, {class: 'product-detail-card-info__title'}));
    }

    getBasePrice() {
        let basePriceStr = getSpanText(this.body, {class: 'price-old__amount'});
        return basePriceStr ? parsePrice(basePriceStr) : this.getCurrentPrice();
    }
};

module.exports = Zara;