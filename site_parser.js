const request = require('request');
const Discord = require('discord.js');
const JSSoup = require('jssoup').default;

const User = require('./models/user');
const Watch = require('./models/watch');
const Product = require('./models/product');
const Notification = require('./models/notification');

const GREETINGS = ['bro :flushed:...', 'Hey!', 'Heyo,', 'Karnal,', 'Hey, listen!', 'Waddup,', 'Heyo!']

function getDivText(body, opts) {
    var soup = new JSSoup(body);
    var elem = soup.find('div', opts);
    return elem ? elem.getText(' ') : '';
}

function parsePrice(num_str) {
    return parseFloat(num_str.replace(/,/g, "").replace(/\$/g, ""));
}

function logError(err) {
    return console.error(err);
}

function getCurrentPrice(body) {
    return parsePrice(getDivText(body, {class: 'product-price'}));;
}

function checkSoldOut(body) {
    return getDivText(body, {class: 'shop-add-to-cart'}) == 'Agotado';
}

module.exports = {
    scanForDiscounts(client) {
        console.log('scanning for discounts...')
        Product.find({}).then(products => {
            for (var prod of products) {
                request(prod.url, (err, res, body) => {
                    if (err) return console.error(err);
                    if (checkSoldOut(body)) return;

                    let currPrice = getCurrentPrice(body);
                    if (currPrice < prod.latestPrice)
                        console.log(`\tFound discount for ${prod.name}, $${currPrice}`);

                    let greeting = GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
                    let alertMsg = `${greeting} "${prod.name}" is on sale -> $${currPrice}!`;
                    // Privately notify all users that the product is on sale
                    Watch.find({ product: prod.id }).then(watches => {
                        for (const watch of watches) {
                            // Skip unless price has dropped (when no desired price provided)
                            if (watch.desiredPrice === null && currPrice >= prod.latestPrice)
                                continue;
                            else if (watch.desiredPrice !== null && currPrice > watch.desiredPrice)
                                continue;

                            // Check if we already notified user
                            Notification.findOne({ user: watch.user, product: prod.id, price: currPrice }).then(notif => {
                                if (notif !== null) return;

                                notif = new Notification({
                                    user: watch.user,
                                    product: prod.id,
                                    price: currPrice,
                                });
                                notif.save().then(() => {
                                    User.findById(watch.user).then(user => {
                                        console.log(`\tNotified ${user.name} of ${prod.name} ($${currPrice})`);
                                        client.users.fetch(user.discordId).then(discordUser => {
                                            discordUser.send(alertMsg);
                                            if (watch.desiredPrice != null) {
                                                let percentage = (1 - currPrice/watch.desiredPrice) * 100;
                                                discordUser.send(`${percentage.toFixed(2)}% lower than your desired price ($${watch.desiredPrice})`);
                                            }
                                        })
                                        .catch(logError);
                                    })
                                    .catch(logError);
                                })
                                .catch(logError);
                            })
                            .catch(logError);
                        }

                        if (currPrice < prod.latestPrice) {
                            prod.latestPrice = currPrice;
                            prod.save();
                        }
                    })
                    .catch(logError);
                });
            }
        })
        .catch(logError);
    },
    getProductName(body) {
        return getDivText(body, {id: 'sku-title'});
    },
    getBasePrice(body) {
        let basePriceStr = getDivText(body, {class: 'product-regprice'});
        return parsePrice(basePriceStr.split(/\s+/)[1]);
    },
    getCurrentPrice,
    checkSoldOut
}