const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('Selecciona un usuario para kickear')
		.addUserOption(option => option.setName('usuario').setDescription('Usuario a kickear')),
	async execute(interaction, client) {
		const channel = client.channels.fetch('891140400021131294')
		let user = interaction.options.getUser('usuario');
		let reason = args.slice(1).join(" ");
		if (!user) return interaction.reply("Menciona al usuario.")
        if (user.id === message.author.id) return interaction.reply("No te puedes expulsar a ti mismo.")
        if (user.id === client.user.id) return interaction.reply("No puedes expulsarme.")
		if (!reason) reason = "No hay razón provista."
		user.kick(reason).then(() => {
			const embed = new Discord.MessageEmbed()
				.setColor('#ff0000')
				.setAuthor(`O'Connor`, client.user.avatarURL())
				.setDescription(`**Miembro:** ${member} (${member.id})\n **Accion:** Kick\n**Razon:** ${reason}\n **Moderador:** ${message.author.username}`)
				.setTimestamp()
			channel.send(embed)
		}).catch(err => {
			interaction.reply("No he podido expulsar al miembro.")
		})
	},
};