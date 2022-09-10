const request = require('request-promise');

const User = require('../models/user');
const Watch = require('../models/watch');
const Product = require('../models/product');
const Notification = require('../models/notification');
const { getSiteParser } = require('../site_parser');
const { parseNumber, logError, HEADERS } = require('../util');

module.exports = {
	name: 'watch',
    description: 'pa wachar el precio de un productillow',
    // Args must have a URL for the desired product to be watched, and can have a desired discount price 
	execute(msg, args) {
        console.log(`received "${msg} ${args}"`)
        if (args.length > 2) {
            return console.error(`"${msg} ${args}" has more than 2 args. Command must have format "watch $URL [$PRICE]"`);
        }

        let prodURL = args[0];
        let price = null;
        if (args.length > 1) {
            if (isNaN(parseNumber(args[0]))) {  // User used command with format .watch $URL $price 
                price = parseNumber(args[1]);
            } else {  // User used command with format .watch $price $URL
                prodURL = args[1];
                price = parseNumber(args[0]);
            }
        }
        request({ uri: prodURL, headers: HEADERS })
        .then(body => {
            console.log('finished request to site.');
            // Send quick response to discord user.
            let response = `Ya quedów browski te andaré wachando "${prod.name}" :sunglasses::ok_hand:`;
            if (price !== null)
                response += `\nSi el producto llega a bajar de $${price.toLocaleString()} te aviso brow`;
            msg.channel.send(response);

            User.findOne({ discordId: msg.author.id})
                .then(user => {
                    if (!user) {
                        user = new User({
                            name: msg.author.username,
                            discordId: msg.author.id,
                        });
                    }
                    user.save().then(user => {
                        const site = getSiteParser(prodURL, body);
                        const prodName = site.getProductName();
                        Product.findOne({ name: prodName })
                            .then(prod => {
                                if (prod === null) {
                                    prod = new Product({
                                        name: prodName,
                                        url: prodURL,
                                        basePrice: site.getBasePrice(),
                                        latestPrice: site.getCurrentPrice(),
                                    });
                                }
                                prod.save().then(prod => {
                                    Watch.findOne({ product: prod._id, user: user._id })
                                        .then(watch => {
                                            if (watch === null) {
                                                watch = new Watch({
                                                    product: prod._id,
                                                    user: user._id,
                                                });
                                            }
                                            watch.desiredPrice = price;
                                            watch.save().then(() => {
                                                const notif = new Notification({
                                                    user: user._id,
                                                    product: prod._id,
                                                    price: site.getCurrentPrice(),
                                                });
                                                notif.save().catch(logError);
                                            })
                                            .catch(logError);
                                        })
                                        .catch(logError);
                                })
                                .catch(logError);
                            })
                            .catch(logError);
                    })
                    .catch(logError);
                })
                .catch(logError);
        })
        .catch(logError);
	},
};