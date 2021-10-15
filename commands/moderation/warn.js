const {MessageEmbed, Permissions} = require("discord.js")
const Guild = require('../../models/guild');
const User = require('../../models/user');
module.exports = {
name: 'warn',
aliases: ['w', 'adv'],
description: 'destierra del server al wachin seleccionado',
category: 'moderation',
async execute(client, message, args) {
		if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) return message.channel.send("No tienes permisos para hacer esto.");
		//canal
		warningSet = await Guild.findOne({_id: message.guild.id});
		let channel = client.channels.cache.get(warningSet.logChannelID) || message.channel
		//usuario
		let user = message.mentions.users.first() || message.guild.members.cache.get(args[0]);
		let mod = message.author.username;
		let reason = args.slice(1).join(" ");
		if (!user) return message.channel.send("Mencione un usuario.");
		if (user.id === message.author.id) return message.channel.send("No te puedes banear a ti mismo.");
		if (user.id === client.user.id) return message.channel.send("No puedes banearme.");
		if (!reason) reason = "No hay razón provista";
		warnSet = await User.findOne({
			guildID: message.guild.id,
			userID: message.author.id
		}, (err, usuario) => {
			if (err) console.error(err)
			if (!usuario) {
				const newUser = new User({
					_id: mongoose.Schema.Types.ObjectId,
					guildID: message.guild.id,
                	userID: message.author.id,
    				userName: message.author.username,
    				warns: 1
					})
					newUser.save()
					.catch(err => console.error(err));
					const warnembed = new MessageEmbed()
					.setColor('#ff0000')
					.setAuthor(`Tidewave`, client.user.avatarURL())
					.setDescription(`**Miembro:** ${user} (${user.id})\n**Accion:** Warn\n**Razon:** ${reason}\n**Warns:** 1\n**Moderador:** ${mod}`)
					.setTimestamp()
					return channel.send({ embeds: [warnembed] })
			}else{
					usuario.updateOne({
						warns: ((usuario.warns)+1)
					})
					.catch(err => console.error(err));
					const warnembed = new MessageEmbed()
						.setColor('#ff0000')
						.setAuthor(`Tidewave`, client.user.avatarURL())
						.setDescription(`**Miembro:** ${user} (${user.id})\n**Accion:** Warn\n**Razon:** ${reason}\n**Warns:** ${(usuario.warns)+1}\n**Moderador:** ${mod}`)
						.setTimestamp()
					return channel.send({ embeds: [warnembed] })
			}
		});
	}
}