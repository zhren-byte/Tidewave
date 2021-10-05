const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('Muestra informacion del servidor'),
	async execute(interaction) {
		return interaction.reply(`Nombre: ${interaction.guild.name}\nMiembros: ${interaction.guild.memberCount}`);
	},
};