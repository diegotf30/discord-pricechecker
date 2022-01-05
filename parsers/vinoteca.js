const request = require('sync-request');

const { getMetaTagContent, HEADERS } = require('../util');

class Vinoteca {
    constructor(body) {
        this.body = body;
    }

    getProductInfo() {
        const sku = getMetaTagContent(this.body, {'itemprop': 'sku'});
        const sku_url = `https://www.vinoteca.com/produto/sku/${sku}`;
        return JSON.parse(request('GET', sku_url, { headers: HEADERS }).getBody('utf8'))[0]
    }

    getCurrentPrice() {
        const prod_info = this.getProductInfo();
        return prod_info.SkuSellersInformation[0].Price;
    }

    soldOut() {
        const prod_info = this.getProductInfo();
        return !prod_info.Availability;
    }

    getProductName() {
        return getMetaTagContent(this.body, {'itemprop': 'name'});
    }

    getBasePrice() {
        const prod_info = this.getProductInfo();
        return prod_info.SkuSellersInformation[0].ListPrice;
    }
};

module.exports = Vinoteca;