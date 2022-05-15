const { Permissions } = require('discord.js');
module.exports = {
	name: 'join',
	category: 'admin',
	description: 'Emite una entrada al servidor, para probar el mensaje de welcome',
	usage: '>join',
	async execute(client, message) {
		message.delete();
		if (!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return;
		client.emit('guildMemberAdd', message.member);
	},
};
