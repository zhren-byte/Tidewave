const { MessageEmbed, Permissions } = require('discord.js');
const Guild = require('../../models/guild');
const mongoose = require('mongoose');

module.exports = {
    name: 'welcome',
    category: 'admin',
    description: 'Selecciona el canal donde se enviaran los mensajes de bienvenidas',
    usage: `welcome <#channel, channelID>`,
    async execute(client, message, args) {
        message.delete();
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) return message.channel.send('No tienes permisos para utilizar este comando')
        const channel = await message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
        welcomeSet = await Guild.findOne({
            _id: message.guild.id
        }, async (err, guild) => {
            if (err) console.error(err);
            if (!guild) {
                const newGuild = new Guild({
                    _id: message.guild.id,
                    guildName: message.guild.name,
                    welcomeChannelID: channel.id
                });
                await newGuild.save()
                .catch(err => console.error(err));
            }
        });
        let avtTW = client.user.avatarURL();
        let icon = message.guild.iconURL() || client.user.avatarURL();
        const welcomeEmbed = new MessageEmbed()
            .setColor('#ffffff')
            .setThumbnail(icon)
            .addField('Welcome', `${message.guild.roles.cache.get(welcomeSet.welcomeChannelID)}`)
            .setFooter('Tidewave', avtTW);
        if (!channel) return message.channel.send({ embeds: [welcomeEmbed] })
        await welcomeSet.updateOne({
            welcomeChannelID: channel.id
        });
        return message.channel.send(`El canal de welcome se ha seleccionado para \`${channel}\``);
    }
}