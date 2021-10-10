const mongoose = require('mongoose');
const Guild = require('../models/guild');

module.exports = {
name: 'guildCreate',
on: true,
async execute(client, guild){
    guild = new Guild({
        _id: mongoose.Types.ObjectId(),
        guildID: guild.id,
        guildName: guild.name,
        prefix: '>',
        logChannelID: null,
        welcomeChannelID: null,
        muteRoleID: null,
        autoRoleID: null,
    });
    guild.save()
    .then(result => console.log(result))
    .catch(err => console.error(err));
    }
};