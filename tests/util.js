const { getSiteParser } = require('../site_parser');
const request = require('request-promise');
const { logError, HEADERS } = require('../util');

async function testURLs(urls) {
    for (var url of urls) {
        try {
            await request({ uri: url, headers: HEADERS })
            .then(body => {
                console.log('URL:', url)
                a = getSiteParser(url, body);
                console.log('Current price:', a.getCurrentPrice());
                console.log('Sold out:', a.soldOut());
                console.log('Product name:', a.getProductName());
                console.log('Base price:', a.getBasePrice());
            })
            .catch(logError);
        } catch (e) {
            console.error(e);
        };
        console.log('---------------')
    }
    console.log('')
}

module.exports = { testURLs }