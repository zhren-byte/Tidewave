const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('purge')
		.setDescription('Borra hasta 100 mensajes')
		.addIntegerOption(option => option.setName('cantidad').setDescription('Numero de mensajes a borrar')),
	async execute(interaction) {
		const amount = interaction.options.getInteger('cantidad');

		if (amount <= 1 || amount > 100) {
			return interaction.reply({ content: 'Tienes que poner un numero del 1-99', ephemeral: true });
		}
		await interaction.channel.bulkDelete(amount, true).catch(error => {
			console.error(error);
			interaction.reply({ content: 'Ocurrio un error al intentar borrar los mensajes!', ephemeral: true });
		});

		return interaction.reply({ content: `Correctamente eliminados: \`${amount}\` mensajes.`, ephemeral: true });
	},
};