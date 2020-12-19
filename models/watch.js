const mongoose = require('mongoose');

var watchSchema = new mongoose.Schema({
    desiredPrice: { type: Number },
    product: { type : mongoose.Schema.ObjectId, ref : 'Product', required: true },
    user: { type : mongoose.Schema.ObjectId, ref : 'User', required: true }
});

module.exports = mongoose.model('Watch', watchSchema);