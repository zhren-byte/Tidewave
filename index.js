const fs = require("fs");
const ms = require("ms");
const usersMap = new Map();
const LIMIT = 4;
const TIME = "5m";
const DIFF = 2000;
const { Client, Collection, Intents, MessageEmbed } = require("discord.js");
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_BANS,
    Intents.FLAGS.GUILD_INVITES,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
});
//mongoose
const mongoose = require("mongoose");
client.mongoose = require("./utils/mongoose");
const Guild = require("./models/guild");
const User = require("./models/user");
//Handler Interactions
client.interactions = new Collection();
const interactionFiles = fs
  .readdirSync("./interactions")
  .filter((file) => file.endsWith(".js"));
for (const file of interactionFiles) {
  const interactionn = require(`./interactions/${file}`);
  client.interactions.set(interactionn.data.name, interactionn);
}
//Handler Commands
client.commands = new Collection();
client.aliases = new Collection();
client.categories = fs.readdirSync("./commands/");
["command"].forEach((handler) => {
  require(`./handler/${handler}`)(client);
});
//Events
const eventFiles = fs
  .readdirSync("./events")
  .filter((file) => file.endsWith(".js"));
for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  console.log(`Evento: '${event.name}'`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(client, ...args));
  }
}

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;
  const command = client.interactions.get(interaction.commandName);
  if (!command) return;
  try {
    await command.execute(interaction);
  } catch (error) {
    return interaction.reply({
      content: "Ocurrio un error al ejecutar el comando",
      ephemeral: true,
    });
  }
});

client.on("messageCreate", async (message) => {
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
    } else {
      ++msgCount;
      if (parseInt(msgCount) === LIMIT) {
        warningSet = await Guild.findOne({ _id: message.guild.id });
        let channel =
          client.channels.cache.get(warningSet.logChannelID) || message.channel;
        const role = message.guild.roles.cache.get("781918621386670091");
        message.member.roles.add(role);
        const muted = new MessageEmbed()
          .setColor("#ff0000")
          .setAuthor(`Tidewave`, client.user.avatarURL())
          .setDescription(
            `**Miembro:** ${message.author} (${
              message.author.id
            })\n **Accion:** Auto-Mute\n**Duracion:** ${ms(
              ms(TIME)
            )}\n **Moderador:** Tidewave`
          )
          .setTimestamp();
        channel.send({ embeds: [muted] });
        setTimeout(() => {
          message.member.roles.remove(role);
          const unmuted = new MessageEmbed()
            .setColor("#00ff00")
            .setAuthor(`Tidewave`, client.user.avatarURL())
            .setDescription(
              `**Miembro:** ${message.author} (${message.author.id})\n **Accion:** Un-Mute\n **Moderador:** Tidewave`
            )
            .setTimestamp();
          channel.send({ embeds: [unmuted] });
        }, ms(TIME));
      } else {
        userData.msgCount = msgCount;
        usersMap.set(message.author.id, userData);
      }
    }
  } else {
    let fn = setTimeout(() => {
      usersMap.delete(message.author.id);
    }, ms(TIME));
    usersMap.set(message.author.id, {
      msgCount: 1,
      lastMessage: message,
      timer: fn,
    });
  }
  const settings = await Guild.findOne(
    { _id: message.guild.id },
    (err, guild) => {
      if (err) console.error(err);
      if (!guild) {
        const newGuild = new Guild({
          _id: message.guild.id,
          guildName: message.guild.name,
          prefix: process.env.PREFIX,
        });
        newGuild.save().catch((err) => console.error(err));
      }
    }
  );
  const userSet = await User.findOne(
    {
      userID: message.author.id,
      guildID: message.guild.id,
    },
    (err, user) => {
      if (err) console.error(err);
      if (!user) {
        const newUser = new User({
          _id: mongoose.Types.ObjectId(),
          guildID: message.guild.id,
          userID: message.author.id,
          userName: message.author.username,
          warns: 0,
        });
        newUser.save().catch((err) => console.error(err));
      }
    }
  );
  let prefix = settings.prefix || process.env.PREFIX;
  if (!message.content.startsWith(prefix)) return;
  if (!message.member)
    message.member = await message.guild.fetchMember(message);
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();
  if (cmd.length === 0) return;
  let commando = client.commands.get(cmd);
  if (!commando) commando = client.commands.get(client.aliases.get(cmd));
  try {
    await commando.execute(client, message, args);
  } catch (error) {
    return message.reply({
      content: "El comando ejecutado no es correcto",
      ephemeral: true,
    });
  }
});

client.mongoose.init();
client.login(process.env.TOKEN);
