const { MessageEmbed, Permissions } = require('discord.js');
const Guild = require('../../models/guild');
const mongoose = require('mongoose');

module.exports = {
    name: 'sugestionchannel',
    aliases: ['suggestionChannel'],
    category: 'admin',
    description: 'Selecciona el canal donde se enviaran los mensajes de sugerencias',
    usage: `sugestionChannel <#channel, channelID>`,
    async execute(client, message, args) {
        message.delete();
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) return message.channel.send('No tienes permisos para utilizar este comando')
        const channel = await message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
        sugestionSettings = await Guild.findOne({
            guildID: message.guild.id
        }, async (err, guild) => {
            if (err) console.error(err);
            if (!guild) {
                const newGuild = new Guild({
                    _id: mongoose.Types.ObjectId(),
                    guildID: message.guild.id,
                    guildName: message.guild.name,
                    sugestionChannelID: channel.id
                });
                await newGuild.save()
                .catch(err => console.error(err));
            }
        });
        if (!channel) return message.channel.send(`Rol automatico: ${message.guild.channels.cache.get(sugestionSettings.sugestionChannelID)}`)
        await sugestionSettings.updateOne({
            sugestionChannelID: channel.id
        });
        return message.channel.send(`El role automatico se ha seleccionado para ${channel}`);
    }
}