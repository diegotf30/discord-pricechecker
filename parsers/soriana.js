 const { parsePrice, getDivText, getSpanText } = require('../util');

class Soriana {
    constructor(body) {
        this.body = body;
    }

    onSale() {
        return getDivText(this.body, {'class': ['sales', 'text--red']}) !== '';
    }

    getCurrentPrice() {
        let salePriceStr = getDivText(this.body, {'class': ['sales', 'text--red']});
        return salePriceStr ? parsePrice(salePriceStr) : this.getBasePrice();
    }

    soldOut() {
        return false // TODO: Change when finding SOLD OUT product
    }

    getProductName() {
        return getDivText(this.body, {class: 'product-name'});
    }

    getBasePrice() {
        return parsePrice(getSpanText(this.body, {'class': 'product-price'}));
    }
};

module.exports = Soriana;