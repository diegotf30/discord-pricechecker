const mongoose = require('mongoose');

var notificationSchema = new mongoose.Schema({
    product: { type : mongoose.Schema.ObjectId, ref : 'Product', required: true },
    user: { type : mongoose.Schema.ObjectId, ref : 'User', required: true },
    price: { type: Number, required: true },
});

module.exports = mongoose.model('Notification', notificationSchema);
