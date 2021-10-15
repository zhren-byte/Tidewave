/*const {MessageEmbed, Permissions} = require("discord.js")
const Guild = require('../../models/guild');
module.exports = {
name: 'mute',
aliases: ['silenciar', 'm'],
category: 'moderation',
description: 'Le quita el derecho a la voz a todo aquel que le sobe el miembro a algún admin',
async execute(client, message, args) {
		if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) return message.channel.send("No tienes permisos para hacer esto.");
		warningSet = await Guild.findOne({_id: message.guild.id});
		let channel = client.channels.cache.get(warningSet.logChannelID) || message.channel
		let user = message.mentions.users.first() || message.guild.members.cache.get(args[0]);
    let role = message.guild.roles.cache.find(r => r.id == '891140387954118706')
		let mod = message.author.username;
		let reason = args.slice(1).join(" ");
		if (!user) return message.channel.send("Utilice el ID de un usuario.");
		if (user.id === message.author.id) return message.channel.send("No te puedes expulsar a ti mismo.");
		if (user.id === client.user.id) return message.channel.send("No puedes expulsarme.");
		if (!reason) reason = "No hay razón provista";
    (user.id).roles.add(role).catch(console.error);
		const muteembed = new MessageEmbed()
				.setColor('#ff0000')
				.setAuthor(`Tidewave`, client.user.avatarURL())
				.setDescription(`**Miembro:** ${user} (${user.id})\n **Accion:** Mute\n**Razon:** ${reason}\n **Moderador:** ${mod}`)
				.setTimestamp()
		channel.send({ embeds: [muteembed] });
  }
}
*/