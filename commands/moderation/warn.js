/* eslint-disable no-undef */
const { MessageEmbed, Permissions } = require('discord.js');
const Guild = require('../../models/guild');
const User = require('../../models/user');
module.exports = {
	name: 'warn',
	aliases: ['w', 'adv'],
	description: 'Advierte al usuario por su comportamiento',
	category: 'moderation',
	async execute(client, message, args) {
		if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
			return message.channel.send('No tienes permisos para hacer esto.');
		}
		warningSet = await Guild.findOne({ _id: message.guild.id });
		const channel =
			client.channels.cache.get(warningSet.logChannelID) || message.channel;
		const ids = args[0];
		const user =
			(await message.mentions.users.first()) ||
			message.guild.members.cache.get(ids);
		const mod = message.author.username;
		let reason = args.slice(1).join(' ');
		if (!user) return message.channel.send('Mencione un usuario.');
		if (args[1] === '?') {
			const UserSet = await User.findOne({ _id: user.id });
			const embed = new MessageEmbed()
				.setColor('#ff0000')
				.setAuthor({
					name: 'Tidewave',
					iconURL: client.user.displayAvatarURL(),
					url: 'https://www.hellhades.tk',
				})
				.setDescription(
					`**Miembro:** ${user} (${user.id})\n**Warns:** 1\n**Ultimo warn:** ${UserSet.lastWarn}`,
				)
				.setTimestamp();
			return message.channel.send({ embed });
		}
		// if (user.id === message.author.id) return message.channel.send('No te puedes warnear a ti mismo.');
		if (user.id === client.user.id) return message.channel.send('No puedes warnearme.');
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
								warn: 1,
								lastWarn: new Date(),
							},
						],
					});
					newUser.save().catch((err) => console.error(err));
					const warnembed = new MessageEmbed()
						.setColor('#ff0000')
						.setAuthor({
							name: 'Tidewave',
							iconURL: client.user.displayAvatarURL(),
							url: 'https://www.hellhades.tk',
						})
						.setDescription(
							`**Miembro:** ${user} (${user.id})\n**Accion:** Warn\n**Razon:** ${reason}\n**Warns:** 1\n**Moderador:** ${mod}`,
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
							lastWarn: new Date(),
						});
						return usuario.save().catch((err) => console.error(err));
					}
					else {
						const newWarn = warn.warn + 1;
						warn.warn = newWarn;
						warn.lastWarn = new Date();
						usuario.save().catch((err) => console.error(err));
						const warnembed = new MessageEmbed()
							.setColor('#ff0000')
							.setAuthor({
								name: 'Tidewave',
								iconURL: client.user.displayAvatarURL(),
								url: 'https://www.hellhades.tk',
							})
							.setDescription(
								`**Miembro:** ${user} (${
									user.id
								})\n**Accion:** Warn\n**Razon:** ${reason}\n**Warns:** ${
									newWarn
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
