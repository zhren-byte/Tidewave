const { EmbedBuilder, Permissions } = require('discord.js');
const Guild = require('../../models/guild');

module.exports = {
	name: 'settings',
	aliases: ['set'],
	category: 'admin',
	description: 'Configuracion del servidor',
	usage: 'settings [sugerencias, auto, mute, warning, welcome]',
	async execute(client, message, args) {
		if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
			return message.channel.send('No tienes permisos para utilizar este comando');
		}
		const SETTINGS = await Guild.findOne({ _id: message.guild.id },
			async (err, guild) => {
				if (err) console.error(err);
				if (!guild) {
					const newGuild = new Guild({
						_id: message.guild.id,
						guildName: message.guild.name,
						logChannelID: null,
						muteRoleID: null,
						autoRoleID: null,
						botRoleID: null,
						sugestionChannelID: null,
						welcomeChannelID: null,
					});
					await newGuild.save().catch((err) => console.error(err));
				}
			},
		);
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
	const suger = message.guild.channels.cache.get(guildDB.sugestionChannelID);
	const autor = message.guild.roles.cache.get(guildDB.autoRoleID);
	const muter = message.guild.roles.cache.get(guildDB.muteRoleID);
	const botr = message.guild.roles.cache.get(guildDB.botRoleID);
	const warnc = message.guild.channels.cache.get(guildDB.logChannelID);
	const welc = message.guild.channels.cache.get(guildDB.welcomeChannelID);
	const embed = new EmbedBuilder()
		.setColor('#ffffff')
		.setTitle('Tidewave')
		.setThumbnail(client.user.displayAvatarURL())
		.addField(
			'Configuracion disponible:',
			`\`[sugerencias]\` = ${suger}\n\`[auto]\` = ${autor}\n\`[mute]\` = ${muter}\n\`[bot]\` = ${botr}\n\`[warning]\` = ${warnc}\n\`[welcome]\` = ${welc}`,
		)
		.setDescription(`\n**Uso**: ${guildDB.prefix}settings [opcion]`)
		.setFooter({ text: '<> = REQUERIDO | [] = OPCIONAL' });
	message.channel.send({ embeds: [embed] });
}
async function sugerencias(client, message, sugestionSettings, input) {
	const avtTW = client.user.displayAvatarURL();
	if (!input) {
		const embedNone = new EmbedBuilder();
		const suger = message.guild.channels.cache.get(sugestionSettings.sugestionChannelID);
		embedNone
			.setColor('#ffffff')
			.addField('Sugerencias', `${suger}`)
			.setFooter({ text: 'Tidewave', iconURL: avtTW });
		return message.channel.send({ embeds: [embedNone] });
	}
	const channel = message.mentions.channels.first() || message.guild.channels.cache.get(input.toLowerCase());
	await sugestionSettings.updateOne({
		sugestionChannelID: channel.id,
	});
	const embed = new EmbedBuilder()
		.setColor('#ffffff')
		.addField('Sugerencias', `${channel}`)
		.setFooter({ text: 'Tidewave', iconURL: avtTW });
	return message.channel.send({ embeds: [embed] });
}
async function auto(client, message, autoRoleSettings, input) {
	const avtTW = client.user.displayAvatarURL();
	if (!input) {
		const embedNone = new EmbedBuilder();
		const autor = message.guild.roles.cache.get(autoRoleSettings.autoRoleID);
		embedNone
			.setColor('#ffffff')
			.addField('AutoRole', `${autor}`)
			.setFooter({ text: 'Tidewave', iconURL: avtTW });
		return message.channel.send({ embeds: [embedNone] });
	}
	const autoRole = await message.mentions.roles.first() || message.guild.roles.cache.get(input.toLowerCase());
	await autoRoleSettings.updateOne({
		autoRoleID: autoRole.id,
	});
	const autoRoleEmbed = new EmbedBuilder()
		.setColor('#ffffff')
		.addField('Auto Role', `${autoRole}`)
		.setFooter({ text: 'Tidewave', iconURL: avtTW });
	return message.channel.send({ embeds: [autoRoleEmbed] });
}
async function mute(client, message, muteRoleSettings, input) {
	const avtTW = client.user.displayAvatarURL();
	if (!input) {
		const embedNone = new EmbedBuilder();
		const muter = message.guild.roles.cache.get(muteRoleSettings.muteRoleID);
		embedNone
			.setColor('#ffffff')
			.addField('MuteRole', `${muter}`)
			.setFooter({ text: 'Tidewave', iconURL: avtTW });
		return message.channel.send({ embeds: [embedNone] });
	}
	const muteRole = (await message.mentions.roles.first()) || message.guild.roles.cache.get(input.toLowerCase());
	await muteRoleSettings.updateOne({
		muteRoleID: muteRole.id,
	});
	const muteRoleEmbed = new EmbedBuilder()
		.setColor('#ffffff')
		.addField('Mute Role', `${muteRole}`)
		.setFooter({ text: 'Tidewave', iconURL: avtTW });
	return message.channel.send({ embeds: [muteRoleEmbed] });
}
async function bot(client, message, botRoleSettings, input) {
	const avtTW = client.user.displayAvatarURL();
	if (!input) {
		const embedNone = new EmbedBuilder();
		const botr = message.guild.roles.cache.get(botRoleSettings.botRoleID);
		embedNone
			.setColor('#ffffff')
			.addField('BotRole', `${botr}`)
			.setFooter({ text: 'Tidewave', iconURL: avtTW });
		return message.channel.send({ embeds: [embedNone] });
	}
	const botRole = (await message.mentions.roles.first()) || message.guild.roles.cache.get(input.toLowerCase());
	await botRoleSettings.updateOne({
		botRoleID: botRole.id,
	});
	const botRoleEmbed = new EmbedBuilder()
		.setColor('#ffffff')
		.addField('BotRole', `${botRole}`)
		.setFooter({ text: 'Tidewave', iconURL: avtTW });
	return message.channel.send({ embeds: [botRoleEmbed] });
}
async function warning(client, message, warningSet, input) {
	const avtTW = client.user.displayAvatarURL();
	if (!input) {
		const embedNone = new EmbedBuilder();
		const warningc = message.guild.channels.cache.get(warningSet.logChannelID);
		embedNone
			.setColor('#ffffff')
			.addField('Warnings', `${warningc}`)
			.setFooter({ text: 'Tidewave', iconURL: avtTW });
		return message.channel.send({ embeds: [embedNone] });
	}
	const channel = (await message.mentions.channels.first()) || message.guild.channels.cache.get(input.toLowerCase());
	await warningSet.updateOne({
		logChannelID: channel.id,
	});
	const warningChEmbed = new EmbedBuilder()
		.setColor('#ffffff')
		.addField('Warnings', `${channel}`)
		.setFooter({ text: 'Tidewave', iconURL: avtTW });
	return message.channel.send({ embeds: [warningChEmbed] });
}
async function welcome(client, message, welcomeSet, input) {
	const avtTW = client.user.displayAvatarURL();
	if (!input) {
		const embedNone = new EmbedBuilder();
		const welcomec = message.guild.channels.cache.get(
			welcomeSet.welcomeChannelID,
		);
		embedNone
			.setColor('#ffffff')
			.addField('Welcome', `${welcomec}`)
			.setFooter({ text: 'Tidewave', iconURL: avtTW });
		return message.channel.send({ embeds: [embedNone] });
	}
	const channel = (await message.mentions.channels.first()) || message.guild.channels.cache.get(input);
	await welcomeSet.updateOne({
		welcomeChannelID: channel.id,
	});
	const welcomeChEmbed = new EmbedBuilder()
		.setColor('#ffffff')
		.addField('Welcome', `${channel}`)
		.setFooter({ text: 'Tidewave', iconURL: avtTW });
	return message.channel.send({ embeds: [welcomeChEmbed] });
}
