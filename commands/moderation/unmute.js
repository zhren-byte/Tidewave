const { PermissionsBitField, EmbedBuilder } = require('discord.js');
module.exports = {
	name: 'unmute',
	description: 'Se le permite al usuario seleccionado poder entablar conversaciones en los canales',
	category: 'moderation',
	run: async (client, message) => {
		if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
			return message.channel.send(
				'No tienes permiso para utilizar este comando',
			);
		}
		const member = message.mentions.members.first();
		const role = message.guild.roles.cache.find(
			(r) => r.id == '691040456758394941',
		);
		member.roles.remove(role).catch(console.error);
		const channel = client.channels.cache.get('675585949983440897');
		const embed = new EmbedBuilder()
			.setColor('#ff0000')
			.setAuthor({ name: 'Tidewave', iconURL: client.user.displayAvatarURL(), url: 'https://hellhades.tk' })
			.setDescription(
				`**Miembro:** ${member} (${member.id})\n **Accion:** Un-Mute\n **Moderador:** ${message.author.username}`,
			)
			.setTimestamp();
		channel.send(embed);
	},
};
