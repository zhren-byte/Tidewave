module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		let prefixReady = '>'
		console.log(`Logeado ${client.user.tag}!`);
		client.user.setPresence({ activities: [{
			name: `${client.guilds.cache.size} Servidores`,
			type: "WATCHING"
		}] });
	},
};