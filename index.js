const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config()
const { Client, Collection, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
//Handler
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const ascii = require("ascii-table");
let table = new ascii("Comandos");
table.setHeading("Comando", "Estado", "Categoria");

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

client.once('ready', () => {
	console.log(`Logeado ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;
	const command = client.commands.get(interaction.commandName);
	if (!command) return;
	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		return interaction.reply({ content: 'Ocurrio un error al ejecutar el comando', ephemeral: true });
	}
});

client.login(process.env.TOKEN)