// This file runs tests on all parsers
// TODO: add the rest of the parsers
const { testURLs } = require('./util');

(async () => {
    // ZARA
    console.log('############# Zara #############')
    await testURLs([
        'https://www.zara.com/mx/es/trench-cruzado-water-repellent-p06518310.html?v1=222169023&v2=2170445',
        'https://www.zara.com/mx/es/cazadora-bomber-basica-p08288473.html?v1=177657495&v2=2119519'
    ]);
    
    // BERSHKA
    console.log('############# Bershka #############')
    await testURLs([
        'https://www.bershka.com/mx/pantal%C3%B3n-felpa-jogger-oversize-print-anime-c0p115716187.html?colorId=251&stylismId=0',
        'https://www.bershka.com/mx/gorra-b%C3%A1sica-c0p116908524.html?colorId=500&stylismId=0' // Sold out product
    ]);
})();