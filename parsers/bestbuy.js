const { parsePrice, getDivText, getButtonText } = require('../util');

class BestBuy {
    constructor(body) {
        this.body = body;
    }

    getCurrentPrice() {
        return parsePrice(getDivText(this.body, {class: 'priceView-customer-price'}));;
    }

    soldOut() {
        return getButtonText(this.body, {class: 'add-to-cart-button'}) == 'Sold Out';
    }

    getProductName() {
        return getDivText(this.body, {class: 'sku-title'});
    }

    getBasePrice() {
        let basePriceStr = getDivText(this.body, {class: 'pricing-price__regular-price'});
        if (basePriceStr !== '') {
            return parsePrice(basePriceStr.split(/\s+/)[1]);  // Formatted as "was $price"
        }
        else { // No discount
            return this.getCurrentPrice();
        }
    }
};

module.exports = BestBuy;