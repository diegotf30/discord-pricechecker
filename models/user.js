const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    name: { type: String },
    discordId: { type: String, required: true, unique: true },
});

module.exports = mongoose.model('User', userSchema);