const { getSiteParser } = require('./site_parser');
const request = require('request-promise');
const { logError, HEADERS } = require('./util');

let urls = ['https://www.zara.com/mx/es/cazadora-bomber-basica-p08288473.html?v1=177657495&v2=2119519','https://www.zara.com/mx/es/trench-cruzado-water-repellent-p06518310.html?v1=222169023&v2=2170445'];
(async () => {
    for (var url of urls) {
        try {
            await request({ uri: url, headers: HEADERS })
            .then(body => {
                console.log('Trying:', url)
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
        
    }
})();