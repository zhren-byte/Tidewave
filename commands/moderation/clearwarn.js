const {MessageEmbed, Permissions} = require("discord.js")
const mongoose = require('mongoose');
const Guild = require('../../models/guild');
const User = require('../../models/user');
module.exports = {
name: 'clearwarn',
aliases: ['clrw'],
description: 'Establece el valor de advertencias del usuario a cero',
category: 'moderation',
async execute(client, message, args) {
	if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) return message.channel.send("No tienes permisos para hacer esto.");
	warningSet = await Guild.findOne({_id: message.guild.id});
	let channel = client.channels.cache.get(warningSet.logChannelID) || message.channel
	let user = await message.guild.members.cache.get(args[0]) || message.mentions.users.first();
	let mod = message.author.username;
	let reason = args.slice(1).join(" ");
	if (!user) return message.channel.send("Mencione un usuario.");
	if (user.id === message.author.id) return message.channel.send("No te puedes unwarnear a ti mismo.");
	if (user.id === client.user.id) return message.channel.send("No puedes unwarnearme.");
	if (!reason) reason = "No hay razón provista";
	warnSet = await User.findOne({
		guildID: message.guild.id,
		userID: user.id
	}, (err, usuario) => {
		if (err) console.error(err)
		const warnembed = new MessageEmbed()
			.setColor('#4697e1')
			.setAuthor(`Tidewave`, client.user.avatarURL())
			.setDescription(`**Miembro:** ${user} (${user.id})\n**Accion:** Clear Warn\n**Razon:** ${reason}\n**Warns:** 0\n**Moderador:** ${mod}`)
			.setTimestamp()
		if (!usuario) {
			const newUser = new User({
				_id: mongoose.Types.ObjectId(),
				guildID: message.guild.id,
                userID: user.id,
    			userName: user.username,
    			warns: 0
			})
			newUser.save().catch(err => console.error(err));
			return channel.send({ embeds: [warnembed] })
		}else{
			usuario.updateOne({
				warns: 0
			}).catch(err => console.error(err));
			return channel.send({ embeds: [warnembed] })
		}
		});
	}
}