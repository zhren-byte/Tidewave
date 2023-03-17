const { EmbedBuilder, Permissions } = require('discord.js');
const Guild = require('../../models/guild');
const User = require('../../models/user');
module.exports = {
	name: 'clearwarn',
	aliases: ['clrw'],
	description: 'Establece el valor de advertencias del usuario a cero',
	category: 'moderation',
	async execute(client, message, args) {
		if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {return message.channel.send('No tienes permisos para hacer esto.');}
		const warningSet = await Guild.findOne({ _id: message.guild.id });
		const channel =
      client.channels.cache.get(warningSet.logChannelID) || message.channel;
		const user =
      (await message.guild.members.cache.get(args[0])) ||
      message.mentions.users.first();
		const mod = message.author.username;
		let reason = args.slice(1).join(' ');
		if (!user) return message.channel.send('Mencione un usuario.');
		// if (user.id === message.author.id) {return message.channel.send('No te puedes unwarnear a ti mismo.');}
		if (user.id === client.user.id) {return message.channel.send('No puedes unwarnearme.');}
		if (!reason) reason = 'No hay razón provista';
		await User.findOne(
			{
				_id: user.id,
			},
			(err, usuario) => {
				if (err) console.error(err);
				if (!usuario) {
					const newUser = new User({
						_id: message.author.id,
						userName: message.author.username,
						warns: [
							{
								_id: message.guild.id,
								warn: 0,
							},
						],
					});
					newUser.save().catch((err) => console.error(err));
					const warnembed = new EmbedBuilder()
						.setColor('#4697e1')
						.setAuthor({
							name: 'Tidewave',
							iconURL: client.user.displayAvatarURL(),
							url: 'https://www.hellhades.tk',
						})
						.setDescription(
							`**Miembro:** ${user} (${user.id})\n**Accion:** UnWarn\n**Razon:** ${reason}\n**Warns:** 0\n**Moderador:** ${mod}`,
						)
						.setTimestamp();
					return channel.send({ embeds: [warnembed] });
				}
				else {
					const warn = usuario.warns.find((w) => w._id === message.guild.id);
					if (!warn) {
						usuario.warns.push({
							_id: message.guild.id,
							warn: 1,
						});
						return usuario.save().catch((err) => console.error(err));
					}
					else {
						usuario.warns.find((w) => w._id === message.guild.id).warn = 0;
						usuario.save().catch((err) => console.error(err));
						const warnembed = new EmbedBuilder()
							.setColor('#4697e1')
							.setAuthor({
								name: 'Tidewave',
								iconURL: client.user.displayAvatarURL(),
								url: 'https://www.hellhades.tk',
							})
							.setDescription(
								`**Miembro:** ${user} (${
									user.id
								})\n**Accion:** UnWarn\n**Razon:** ${reason}\n**Warns:** ${
									0
								}\n**Moderador:** ${mod}`,
							)
							.setTimestamp();
						return channel.send({ embeds: [warnembed] });
					}
				}
			},
		);
	},
};
