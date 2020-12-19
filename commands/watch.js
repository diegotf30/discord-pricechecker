const request = require('request');

const User = require('../models/user');
const Watch = require('../models/watch');
const Product = require('../models/product');
const Notification = require('../models/notification');
const { getBasePrice, getCurrentPrice, getProductName } = require('../site_parser');

function parseNumber(num_str) {
    return parseFloat(num_str.replace(/,/g, ""));
}

function logError(err) {
    return console.error(err);
}

module.exports = {
	name: 'watch',
    description: 'pa wachar el precio de un productillow',
    // Args must have a URL for the desired product to be watched, and can have a desired discount price 
	execute(msg, args) {
        const prodURL = args[0];
        let price = null;
        if (args.length > 1) {
            price = parseNumber(args[1]);
        }

        request(prodURL, (err, res, body) => {
            if (err) return console.error(err);

            User.findOne({ discordId: msg.author.id})
                .then(user => {
                    if (!user) {
                        user = new User({
                            name: msg.author.username,
                            discordId: msg.author.id,
                        });
                    }
                    user.save().then(user => {
                        const prodName = getProductName(body);
                        Product.findOne({ name: prodName })
                            .then(prod => {
                                if (prod === null) {
                                    prod = new Product({
                                        name: prodName,
                                        url: prodURL,
                                        basePrice: getBasePrice(body),
                                        latestPrice: getCurrentPrice(body),
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
                                                let notif = new Notification({
                                                    user: user._id,
                                                    product: prod._id,
                                                    price: getCurrentPrice(body),
                                                });
                                                notif.save().then(() => {
                                                    let response = `Ya quedów browski te andaré wachando "${prod.name}" :sunglasses::ok_hand:`;
                                                    if (price !== null)
                                                        response += `\nSi el producto llega a bajar de $${price.toLocaleString()} te aviso brow`;
                                                    msg.channel.send(response);
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
        });
	},
};