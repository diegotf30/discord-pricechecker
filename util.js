const JSSoup = require('jssoup').default;

function getDivText(body, opts) {
    return getTagText(body, 'div', opts);
}

function getButtonText(body, opts) {
    return getTagText(body, 'button', opts);
}

function getTagText(body, tag, opts) {
    var soup = new JSSoup(body);
    var elem = soup.find(tag, opts);
    return elem ? elem.getText(' ') : '';
}

function parsePrice(num_str) {
    return parseFloat(num_str.replace(/,/g, "").replace(/\$/g, ""));
}

// Same as parsePrice but doesn't consider dollar sign ($)
function parseNumber(num_str) {
    return parseFloat(num_str.replace(/,/g, ""));
}

function logError(err) {
    return console.error(err);
}

module.exports = {
    getDivText,
    getButtonText,
    parsePrice,
    parseNumber,
    logError
}