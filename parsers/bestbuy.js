const { parsePrice, getDivText } = require('./util');

class BestBuy {
    constructor(body) {
        this.body = body;
    }

    getCurrentPrice() {
        return parsePrice(getDivText(this.body, {class: 'product-price'}));;
    }

    soldOut() {
        return getDivText(this.body, {class: 'shop-add-to-cart'}) == 'Agotado';
    }

    getProductName() {
        return getDivText(this.body, {id: 'sku-title'});
    }

    getBasePrice() {
        let basePriceStr = getDivText(this.body, {class: 'product-regprice'});
        return parsePrice(basePriceStr.split(/\s+/)[1]);
    }
};

module.exports = BestBuy;