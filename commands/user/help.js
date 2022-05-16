const { MessageEmbed } = require('discord.js');
const Guild = require('../../models/guild');
module.exports = {
	name: 'help',
	category: 'user',
	description: 'Muestra el mensaje de ayuda',
	usage: 'help [commandName]',
	async execute(client, message, args) {
		await Guild.findOne(
			{
				_id: message.guild.id,
			},
			(err, guild) => {
				if (err) console.error(err);
				if (!guild) {
					const newGuild = new Guild({
						_id: message.guild.id,
						guildName: message.guild.name,
						prefix: process.env.PREFIX,
						logChannelID: null,
					});
					newGuild.save().catch((err) => console.error(err));
				}
			},
		);

		if (args[0]) {
			return getCMD(client, message, args[0]);
		}
		else {
			return helpMSG(client, message);
		}
	},
};
async function helpMSG(client, message) {
	const guildDB = await Guild.findOne({ _id: message.guild.id });
	const embed = new MessageEmbed()
		.setColor('#ffffff')
		.setTitle('Tidewave')
		.setThumbnail(client.user.displayAvatarURL())
		.setDescription(
			`Para ver la lista completa de comandos: \`${guildDB.prefix}commands\` \n\n`,
		)
		.addField(
			'Links',
			'[Discord](https://discord.gg/rUADwcj4kf)\n[Pagina Web](https://hellhades.tk)',
		)
		.setFooter({ text: 'Creado por Zhren#5164' });
	message.channel.send({ embeds: [embed] });
}
async function getCMD(client, message, input) {
	const guildDB = await Guild.findOne({ _id: message.guild.id });
	const embed = new MessageEmbed();
	const cmd =
    client.commands.get(input.toLowerCase()) ||
    client.commands.get(client.aliases.get(input.toLowerCase()));
	let info = `No hay informacion para **${input.toLowerCase()}**`;
	if (!cmd) {
		embed
			.setColor('#ff0000')
			.setDescription(info);
		return message.channel.send({ embeds: [embed] });
	}
	if (cmd.name) info = `**Comando**: ${cmd.name}`;
	if (cmd.aliases) info += `\n**Alias**: \`${cmd.aliases.join(', ')}\``;
	if (cmd.description) info += `\n**Descripcion**: ${cmd.description}`;
	if (cmd.usage) {
		info += `\n**Uso**: ${guildDB.prefix}${cmd.usage}`;

		embed
			.setFooter({ text: '<> = REQUERIDO | [] = OPCIONAL' });
	}
	if (cmd.usage2) info += `\n**Segundo uso**: ${guildDB.prefix}${cmd.usage2}`;
	embed
		.setColor(process.env.COLOR)
		.setDescription(info)
		.setFooter({ text: 'Tidewave', iconURL: client.user.displayAvatarURL() });
	return message.channel.send({ embeds: [embed] });
}
