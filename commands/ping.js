const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Dale pa si ya sabes'),
	async execute(interaction) {
		return interaction.reply('Pong!');
	},
};