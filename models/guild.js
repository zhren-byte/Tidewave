const mongoose = require('mongoose');

const guildSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildID: String,
    guildName: String,
    prefix: String,
    logChannelID: String,
    welcomeChannelID: String,
    sugestionChannelID: String,
    muteRoleID: String,
    autoRoleID: String,
    botRoleID: String
});

module.exports = mongoose.model('Guild', guildSchema, 'guilds');