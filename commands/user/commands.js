const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const Guild = require("../../models/guild");
module.exports = {
  name: "commands",
  aliases: ["comandos"],
  category: "user",
  description: "Muestra la lista completa de comandos",
  usage: `commands`,
  async execute(client, message, args) {
    await Guild.findOne(
      {
        _id: message.guild.id,
      },
      (err, guild) => {
        if (err) console.error(err);
        if (!guild) {
          const newGuild = new Guild({
            _id: message.guild.id,
            guildName: message.guild.name,
            prefix: ">",
          });
          newGuild.save().catch((err) => console.error(err));
        }
      }
    );
    return getAll(client, message);
  },
};
async function getAll(client, message) {
  const guildDB = await Guild.findOne({
    _id: message.guild.id,
  });
  const embed = new MessageEmbed()
    .setColor(process.env.COLOR)
    .setTitle("Comandos")
    .setThumbnail(client.user.avatarURL());
  const commands = (category) => {
    return client.commands
      .filter((cmd) => cmd.category === category)
      .map((cmd) => `- \`${guildDB.prefix + cmd.name}\``)
      .join("\n");
  };
  const info = client.categories
    .map(
      (cat) =>
        stripIndents`**${cat[0].toLowerCase() + cat.slice(1)}** \n${commands(
          cat
        )}`
    )
    .reduce((string, category) => `${string}\n${category}`);
  embed.setDescription(
    "Usa `" +
      `${guildDB.prefix}help <commandName>\` para ver mas informacion hacer de un comando especifico.\n\n${info}`
  );
  return message.channel.send({ embeds: [embed] });
}
