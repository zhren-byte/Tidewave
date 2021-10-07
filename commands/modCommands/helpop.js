const { MessageEmbed } = require('discord.js');
module.exports = {
name: "helpop",
aliases: [],
category: "modCommands",
description: "Command description",
usage: "[args input]",
async execute(client, message){
	const embed = new MessageEmbed()
	.setColor('#0099ff')
	.setAuthor(`O'Connor`, client.user.avatarURL({ dynamic: true , size: 2048 , format: "png" }))
	.addFields(
		{ name: 'prefix <newPrefix>', value: 'Cambia el prefix del bot en tu servidor'},
		{ name: 'say <things>', value: 'Da al bot algo para decir' },
		{ name: 'helpop', value: 'Ver todos los comandos de administrador'}
	)
	.addField('\u200b', `Usa \`helpop\` o \`@${client.user.tag} helpop\` para ver todos los comandos especiales.\n\n`);
	message.channel.send({ embeds: [embed] });
	}
}