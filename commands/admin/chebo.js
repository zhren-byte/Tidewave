const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const mysql = require('mysql');
const conn = mysql.createConnection({
	host: `${process.env.DB_HOST}`,
	port: `${process.env.DB_PORT}`,
	user: `${process.env.DB_USER}`,
	password: `${process.env.DB_PASS}`,
	database: 'tidewave',
});
module.exports = {
	name: 'chebo',
	category: 'admin',
	description:
    'Envia una sugerencia, error, o arreglo hacia los creadores de este humilde bot',
	usage: '>chebo [sugerencia, error, arreglo]',
	async execute(client, message, args) {
		if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return;
		const contenidOne = args.slice(0).join(' ');
		const contenido = args
			.slice(0)
			.join(' ')
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&apos;');
		const date = message.createdAt
			.toISOString()
			.replace(/T/, ' ')
			.replace(/\..+/, '');
		conn.query('SELECT count(*) AS count FROM sugerencias', (err, results) => {
			if (err) console.log(err);
			const id = results[0].count;
			conn.query(
				`INSERT INTO sugerencias (id, dname, sugerencia, fecha) VALUES ('${
					id + 1
				}', '${message.member.user.tag}','${contenido}', '${date}')`,
				(third, err) => {
					if (err) console.log(err);
					const chebembed = new EmbedBuilder()
						.setColor('#00ff00')
						.setAuthor({
							name: 'Tidewave',
							iconURL: client.user.displayAvatarURL(),
							url: 'https://hellhades.tk',
						})
						.setDescription(
							`**Miembro:** ${message.author} (${message.author.id})\n **Mensaje:** ${contenidOne}\n **Conclusion:** Tu mensaje se envio correctamente, gracias por tu ayuda.`,
						)
						.setTimestamp();
					message.channel.send({ embeds: [chebembed] });
					console.log(
						`- Se envio una nueva propuesta desde -> ${message.member.user.tag}`,
					);
				},
			);
		});
	},
};
