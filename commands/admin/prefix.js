const { MessageEmbed, Permissions } = require('discord.js');
const mongoose = require('mongoose');
const Guild = require('../../models/guild');
const dotenv = require('dotenv');
dotenv.config()
module.exports = {
    name: 'prefix',
    category: 'admin',
    description: 'Muestra o selecciona el prefix del servidor.',
    usage: `prefix [newPrefix]`,
    async execute (client, message, args) {
        message.delete();
        const settings = await Guild.findOne({
            _id: message.guild.id
        }, (err, guild) => {
            if (err) console.error(err)
            if (!guild) {
                const newGuild = new Guild({
                    _id: message.guild.id,
                    guildName: message.guild.name,
                    prefix: process.env.PREFIX
                })
                newGuild.save()
                .then(result => console.log(result))
                .catch(err => console.error(err));
                return message.channel.send('Este servidor no esta en la base de datos, vuelve a intentarlo')
            }
        });
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
            return message.channel.send(`El prefix del servidor es: \`${settings.prefix}\``);
        };
        if (args.length < 1) {
            return message.channel.send(`El prefix del servidor es: \`${settings.prefix}\``);
        };
        await settings.updateOne({
            prefix: args[0]
        });
        return message.channel.send(`El prefix del servidor se cambio a: \`${args[0]}\``);
    }
}