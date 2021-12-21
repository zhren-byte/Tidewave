const mongoose = require('mongoose');
const Guild = require('../models/guild');
module.exports = {
name: 'guildCreate',
on: true,
async execute(client, guild){
    const guildID = guild.replace(/[<@!&>]/g, '');
    const server = message.guild.members.cache.get(guildID);
    const Settings = await Guild.findOne({_id: server.id}, (err, guild) => {
        if (err) console.error(err)
        if (!guild) {
            const newGuild = new Guild({
                _id: server.id,
                guildName: guild.name,
                prefix: process.env.PREFIX,
                logChannelID: null,
                welcomeChannelID: null,
                muteRoleID: null,
                autoRoleID: null,
            })
            newGuild.save()
            .catch(err => console.error(err));
        }
        });
    }
};