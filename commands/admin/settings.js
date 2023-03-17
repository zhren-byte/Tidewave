const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const Guild = require('../../models/guild');
const undefinedText = 'Ningun canal seleccionado';
module.exports = {
	name: 'settings',
	aliases: ['set'],
	category: 'admin',
	description: 'Configuracion del servidor',
	usage: 'settings [sugerencias, auto, mute, warning, welcome]',
	async execute(client, message, args) {
		if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
			return message.channel.send('No tienes permisos para utilizar este comando');
		}
		const SETTINGS = await Guild.findOne({ _id: message.guild.id });
		if (!SETTINGS) {
			const newGuild = new Guild({
				_id: message.guild.id,
				guildName: message.guild.name,
				prefix: '>',
				logChannelID: null,
				muteRoleID: null,
				autoRoleID: null,
				botRoleID: null,
				sugestionChannelID: null,
				welcomeChannelID: null,
			});
			await newGuild.save().catch((err) => console.error(err));
		}
		switch (args[0]) {
		case 'sugerencias':
			return sugerencias(client, message, SETTINGS, args[1]);
		case 'auto':
			return auto(client, message, SETTINGS, args[1]);
		case 'mute':
			return mute(client, message, SETTINGS, args[1]);
		case 'bot':
			return bot(client, message, SETTINGS, args[1]);
		case 'warning':
			return warning(client, message, SETTINGS, args[1]);
		case 'welcome':
			return welcome(client, message, SETTINGS, args[1]);
		default:
			return serverInfo(client, message, SETTINGS);
		}
	},
};

