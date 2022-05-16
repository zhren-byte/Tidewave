const { MessageAttachment, MessageEmbed } = require('discord.js');
const { createCanvas, loadImage, registerFont } = require('canvas');
const Guild = require('../models/guild');
let x = 0;
module.exports = {
	name: 'guildMemberAdd',
	on: true,
	async execute(client, member) {
		const welcomeSet = await Guild.findOne({
			_id: member.guild.id,
		});
		const autoRoleBot = welcomeSet.botRoleID;
		const logChannel = client.channels.cache.get(welcomeSet.logChannelID) || undefined;
		const errembed = new MessageEmbed()
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
		(x++ % 3) + 1;
		registerFont('./assets/seagram.ttf', { family: 'Seagram' });
		registerFont('./assets/dalgona.ttf', { family: 'Dalgona' });
		const autoRole = welcomeSet.autoRoleID;
		member.roles.add(autoRole)
			.catch(() => {
				if (!logChannel) return;
				logChannel.send({ embeds: [errembed] });
			});
		const applyText = (canvas, text) => {
			const ctx = canvas.getContext('2d');
			let fontSize = 76;
			do {
				ctx.font = `${(fontSize -= 10)}px Seagram`;
			} while (ctx.measureText(text).width > canvas.width - 300);
			return ctx.font;
		};
		// context
		const canvas = createCanvas(973, 475);
		const ctx = canvas.getContext('2d');
		let background;
		if (x === 1) {
			background = await loadImage('assets/imagen1.jpg');
		}
		else if (x === 2) {
			background = await loadImage('assets/imagen1.jpg');
		}
		else {
			background = await loadImage('assets/imagen1.jpg');
		}
		ctx.globalAlpha = 1.0;
		ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
		ctx.strokeStyle = '#000000';
		ctx.strokeRect(0, 0, canvas.width, canvas.height);
		// textName
		ctx.textAlign = 'center';
		ctx.font = '74px Dalgona';
		ctx.fillStyle = '#ffffff';
		ctx.fillText('Bienvenido', canvas.width / 2, canvas.height / 1.45);
		ctx.strokeStyle = '#000000';
		ctx.strokeText('Bienvenido', canvas.width / 2, canvas.height / 1.45);
		// text
		ctx.font = applyText(canvas, `${member.displayName}!`);
		ctx.fillStyle = '#ffffff';
		ctx.fillText(
			`${member.displayName}`,
			canvas.width / 2,
			canvas.height / 1.17,
		);
		ctx.strokeStyle = '#000000';
		ctx.strokeText(
			`${member.displayName}`,
			canvas.width / 2,
			canvas.height / 1.17,
		);
		// textServer
		ctx.font = '40px Seagram';
		ctx.fillStyle = '#ffffff';
		ctx.fillText(
			`sos el miembro ${member.guild.memberCount}th`,
			canvas.width / 2,
			canvas.height / 1.05,
		);
		ctx.strokeStyle = '#000000';
		ctx.strokeText(
			`sos el miembro ${member.guild.memberCount}th`,
			canvas.width / 2,
			canvas.height / 1.05,
		);
		// iconMember
		ctx.beginPath();
		ctx.arc(486, 150, 125, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.clip();
		const avatar = await loadImage(
			member.user.displayAvatarURL({ format: 'jpg' }),
		);
		ctx.drawImage(avatar, 362, 25, 250, 250);
		const attachment = new MessageAttachment(
			canvas.toBuffer(),
			'welcome-image.png',
		);
		channel.send({
			content: `Bienvenido al servidor, ${member}!`,
			files: [attachment],
		});
	},
};
