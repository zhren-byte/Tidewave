const { Permissions, MessageEmbed } = require('discord.js');
module.exports = {
	name: 'unban',
	aliases: ['pardon', 'desban'],
	description: 'Desbanea permanentemente al usuario',
	usage: 'unban <usuario>',
	category: 'moderation',
	run: async (client, message, args) => {
		const channel = client.channels.cache.get('675585949983440897');
		if (!message.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
			return message.channel.send(
				'No tienes permiso para utilizar este comando',
			);
		}
		if (isNaN(args[0])) return message.channel.send('Proporcione una ID');
		const bannedMember = await client.users.fetch(args[0]);
		if (!bannedMember) {return message.channel.send('Use la id del usuario para desbanearlo');}
		let reason = args.slice(1).join(' ');
		if (!reason) reason = 'No fue proporcionada una razon';
		message.delete();
		try {
			message.guild.members.unban(bannedMember, reason);
			const embed = new MessageEmbed()
				.setColor('#ff0000')
				.setAuthor({ name: 'Tidewave', iconURL: client.user.displayAvatarURL(), url: 'https://hellhades.tk' })
				.setDescription(
					`**Miembro:** ${bannedMember} (${bannedMember.id})\n **Accion:** Un-Ban\n **Moderador:** ${message.author.username}`,
				)
				.setTimestamp();
			channel.send(embed);
		}
		catch (e) {
			message.reply('No se pudo banear al miembro');
		}
	},
};
