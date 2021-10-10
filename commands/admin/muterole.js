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
            guildID: message.guild.id
        }, async (err, guild) => {
            if (err) console.error(err);
            if (!guild) {
                const newGuild = new Guild({
                    _id: mongoose.Types.ObjectId(),
                    guildID: message.guild.id,
                    guildName: message.guild.name,
                    muteRoleID: muteRole.id
                });
                await newGuild.save()
                .catch(err => console.error(err));
            }
        });
        if (!muteRole) return message.channel.send(`Rol muteo: ${message.guild.roles.cache.get(muteRoleSettings.muteRoleID)}`)
        await muteRoleSettings.updateOne({
            muteRoleID: muteRole.id
        });
        return message.channel.send(`El role muteo se ha seleccionado para ${muteRole}`);
    }
}