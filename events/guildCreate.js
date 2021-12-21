const mongoose = require('mongoose');
const Guild = require('../models/guild');
module.exports = {
name: 'guildCreate',
on: true,
async execute(client, guild){
    const Settings = await Guild.findOne({_id: guild.id}, (err, guildC) => {
        if (err) console.error(err)
        if (!guildC) {
            const newGuild = new Guild({
                _id: guild.id,
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