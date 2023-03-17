const { Permissions, EmbedBuilder } = require('discord.js');
module.exports = {
	name: 'ping',
	category: 'admin',
	description: 'Command description',
	usage: 'Devuelve el ping (ms) del bot',
	async execute(client, message) {
		message.delete();
		if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) return message.channel.send('No tienes permisos para hacer esto.');
		const pingEmbed = new EmbedBuilder()
			.setColor('#ffffff')
			.setTitle('Pong!')
			.setDescription(`${client.ws.ping}ms`)
			.setFooter({ text: 'Tidewave', iconURL: client.user.displayAvatarURL() });
		return message.channel.send({ embeds: [pingEmbed] });
		// const channel = client.channels.cache.get("622624908995723285");
		// const embed = new EmbedBuilder()
		//   .setColor("#ff0000")
		//   .setAuthor({ name: 'Tidewave', iconURL: client.user.displayAvatarURL(), url: 'https://hellhades.tk' })
		//   .setDescription(
		//     `**Miembro:** ${
		//       message.author
		//     }\n **Accion:** Auto-Mute\n **Moderador:** Tidewave\n **Fecha:** ${message.createdAt.toLocaleString()} `
		//   );
		// channel.send(message.createdAt.toISOString().replace(/T/, ' ').replace(/\..+/, ''));
	},
};
