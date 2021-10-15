const { MessageEmbed, Permissions } = require('discord.js');
const Guild = require('../../models/guild');
const mongoose = require('mongoose');

module.exports = {
    name: 'botrole',
    category: 'admin',
    description: 'Selecciona un rol para dar a un al usuario',
    usage: `botrole <@role, roleID>`,
    async execute(client, message, args) {
        message.delete();
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) return message.channel.send('No tienes permisos para utilizar este comando')
        const botRole = await message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
        const botRoleSettings = await Guild.findOne({
            _id: message.guild.id
        }, async (err, guild) => {
            if (err) console.error(err);
            if (!guild) {
                const newGuild = new Guild({
                    _id: message.guild.id,
                    guildName: message.guild.name,
                    botRoleID: botRole.id
                });
                await newGuild.save()
                .catch(err => console.error(err));
            }
        });
        let avtTW = client.user.avatarURL();
        let icon = message.guild.iconURL() || client.user.avatarURL();
        let botRoleFetch = message.guild.roles.cache.get(botRoleSettings.botRoleID);
        const botRoleFetchEmbed = new MessageEmbed()
            .setColor('#ffffff')
            .setThumbnail(icon)
            .addField('Bot Role', `${botRoleFetch}`)
            .setFooter('Tidewave', avtTW);
        if (!channel) return message.channel.send({ embeds: [botRoleFetchEmbed] });
        await botRoleSettings.updateOne({
            botRoleID: botRole.id
        });
        const botRoleEmbed = new MessageEmbed()
            .setColor('#ffffff')
            .setThumbnail(icon)
            .addField('Bot Role', `${botRole}`)
            .setFooter('Tidewave', avtTW);
        return message.channel.send({ embeds: [botRoleEmbed] });
    }
}