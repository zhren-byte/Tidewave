const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config()
const { Client, Collection, Intents } = require('discord.js');
const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_BANS,
		Intents.FLAGS.GUILD_INVITES,
		Intents.FLAGS.GUILD_VOICE_STATES
	]
})
//Handler Interactions
client.interactions = new Collection();
const interactionFiles = fs.readdirSync('./interactions').filter(file => file.endsWith('.js'));
for (const file of interactionFiles) {
	const interactionn = require(`./interactions/${file}`);
	client.interactions.set(interactionn.data.name, interactionn);
}
//Handler Commands
client.commands  = new Collection();
client.aliases = new Collection();
["command"].forEach(handler => {
	require(`./handler/${handler}`)(client);
});
//Events
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;
	const command = client.interactions.get(interaction.commandName);
	if (!command) return;
	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		return interaction.reply({ content: 'Ocurrio un error al ejecutar el comando', ephemeral: true });
	}
});

client.on('messageCreate', async (message) => {
	if(!message.guild) return;
	let prefix = '>'
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	if (!message.member) message.member = await message.guild.fetchMember(message)
	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const cmd = args.shift().toLowerCase();
	if(cmd.length === 0)return;
	let commando = client.commands.get(cmd);
	if(!commando) commando = client.commands.get(client.aliases.get(cmd));
	try {
		await commando.execute(client, message, args);
	} catch (error) {
		console.error(error);
		return message.reply({ content: 'Ocurrio un error al ejecutar el comando', ephemeral: true });
	}
});

client.login(process.env.TOKEN)