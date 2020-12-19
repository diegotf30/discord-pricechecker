const mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    url: { type: String, required: true, unique: true },
    basePrice: { type: Number, required: true },
});

module.exports = mongoose.model('Product', productSchema);
