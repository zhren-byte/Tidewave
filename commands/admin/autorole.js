const { MessageEmbed, Permissions } = require('discord.js');
const Guild = require('../../models/guild');
const mongoose = require('mongoose');
module.exports = {
    name: 'autorole',
    category: 'admin',
    description: 'Selecciona un rol para dar a un al usuario',
    usage: `autorole <@role, roleID>`,
    async execute(client, message, args) {
        message.delete();
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) return message.channel.send('No tienes permisos para utilizar este comando')
        const autoRole = await message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
        const autoRoleSettings = await Guild.findOne({
            _id: message.guild.id
        }, async (err, guild) => {
            if (err) console.error(err);
            if (!guild) {
                const newGuild = new Guild({
                    _id: message.guild.id,
                    guildName: message.guild.name,
                    autoRoleID: autoRole.id
                });
                await newGuild.save()
                .catch(err => console.error(err));
            }
        });
        if (!autoRole) return message.channel.send(`Rol automatico: \`${message.guild.roles.cache.get(autoRoleSettings.autoRoleID)}\``);
        await autoRoleSettings.updateOne({
            autoRoleID: autoRole.id
        });
        return message.channel.send(`El role automatico se ha seleccionado para \`${autoRole}\``);
    }
}