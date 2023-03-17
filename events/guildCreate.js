const Guild = require('../models/guild');
module.exports = {
	name: 'guildCreate',
	on: true,
	async execute(guild) {
		const guildExist = await Guild.findOne({ _id: guild.id });
		if (!guildExist) {
			const newGuild = new Guild({
				_id: guild.id,
				guildName: guild.name,
				prefix: process.env.PREFIX,
				logChannelID: null,
				muteRoleID: null,
				autoRoleID: null,
				botRoleID: null,
				sugestionChannelID: null,
				welcomeChannelID: null,
			});
			newGuild.save().catch((err) => console.error(err));
		}
	},
};
