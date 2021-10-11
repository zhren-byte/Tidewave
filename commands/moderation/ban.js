const {MessageEmbed, Permissions} = require("discord.js")
const Guild = require('../../models/guild');
module.exports = {
name: 'ban',
aliases: ['desterrar', 'expatriar','b'],
category: 'moderation',
description: 'destierra del server al wachin seleccionado',
async execute(client, message, args) {
		if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) return message.channel.send("No tienes permisos para hacer esto.");
		warningSet = await Guild.findOne({_id: message.guild.id});
		let channel = client.channels.cache.get(warningSet.logChannelID) || message.channel
		let user = message.mentions.users.first() || message.guild.members.cache.get(args[0]);
		//let member = message.guild.member(user);
		let mod = message.author.username;
		let reason = args.slice(1).join(" ");
		if (!user) return message.channel.send("Mencione un usuario.");
		if (user.id === message.author.id) return message.channel.send("No te puedes banear a ti mismo.");
		if (user.id === client.user.id) return message.channel.send("No puedes banearme.");
		if (!reason) reason = "No hay razón provista";
		message.guild.bans.create(user, {reason: reason}).then(() => {
		const banembed = new MessageEmbed()
				.setColor('#ff0000')
				.setAuthor(`Tidewave`, client.user.avatarURL())
				.setDescription(`**Miembro:** ${user} (${user.id})\n **Accion:** Ban\n**Razon:** ${reason}\n **Moderador:** ${mod}`)
				.setTimestamp()
		channel.send({ embeds: [banembed] })
		}).catch(err => {message.reply("No he podido banear al miembro")})
		}
}