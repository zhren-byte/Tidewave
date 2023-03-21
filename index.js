const path = require('path');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');
const crypto = require('crypto');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const multer = require('multer');
app.use(session({
	key: 'session_cookie_name',
	secret: 'session_cookie_secret',
	store: new MySQLStore({
		host:'localhost',
		port:3306,
		user:'root',
		database:'cookie_user',
	}),
	resave: false,
	saveUninitialized: false,
	cookie:{
		maxAge:1000 * 60 * 60 * 24,

	},
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true,
}));
app.use(express.static('public'));
app.set('view engine', 'ejs');
const conn = mysql.createConnection({
	host: `186.22.246.15`,
	port: `3306`,
	user: `zhren`,
	password: `777zhren777`,
	database: 'tidewave',
	multipleStatements: true,
});
conn.connect((err) => {
	if (err) {
		return console.log('Evento: MySQL Coneccion Fallida');
	}
	return console.log('Evento: MySQL Conectado');
});
const customFields = {
	usernameField:'uname',
	passwordField:'pw',
};
const verifyCallback = (username, password, done) => {
	conn.query('SELECT * FROM usuarios WHERE username = ? ', [username], function(error, results) {
		if (error) return done(error);
		if (results.length == 0) return done(null, false);
		const isValid = validPassword(password, results[0].hash, results[0].salt);
		const user = { id:results[0].id, username:results[0].username, hash:results[0].hash, salt:results[0].salt };
		if (isValid) {
			return done(null, user);
		}
		else {
			return done(null, false);
		}
	});
};

const strategy = new LocalStrategy(customFields, verifyCallback);

passport.use(strategy);
passport.serializeUser((user, done) => { done(null, user.id); });
passport.deserializeUser(function(userId, done) {
	conn.query('SELECT * FROM usuarios WHERE id = ?', [userId], function(error, results) {
		done(null, results[0]);
	});
});

function validPassword(password, hash, salt) {
	const hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 60, 'sha512').toString('hex');
	return hash === hashVerify;
}

function genPassword(password) {
	const salt = crypto.randomBytes(32).toString('hex');
	const genhash = crypto.pbkdf2Sync(password, salt, 10000, 60, 'sha512').toString('hex');
	return { salt:salt, hash:genhash };
}

function isAuth(req, res, next) {
	if (req.isAuthenticated()) {
		next();
	}
	else {
		res.redirect('/notAuthorized');
	}
}

function isAdmin(req, res, next) {
	if (!req.isAuthenticated() && req.user.isAdmin > 0) {
		return res.redirect('/');
	}
	next();
}

function userExists(req, res, next) {
	conn.query('SELECT * FROM usuarios WHERE username = ? ', [req.body.uname], function(err, results) {
		if (err) return console.log('Error');
		// if (results.length > 0) return res.redirect('/userAlreadyExists');
		if (results.length > 0) return res.redirect('/auth/');
		next();
	});
}
app.use(function(req, res, next) {
	res.locals.title = 'Hades';
	res.locals.user = req.user ? req.user.username : undefined;
	next();
});
app.get('/', function(req, res) {
	res.render('index.ejs');
});
app.get('/auth/', function(req, res) {
	res.render('auth/index.ejs', {
		title : 'Bienvenido a Hades',
	});
});
app.post('/auth/signup', userExists, (req, res) => {
	const saltHash = genPassword(req.body.pw);
	const salt = saltHash.salt;
	const hash = saltHash.hash;
	conn.query('INSERT INTO usuarios(username,hash,salt,isAdmin) VALUES (?,?,?,0) ', [req.body.uname, hash, salt], function(err) {
		if (err) return console.log('Error');
	});
	res.redirect('/auth/');
});
app.post('/auth/login', passport.authenticate('local', { failureRedirect:'/auth/', successRedirect:'/' }));

app.get('/auth/logout', (req, res, next) => {
	req.logout(function(err) {
		if (err) { return next(err); }
		res.redirect('/');
	});
});

app.get('/profile', isAuth, (req, res) => {
	res.render('profile.ejs', {
		title : 'Profile',
		image: req.user.profile ? req.user.profile : 'image',
		rank: req.user.isAdmin == 1 ? 'Ayudante' : (req.user.isAdmin == 2 ? 'Moderador' : (req.user.isAdmin == 3 ? 'Administrador' : 'Usuario')),
	});
});

const upload = multer({
	dest: path.join(__dirname, './public/uploads/'),
});

app.post('/upload', upload.single('fileToUpload'), (req, res) => {
	if (!req.file) {
		return res.redirect('/profile');
	}
	const tempPath = req.file.path;
	const targetPath = path.join(__dirname, `./public/uploads/${req.file.filename}.png`);
	if (path.extname(req.file.originalname).toLowerCase() != '.png') {
		return fs.unlink(tempPath, err => {
			if (err) return console.log(err);
			res.redirect('/profile');
		});
	}
	fs.rename(tempPath, targetPath, err => {
		if (err) return console.log(err);
		conn.query('UPDATE usuarios SET profile = ? WHERE username = ?', [`${req.file.filename}`, req.user.username], function(err) {
			if (err) return console.log(err);
		});
		return res.redirect('/profile');
	});
});

app.get('/admin-route', isAdmin, (req, res) => {
	res.send('<h1>You are admin</h1><p><a href="/logout">Logout and reload</a></p>');
});

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
