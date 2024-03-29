const request = require('request-promise');

const User = require('./models/user');
const Watch = require('./models/watch');
const Product = require('./models/product');
const Notification = require('./models/notification');

const Bershka = require('./parsers/bershka');
const BestBuy = require('./parsers/bestbuy');
const BestBuyCanada = require('./parsers/bestbuy_canada');
const Heb = require('./parsers/heb');
const LaCastellana = require('./parsers/la_castellana');
// Not supported by current implementation.
// const Sams = require('./parsers/sams');
const Soriana = require('./parsers/soriana');
const Vinoteca = require('./parsers/vinoteca');
const Walmart = require('./parsers/walmart');
const Zara = require('./parsers/zara');

const { logError, GREETINGS, HEADERS } = require('./util');


function getSiteParser(url, body) {
    if (url.indexOf("bershka.com/") !== -1)
        return new Bershka(body);
    else if (url.indexOf("bestbuy.com/") !== -1)
        return new BestBuy(body);
    else if (url.indexOf("bestbuy.ca/") !== -1)
        return new BestBuyCanada(body);
    else if (url.indexOf("heb.com.mx/") !== -1)
        return new Heb(body);
    else if (url.indexOf("lacastellana.com/") !== -1)
        return new LaCastellana(body);
    else if (url.indexOf("soriana.com/") !== -1)
        return new Soriana(body);
    else if (url.indexOf("vinoteca.com/") !== -1)
        return new Vinoteca(body);
    else if (url.indexOf("walmart.com/") !== -1)
        return new Walmart(body);
    else if (url.indexOf("zara.com/") !== -1)
        return new Zara(body);
}

function notifyUsers(prod, body) {
    const site = getSiteParser(prod.url, body);

    if (site.soldOut()) return;

    let currPrice = site.getCurrentPrice();
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
                                let percentage = (1 - currPrice / watch.desiredPrice) * 100;
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
    })
    .catch(logError)
    .then(() => {
        Product.updateOne(
            { "id": prod.id },
            { "latestPrice": currPrice }
        ).catch(logError);
    });
}


module.exports = {
     scanForDiscounts(client) {
        console.log('scanning for discounts...')
        Product.find({}).then(async function(products) {
            for (var prod of products) {
                await request({ uri: prod.url, headers: HEADERS })
                .then(body => notifyUsers(prod, body))
                .catch(logError);
            }
        })
        .catch(logError);
    },
    getSiteParser
}