async function serverInfo(client, message, guildDB) {
	const embed = new EmbedBuilder()
		.setColor('#ffffff')
		.setTitle('Tidewave')
		.setThumbnail(client.user.displayAvatarURL())
		.addFields([{
			name: 'Configuracion disponible:',
			value: `\`[sugerencias]\` = ${message.guild.channels.cache.get(guildDB.sugestionChannelID) || undefinedText }\n\`[auto]\` = ${message.guild.roles.cache.get(guildDB.autoRoleID) || undefinedText }\n\`[mute]\` = ${message.guild.roles.cache.get(guildDB.muteRoleID) || undefinedText }\n\`[bot]\` = ${message.guild.roles.cache.get(guildDB.botRoleID) || undefinedText }\n\`[warning]\` = ${message.guild.channels.cache.get(guildDB.logChannelID) || undefinedText }\n\`[welcome]\` = ${message.guild.channels.cache.get(guildDB.welcomeChannelID) || undefinedText }`,
		}])
		.setDescription(`\n**Uso**: ${guildDB.prefix}settings [opcion]`)
		.setFooter({ text: '<> = REQUERIDO | [] = OPCIONAL' });
	message.channel.send({ embeds: [embed] });
}
async function sugerencias(client, message, sugestionSettings, input) {
	const avtTW = client.user.displayAvatarURL();
	if (!input) {
		const embedNone = new EmbedBuilder()
			.setColor('#ffffff')
			.addFields({ name: 'Sugerencias', value: `${message.guild.channels.cache.get(sugestionSettings.sugestionChannelID) || undefinedText}` })
			.setFooter({ text: 'Tidewave', iconURL: avtTW });
		return message.channel.send({ embeds: [embedNone] });
	}
	const channel = message.mentions.channels.first() || message.guild.channels.cache.get(input.toLowerCase());
	await sugestionSettings.updateOne({
		sugestionChannelID: channel.id,
	});
	const embed = new EmbedBuilder()
		.setColor('#ffffff')
		.addFields({ name: 'Sugerencias', value: `${channel}` })
		.setFooter({ text: 'Tidewave', iconURL: avtTW });
	return message.channel.send({ embeds: [embed] });
}
async function auto(client, message, autoRoleSettings, input) {
	const avtTW = client.user.displayAvatarURL();
	if (!input) {
		const embedNone = new EmbedBuilder()
			.setColor('#ffffff')
			.addFields({ name: 'AutoRole', value: `${message.guild.roles.cache.get(autoRoleSettings.autoRoleID) || undefinedText}` })
			.setFooter({ text: 'Tidewave', iconURL: avtTW });
		return message.channel.send({ embeds: [embedNone] });
	}
	const autoRole = await message.mentions.roles.first() || message.guild.roles.cache.get(input.toLowerCase());
	await autoRoleSettings.updateOne({
		autoRoleID: autoRole.id,
	});
	const autoRoleEmbed = new EmbedBuilder()
		.setColor('#ffffff')
		.addFields({ name: 'Auto Role', value: `${autoRole}` })
		.setFooter({ text: 'Tidewave', iconURL: avtTW });
	return message.channel.send({ embeds: [autoRoleEmbed] });
}
async function mute(client, message, muteRoleSettings, input) {
	const avtTW = client.user.displayAvatarURL();
	if (!input) {
		const embedNone = new EmbedBuilder()
			.setColor('#ffffff')
			.addFields({ name: 'MuteRole', value: `${message.guild.roles.cache.get(muteRoleSettings.muteRoleID) || undefinedText}` })
			.setFooter({ text: 'Tidewave', iconURL: avtTW });
		return message.channel.send({ embeds: [embedNone] });
	}
	const muteRole = (await message.mentions.roles.first()) || message.guild.roles.cache.get(input.toLowerCase());
	await muteRoleSettings.updateOne({
		muteRoleID: muteRole.id,
	});
	const muteRoleEmbed = new EmbedBuilder()
		.setColor('#ffffff')
		.addFields({ name: 'Mute Role', value:`${muteRole}` })
		.setFooter({ text: 'Tidewave', iconURL: avtTW });
	return message.channel.send({ embeds: [muteRoleEmbed] });
}
async function bot(client, message, botRoleSettings, input) {
	const avtTW = client.user.displayAvatarURL();
	if (!input) {
		const embedNone = new EmbedBuilder()
			.setColor('#ffffff')
			.addFields({ name: 'BotRole', value: `${message.guild.roles.cache.get(botRoleSettings.botRoleID) || undefinedText}` })
			.setFooter({ text: 'Tidewave', iconURL: avtTW });
		return message.channel.send({ embeds: [embedNone] });
	}
	const botRole = (await message.mentions.roles.first()) || message.guild.roles.cache.get(input.toLowerCase());
	await botRoleSettings.updateOne({
		botRoleID: botRole.id,
	});
	const botRoleEmbed = new EmbedBuilder()
		.setColor('#ffffff')
		.addFields({ name: 'BotRole', value: `${botRole}` })
		.setFooter({ text: 'Tidewave', iconURL: avtTW });
	return message.channel.send({ embeds: [botRoleEmbed] });
}
async function warning(client, message, warningSet, input) {
	const avtTW = client.user.displayAvatarURL();
	if (!input) {
		const embedNone = new EmbedBuilder()
			.setColor('#ffffff')
			.addFields({ name: 'Warnings', value: `${message.guild.channels.cache.get(warningSet.logChannelID) || undefinedText}` })
			.setFooter({ text: 'Tidewave', iconURL: avtTW });
		return message.channel.send({ embeds: [embedNone] });
	}
	const channel = (await message.mentions.channels.first()) || message.guild.channels.cache.get(input.toLowerCase());
	await warningSet.updateOne({
		logChannelID: channel.id,
	});
	const warningChEmbed = new EmbedBuilder()
		.setColor('#ffffff')
		.addFields({ name: 'Warnings', value: `${channel}` })
		.setFooter({ text: 'Tidewave', iconURL: avtTW });
	return message.channel.send({ embeds: [warningChEmbed] });
}
async function welcome(client, message, welcomeSet, input) {
	const avtTW = client.user.displayAvatarURL();
	if (!input) {
		const embedNone = new EmbedBuilder()
			.setColor('#ffffff')
			.addFields({ name: 'Welcome', value: `${message.guild.channels.cache.get(welcomeSet.welcomeChannelID)}` })
			.setFooter({ text: 'Tidewave', iconURL: avtTW });
		return message.channel.send({ embeds: [embedNone] });
	}
	const channel = (await message.mentions.channels.first()) || message.guild.channels.cache.get(input);
	if (!channel) {
		return message.channel.send('Canal no encontrado');
	}
	await welcomeSet.updateOne({
		welcomeChannelID: channel.id,
	});
	const welcomeChEmbed = new EmbedBuilder()
		.setColor('#ffffff')
		.addFields({ name: 'Welcome', value: `${channel}` })
		.setFooter({ text: 'Tidewave', iconURL: avtTW });
	return message.channel.send({ embeds: [welcomeChEmbed] });
}
