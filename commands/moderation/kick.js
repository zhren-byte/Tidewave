const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const Guild = require('../../models/guild');
module.exports = {
	name: 'kick',
	aliases: ['expulsar', 'patear', 'k'],
	category: 'moderation',
	usage: 'kick <usuario> <razon>',
	description: 'Expulsa de la comunidad a aquel que haya perturbado su armonía',
	async execute(client, message, args) {
		if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {return message.channel.send('No tienes permisos para hacer esto.');}
		const warningSet = await Guild.findOne({ _id: message.guild.id });
		const channel =
      client.channels.cache.get(warningSet.logChannelID) || message.channel;
		const user =
      message.mentions.users.first() ||
      message.guild.members.cache.get(args[0]);
		const mod = message.author.username;
		let reason = args.slice(1).join(' ');
		if (!user) return message.channel.send('Mencione un usuario.');
		if (user.id === message.author.id) {return message.channel.send('No te puedes expulsar a ti mismo.');}
		if (user.id === client.user.id) {return message.channel.send('No puedes expulsarme.');}
		if (!reason) reason = 'No hay razón provista';
		message.guild.members
			.kick(user, [reason])
			.then(() => {
				const kickembed = new EmbedBuilder()
					.setColor('#ff0000')
					.setAuthor({ name: 'Tidewave', iconURL: client.user.displayAvatarURL(), url: 'https://hellhades.tk' })
					.setDescription(
						`**Miembro:** ${user} (${user.id})\n **Accion:** Kick\n**Razon:** ${reason}\n **Moderador:** ${mod}`,
					)
					.setTimestamp();
				channel.send({ embeds: [kickembed] });
			})
			.catch(() => {
				message.reply('No he podido kickear al miembro');
			});
	},
};
