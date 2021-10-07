const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId } = require('./config.json');
const token = process.env.TOKEN;
//Handler
const ascii = require("ascii-table");
let table = new ascii("Comandos");
const commands = [];
const commandFiles = fs.readdirSync('./interactions').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./interactions/${file}`);
	commands.push(command.data.toJSON());
	if (command.name) {
		table.addRow(file);
	} else {
		table.addRow(file);
		continue;
	}
	if (command.aliases && Array.isArray(command.aliases)) command.aliases.forEach(alias => clientId.aliases.set(alias, command.name));
}

const rest = new REST({ version: '9' }).setToken(token);
rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log(table.toString()))
	.catch(console.error);