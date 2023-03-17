const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const Guild = require('../../models/guild');
const User = require('../../models/user');
module.exports = {
	name: 'warn',
	aliases: ['w', 'adv'],
	description: 'Advierte al usuario por su comportamiento o [?] comprueba si tiene advertencias.',
	category: 'moderation',
	usage: 'warn <usuario> ([?] or <razón>)',
	async execute(client, message, args) {
		if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
			return message.channel.send('No tienes permisos para hacer esto.');
		}
		const warningSet = await Guild.findOne({ _id: message.guild.id });
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
			const usuario = await User.findOne({ _id: user.id });
			if (!usuario) {
				const newWarns = new User({
					_id: user.id,
					userName: user.username,
					warns: [
						{
							_id: message.guild.id,
							warn: 0,
							lastWarn: null,
						},
					],
				});
				newWarns.save().catch((err) => console.error(err));
				const embed = new EmbedBuilder()
					.setColor('#ff0000')
					.setAuthor({
						name: 'Tidewave',
						iconURL: client.user.displayAvatarURL(),
						url: 'https://www.hellhades.tk',
					})
					.setDescription(
						`**Miembro:** ${user} (${user.id})\n**Warns:** 0\n**Ultimo warn:** undefined`,
					)
					.setTimestamp();
				return message.channel.send({ embeds: [embed] });
			}
			else {
				const warn = usuario.warns.find((w) => w._id === message.guild.id);
				if (!warn) {
					usuario.warns.push({
						_id: message.guild.id,
						warn: 0,
						lastWarn: null,
					});
					usuario.save().catch((err) => console.error(err));
				}
				const embed = new EmbedBuilder()
					.setColor('#4697e1')
					.setAuthor({
						name: 'Tidewave',
						iconURL: client.user.displayAvatarURL(),
						url: 'https://www.hellhades.tk',
					})
					.setDescription(
						`**Miembro:** ${user} (${user.id})\n**Warns:** ${warn.warn}\n**Ultimo warn:** ${warn.lastWarn}`,
					)
					.setTimestamp();
				return message.channel.send({ embeds: [embed] });
			}
		}
		// if (user.id === message.author.id) return message.channel.send('No te puedes warnear a ti mismo.');
		if (user.id === client.user.id) return message.channel.send('No puedes warnearme.');
		if (!reason) reason = 'No hay razón provista';
		const usuario = await User.findOne({ _id: user.id });
		if (!usuario) {
			const newUser = new User({
				_id: user.id,
				userName: user.username,
				warns: [
					{
						_id: message.guild.id,
						warn: 1,
						lastWarn: new Date(),
					},
				],
			});
			newUser.save().catch((err) => console.error(err));
			const warnembed = new EmbedBuilder()
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
				const warnembed = new EmbedBuilder()
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
};
