 const { parsePrice, getDivText, getH1Text } = require('../util');

class Soriana {
    constructor(body) {
        this.body = body;
    }

    getCurrentPrice() {
        let prices = getDivText(this.body, {'class': 'contentPrices'}).trim().split(/(\s+)/);
        return prices > 1 ? parsePrice(prices[2]) : this.getBasePrice();
    }

    soldOut() {
        return false // TODO: Change when finding SOLD OUT product
    }

    getProductName() {
        return getH1Text(this.body, {class: 'product-name'});
    }

    getBasePrice() {
        let prices = getDivText(this.body, {'class': 'contentPrices'}).trim().split(/(\s+)/);
        return parsePrice(prices[0]);
    }
};

module.exports = Soriana;