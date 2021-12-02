const { parsePrice, getSpanText, getFirstChildText, findTextInSpan } = require('../util');

class BestBuyCanada {
    constructor(body) {
        this.body = body;
    }

    getCurrentPrice() {
        return parsePrice(getSpanText(this.body, {'data-automation': 'product-price'}));
    }

    soldOut() {
        return findTextInSpan(this.body, 'Sold out online');
    }

    getProductName() {
        return getFirstChildText(this.body, 'div', {class: 'x-product-detail-page'});
    }

    getBasePrice() {
        let savingsStr = getSpanText(this.body, {'data-automation': 'product-saving'});
        if (savingsStr !== '') {
            // No base price in HTML, need to add savings + current price
            return this.getCurrentPrice() + parsePrice(savingsStr.split(/\s+/)[1]);
        }
        else { // No discount
            return this.getCurrentPrice();
        }
    }
};

module.exports = BestBuyCanada;