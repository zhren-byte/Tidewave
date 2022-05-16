const { Permissions } = require('discord.js');
module.exports = {
	name: 'purge',
	aliases: ['clear', 'nuke'],
	category: 'moderation',
	description: 'Limpia una cantidad finita de mensajes',
	usage: 'purge <cantidad>',
	async execute(client, message, args) {
		if (message.deletable) {
			message.delete();
		}
		if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
			return message
				.reply('No puedo borrar mensajes, panflin.')
				.then((m) => m.delete(5000));
		}
		if (isNaN(args[0]) || parseInt(args[0]) <= 0) {
			return message.reply('Ese valor es invalido').then((m) => m.delete(5000));
		}
		let deleteAmount;
		if (parseInt(args[0]) > 100) {
			deleteAmount = 100;
		}
		else {
			deleteAmount = parseInt(args[0]);
		}
		message.channel
			.bulkDelete(deleteAmount, true)
			.then((deleted) => {
				message.channel
					.send(`Acabo de borrar \`${deleted.size}\` mensajes.`);
			})
			.catch((err) => {
				message
					.reply(`Hubo alto error amigo. ${err}`)
					.then((msg) => msg.delete({ timeout: 5000 }));
			});
	},
};
