const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('avatar')
		.setDescription('Obtener el avatar de un usuario')
		.addUserOption(option => option.setName('avatar').setDescription('El usuario\'s avatar a mostrar')),
	async execute(interaction) {
		const user = interaction.options.getUser('avatar') || interaction.user;
		const AvatarEmbed = new MessageEmbed()
			.setImage(user.avatarURL({ dynamic: true, size: 2048, format: 'png' }))
			.setColor(0x66b3ff)
			.setFooter({ text: `Avatar de ${user.tag}` });
		if (user) return interaction.reply({ embeds: [AvatarEmbed] });
	},
};
