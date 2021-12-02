const JSSoup = require('jssoup').default;

const GREETINGS = ['bro :flushed:...', 'Hey!', 'Heyo,', 'Karnal,', 'Hey, listen!', 'Waddup,', 'Heyo!', 'ey', 'e', 'ewe', 'e we']
const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Mobile Safari/537.36',
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'accept-encoding': '*',
};

function getDivText(body, opts) {
    return getTagText(body, 'div', opts);
}

function getButtonText(body, opts) {
    return getTagText(body, 'button', opts);
}

function getSpanText(body, opts) {
    return getTagText(body, 'span', opts);
}

function getH1Text(body, opts) {
    return getTagText(body, 'h1', opts);
}

function getH2Text(body, opts) {
    return getTagText(body, 'h2', opts);
}

function getFirstChildText(body, tag, opts) {
    var soup = new JSSoup(body);
    var firstChild = soup.find(tag, opts).descendants[0];
    return getTagText(body, firstChild.name, firstChild.attrs);
}

function getTagText(body, tag, opts) {
    var soup = new JSSoup(body);
    var elem = soup.find(tag, opts);
    return elem ? elem.getText(' ') : '';
}

function findTextInSpan(body, text, opts = {}) {
    return findTextInTag(body, 'span', opts, text);
}

function findTextInTag(body, tag, opts, text) {
    var soup = new JSSoup(body);
    return soup.find(tag, opts, text) !== undefined;
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
    getSpanText,
    getH1Text,
    getH2Text,
    getFirstChildText,
    findTextInSpan,
    parsePrice,
    parseNumber,
    logError,
    GREETINGS,
    HEADERS
}