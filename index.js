const path = require('path');
// const bcrypt = require('bcryptjs');
const mysql = require('mysql');
const conn = mysql.createConnection({
	host: `${process.env.DB_HOST}`,
	port: `${process.env.DB_PORT}`,
	user: `${process.env.DB_USER}`,
	password: `${process.env.DB_PASS}`,
	database: 'tidewave',
});
conn.connect(function(err) {
	if (err) {
		console.error('Error connecting to MySQL: ' + err.stack);
		return;
	}
	console.log('connected as id ' + conn.threadId);
});
const express = require('express');
const app = express();
app.use(express.urlencoded({
	extended: true,
}));
app.get('/', function(req, res) {
	res.render('index.ejs', {
		title : 'Hades',
	});
});
app.get('/auth/', function(req, res) {
	res.render('auth/index.ejs', {
		title : 'Bienvenido a Hades',
	});
});
app.post('/auth/signup', function(req, res) {
	conn.query(`SELECT COUNT(*) FROM usuarios WHERE user = '${req.body.userL}'`, (err, results) => {
		if (err) console.log(err);
		console.log(results);
		const id = results[0].count;
		if (id === 0) {
			conn.query(`INSERT INTO sugerencias (user, password) VALUES ('${req.body.userL}','${req.body.userL}')`,
				(third, err) => {
					if (err) console.log(err);
					res.send(`
						Usuario: ${third.user} \n 
						Contraseña: ${third.password}
					`);
				},
			);
		}
		else {
			res.send(`
				Usuario: Ya existe
			`);
		}
	});
	// bcrypt.hash(req.body.passwordS, 5, (err, newPass) => {
	// 	if (err) {
	// 		res.send(`
	// 			Usuario: ${req.body.userS} \n
	// 			Contraseña: ${req.body.passwordS}
	// 		`);
	// 	}
	// 	else {
	// 		res.send(`
	// 			Usuario: ${req.body.userS} \n
	// 			Contraseña: ${newPass}
	// 		`);
	// 	}
	// });
});
app.post('/auth/login', function(req, res) {
	conn.query(`SELECT COUNT(*) FROM usuarios WHERE user = ${req.body.userL} AND password = ${req.body.userL}`, (err, results) => {
		if (err) console.log(err);
		const id = results[0].count;
		if (id > 0) {
			conn.query(`SELECT user, password FROM usuarios WHERE user = ${req.body.userL} AND password = ${req.body.userL}`,
				(third, err) => {
					if (err) console.log(err);
					res.send(`
						Usuario: ${third.user} \n 
						Contraseña: ${third.password}
					`);
				},
			);
		}
	});
	// const hash = '';
	// bcrypt.compare(req.body.passwordL, hash, (err, coinciden) => {
	// 	if (err) {
	// 		res.send(`
	// 			Usuario: ${req.body.userL} \n
	// 			Contraseña: ${req.body.passwordL}
	// 			Coinciden: ${coinciden},
	// 		`);
	// 	}
	// 	else {
	// 		res.send(`
	// 			Usuario: ${req.body.userL} \n
	// 			Contraseña: ${req.body.passwordL},
	// 			Coinciden: ${coinciden},
	// 		`);
	// 	}
	// });
});
// app.route('/book')
// 	.get(function(req, res) {
// 		res.send('Get a random book');
// 	})
// 	.post(function(req, res) {
// 		res.send('Add a book');
// 	})
// 	.put(function(req, res) {
// 		res.send('Update the book');
// 	});
app.use(express.static(path.join(__dirname, 'public')));
const fs = require('fs');
const ms = require('ms');
const usersMap = new Map();
const LIMIT = 4;
const TIME = '5m';
const DIFF = 2000;
const { Client, Collection, EmbedBuilder, GatewayIntentBits	 } = require('discord.js');
const client = new Client({ 	intents: [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.MessageContent,
	GatewayIntentBits.GuildMembers,
] });
// mongoose
client.mongoose = require('./utils/mongoose');
const Guild = require('./models/guild');
const User = require('./models/user');
client.commands = new Collection();
client.aliases = new Collection();
client.categories = fs.readdirSync('./commands/');
['command'].forEach((handler) => {
	require(`./handler/${handler}`)(client);
});
// Events
const eventFiles = fs
	.readdirSync('./events')
	.filter((file) => file.endsWith('.js'));
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	console.log(`Evento: '${event.name}'`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	}
	else {
		client.on(event.name, (...args) => event.execute(client, ...args));
	}
}

client.on('interactionCreate', async (interaction) => {
	if (!interaction.isCommand()) return;
	const command = client.interactions.get(interaction.commandName);
	if (!command) return;
	try {
		await command.execute(interaction);
	}
	catch (error) {
		return interaction.reply({
			content: 'Ocurrio un error al ejecutar el comando',
			ephemeral: true,
		});
	}
});

