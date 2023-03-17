const Guild = require('../models/guild');

module.exports = {
	name: 'guildDelete',
	on: true,
	async execute(guild) {
		Guild.findOneAndDelete({ _id: guild.id });
	},
};