const { AttachmentBuilder, EmbedBuilder } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');
const Guild = require('../models/guild');
// let x = 0;
module.exports = {
	name: 'guildMemberAdd',
	on: true,
	async execute(client, member) {
		const welcomeSet = await Guild.findOne({ _id: member.guild.id });
		const autoRoleBot = welcomeSet.botRoleID;
		const logChannel = client.channels.cache.get(welcomeSet.logChannelID) || undefined;
		const errembed = new EmbedBuilder()
			.setColor('#ff0000')
			.setAuthor({ name: 'Tidewave', iconURL: client.user.displayAvatarURL(), url: 'https://hellhades.tk' })
			.setDescription(
				`**Miembro:** ${member.user.tag} (${member.id})\n **Error:** No le pude dar rango`,
			)
			.setTimestamp();
		if (member.user.bot) {
			member.roles.add(autoRoleBot)
				.catch(() => {
					if (!logChannel) return;
					logChannel.send({ embeds: [errembed] });
				});
		}
		const channel = client.channels.cache.get(welcomeSet.welcomeChannelID);
		if (!channel) return;
		// (x++ % 3) + 1;
		const autoRole = welcomeSet.autoRoleID;
		member.roles.add(autoRole)
			.catch(() => {
				if (!logChannel) return;
				logChannel.send({ embeds: [errembed] });
			});
		const applyText = (canvas, text) => {
			const ctx = canvas.getContext('2d');
			let fontSize = 56;
			do {
				ctx.font = `${(fontSize -= 10)}px Compose`;
			} while (ctx.measureText(text).width > canvas.width - 300);
			return ctx.font;
		};
		// context
		const canvas = createCanvas(873, 245);
		const ctx = canvas.getContext('2d');
		const background = await loadImage('assets/imagen1.jpg');
		// if (x === 1) {
		// 	background = await loadImage('assets/imagen1.jpg');
		// }
		// else if (x === 2) {
		// 	background = await loadImage('assets/imagen1.jpg');
		// }
		// else {
		// 	background = await loadImage('assets/imagen1.jpg');
		// }
		ctx.globalAlpha = 1.0;
		ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
		ctx.strokeStyle = '#000000';
		ctx.strokeRect(0, 0, canvas.width, canvas.height);
		// textName
		ctx.textAlign = 'center';
		ctx.font = '72px Compose';
		ctx.fillStyle = '#ffffff';
		ctx.fillText('BIENVENIDO', canvas.width / 1.6, canvas.height / 2.6);
		ctx.strokeStyle = '#000000';
		ctx.strokeText('BIENVENIDO', canvas.width / 1.6, canvas.height / 2.6);
		// text
		ctx.font = applyText(canvas, `${member.user.tag.toUpperCase()}!`);
		ctx.fillStyle = '#ffffff';
		ctx.fillText(
			`${member.user.tag.toUpperCase()}`,
			canvas.width / 1.6,
			canvas.height / 1.7,
		);
		ctx.strokeStyle = '#000000';
		ctx.strokeText(
			`${member.user.tag.toUpperCase()}`,
			canvas.width / 1.6,
			canvas.height / 1.7,
		);
		// textServer
		ctx.font = '42px Compose';
		ctx.fillStyle = '#ffffff';
		ctx.fillText(
			`sos el miembro ${member.guild.memberCount}th`.toUpperCase(),
			canvas.width / 1.6,
			canvas.height / 1.3,
		);
		ctx.strokeStyle = '#000000';
		ctx.strokeText(
			`sos el miembro ${member.guild.memberCount}th`.toUpperCase(),
			canvas.width / 1.6,
			canvas.height / 1.3,
		);
		// iconMember
		const avatar = await loadImage(member.user.displayAvatarURL({ dynamic: 'true', extension: 'png' }));
		ctx.drawImage(avatar, 27, 27, 191, 191);
		const attachment = new AttachmentBuilder(
			canvas.toBuffer(),
			'welcome-image.png',
		);
		channel.send({
			content: `Bienvenido al servidor, ${member}!`,
			files: [attachment],
		});
	},
};
