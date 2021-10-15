const { MessageEmbed, Permissions } = require('discord.js');
const Guild = require('../../models/guild');
const mongoose = require('mongoose');

module.exports = {
    name: 'muterole',
    category: 'admin',
    description: 'Selecciona un rol para mutear un usuario',
    usage: `muterole <@role, roleID>`,
    async execute(client, message, args) {
        message.delete();
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) return message.channel.send('No tienes permisos para utilizar este comando')
        const muteRole = await message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
        const muteRoleSettings = await Guild.findOne({
            _id: message.guild.id
        }, async (err, guild) => {
            if (err) console.error(err);
            if (!guild) {
                const newGuild = new Guild({
                    _id: message.guild.id,
                    guildName: message.guild.name,
                    muteRoleID: muteRole.id
                });
                await newGuild.save()
                .catch(err => console.error(err));
            }
        });
        let avtTW = client.user.avatarURL();
        let icon = message.guild.iconURL() || client.user.avatarURL();
        const muteRoleEmbed = new MessageEmbed()
            .setColor('#ffffff')
            .setThumbnail(icon)
            .addField('Mute Role', `${message.guild.roles.cache.get(muteRoleSettings.muteRoleID)}`)
            .setFooter('Tidewave', avtTW);
        if (!channel) return message.channel.send({ embeds: [muteRoleEmbed] })
        await muteRoleSettings.updateOne({
            muteRoleID: muteRole.id
        });
        return message.channel.send(`El role muteo se ha seleccionado para \`${muteRole}\``);
    }
}