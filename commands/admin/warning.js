const { MessageEmbed, Permissions } = require('discord.js');
const Guild = require('../../models/guild');
const mongoose = require('mongoose');

module.exports = {
    name: 'warning',
    aliases: ['warnings'],
    category: 'admin',
    description: 'Selecciona el canal donde se enviaran los mensajes de advertencias',
    usage: `warnings <#channel, channelID>`,
    async execute(client, message, args) {
        message.delete();
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) return message.channel.send('No tienes permisos para utilizar este comando')
        const channel = await message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
        warningSet = await Guild.findOne({
            _id: message.guild.id
        }, async (err, guild) => {
            if (err) console.error(err);
            if (!guild) {
                const newGuild = new Guild({
                    _id: message.guild.id,
                    guildName: message.guild.name,
                    logChannelID: channel.id
                });
                await newGuild.save()
                .catch(err => console.error(err));
            }
        });
        let avtTW = client.user.avatarURL();
        let icon = message.guild.iconURL() || client.user.avatarURL();
        const warningEmbed = new MessageEmbed()
            .setColor('#ffffff')
            .setThumbnail(icon)
            .addField('Warnings', `${message.guild.roles.cache.get(warningSet.logChannelID)}`)
            .setFooter('Tidewave', avtTW);
        if (!channel) return message.channel.send({ embeds: [warningEmbed] })
        await warningSet.updateOne({
            logChannelID: channel.id
        });
        return message.channel.send(`El canal de logs se ha seleccionado para \`${channel}\``);
    }
}