client.on('messageCreate', async (message) => {
	if (!message.guild) return;
	if (message.author.bot) return;
	if (usersMap.has(message.author.id)) {
		const userData = usersMap.get(message.author.id);
		const { lastMessage, timer } = userData;
		const difference = message.createdTimestamp - lastMessage.createdTimestamp;
		let msgCount = userData.msgCount;
		if (difference > DIFF) {
			clearTimeout(timer);
			userData.msgCount = 1;
			userData.lastMessage = message;
			userData.timer = setTimeout(() => {
				usersMap.delete(message.author.id);
			}, ms(TIME));
			usersMap.set(message.author.id, userData);
		}
		else {
			++msgCount;
			if (parseInt(msgCount) === LIMIT) {
				const warningSet = await Guild.findOne({ _id: message.guild.id });
				const channel = client.channels.cache.get(warningSet.logChannelID) || message.channel;
				const role = await message.guild.roles.fetch(warningSet.muteRoleID);
				message.member.roles
					.add(role)
					.then(() => {
						const muted = new EmbedBuilder()
							.setColor('#ff0000')
							.setAuthor({ name: 'Tidewave', iconURL: client.user.displayAvatarURL(), url: 'https://hellhades.tk' })
							.setDescription(
								`**Miembro:** ${message.author} (${
									message.author.id
								})\n **Accion:** Auto-Mute\n**Duracion:** ${ms(
									ms(TIME),
								)}\n **Moderador:** Tidewave`,
							)
							.setTimestamp();
						channel.send({ embeds: [muted] });
					})
					.catch((err) => {
						const muted = new EmbedBuilder()
							.setColor('#ff0000')
							.setAuthor({ name: 'Tidewave', iconURL: client.user.displayAvatarURL(), url: 'https://hellhades.tk' })
							.setDescription(
								`**Error:** Auto-Mute\n**Duracion:** ${err}\n **Moderador:** Tidewave`,
							)
							.setTimestamp();
						channel.send({ embeds: [muted] });
					});
				setTimeout(() => {
					message.member.roles.remove(role);
					const unmuted = new EmbedBuilder()
						.setColor('#00ff00')
						.setAuthor({ name: 'Tidewave', iconURL: client.user.displayAvatarURL(), url: 'https://hellhades.tk' })
						.setDescription(
							`**Miembro:** ${message.author} (${message.author.id})\n **Accion:** Un-Mute\n **Moderador:** Tidewave`,
						)
						.setTimestamp();
					channel.send({ embeds: [unmuted] });
				}, ms(TIME));
			}
			else {
				userData.msgCount = msgCount;
				usersMap.set(message.author.id, userData);
			}
		}
	}
	else {
		const fn = setTimeout(() => {
			usersMap.delete(message.author.id);
		}, ms(TIME));
		usersMap.set(message.author.id, {
			msgCount: 1,
			lastMessage: message,
			timer: fn,
		});
	}
	const settings = await Guild.findOne({ _id: message.guild.id }, 'prefix');
	if (!settings) {
		const newGuild = new Guild({
			_id: message.guild.id,
			guildName: message.guild.name,
			prefix: '>',
		});
		await newGuild.save().catch((err) => console.error(err));
	}
	const usuarios = await User.findOne({ _id: message.author.id }, 'warns');
	if (!usuarios.warns) {
		const newWarns = new User({
			_id: message.author.id,
			userName: message.author.username,
			warns: [
				{
					_id: message.guild.id,
					warn: 0,
					lastWarn: null,
				},
			],
		});
		newWarns.save().catch((err) => console.error(err));
	}
	else {
		const warns = usuarios.warns.find((w) => w._id === message.guild.id);
		if (!warns) {
			usuarios.warns.push({
				_id: message.guild.id,
				warn: 0,
				lastWarn: null,
			});
			usuarios.save().catch((err) => console.error(err));
		}
	}
	const prefix = settings.prefix || process.env.PREFIX;
	if (!message.content.startsWith(prefix)) return;
	if (!message.member) {message.member = await message.guild.fetchMember(message);}
	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const cmd = args.shift().toLowerCase();
	if (cmd.length === 0) return;
	let commando = client.commands.get(cmd);
	if (!commando) commando = client.commands.get(client.aliases.get(cmd));
	try {
		await commando.execute(client, message, args);
	}
	catch (error) {
		return message.reply({
			content: 'El comando ejecutado no es correcto o esta en mantenimiento',
			ephemeral: true,
		});
	}
});

app.listen(3030, () => {
	client.mongoose.init();
	client.login(process.env.TOKEN);
});
