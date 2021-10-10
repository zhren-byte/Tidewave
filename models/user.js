const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildID: String,
    userID: String,
    userName: String,
    warns: {type: [Object], default: 0},
});

module.exports = mongoose.model('User', userSchema, 'user')