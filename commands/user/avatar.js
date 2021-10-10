const { MessageEmbed } = require('discord.js');
module.exports = {
name: "avatar",
aliases: [],
category: "usersCommands",
description: "Command description",
usage: "[args input]",
async execute (client, message, args) {
	let user = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;
	const AvatarEmbed = new MessageEmbed()
		.setImage(user.avatarURL({ dynamic: true , size: 2048 , format: "png" }))
		.setColor(0x66b3ff)
		.setFooter(`Avatar de ${user.tag}`)
	if (user) return message.reply({ embeds: [AvatarEmbed] });
    }
}