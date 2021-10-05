const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user-info')
		.setDescription('Muestra informacion tuya'),
	async execute(interaction) {
		return interaction.reply(`Username: ${interaction.user.username}\nID: ${interaction.user.id}`);
	},
};