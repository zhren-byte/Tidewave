const { MessageEmbed, Permissions } = require("discord.js");
const mongoose = require("mongoose");
const Guild = require("../../models/guild");
const dotenv = require("dotenv");
dotenv.config();
module.exports = {
  name: "server-info",
  category: "moderation",
  description: "Informacion del servidor.",
  usage: `server-info`,
  async execute(client, message, args) {
    message.delete();
    const serverSettings = await Guild.findOne(
      {
        _id: message.guild.id,
      },
      (err, guild) => {
        if (err) console.error(err);
        if (!guild) {
          const newGuild = new Guild({
            _id: message.guild.id,
            guildName: message.guild.name,
            prefix: process.env.PREFIX,
          });
          newGuild.save().catch((err) => console.error(err));
          return message.channel
            .send(
              "Este servidor no esta en la base de datos, vuelve a intentarlo"
            )
            .then((m) => m.delete({ timeout: 10000 }));
        }
      }
    );
    let avtTW = client.user.avatarURL();
    let icon = message.guild.iconURL() || client.user.avatarURL();
    let srvname = message.guild.name || "Tidewave";
    let prefix = serverSettings.prefix;
    let log = message.guild.channels.cache.get(serverSettings.logChannelID);
    let welcome = message.guild.channels.cache.get(
      serverSettings.welcomeChannelID
    );
    let sugestion = message.guild.channels.cache.get(
      serverSettings.sugestionChannelID
    );
    let muteRole = message.guild.roles.cache.get(serverSettings.muteRoleID);
    let autoRole = message.guild.roles.cache.get(serverSettings.autoRoleID);
    let botRole = message.guild.roles.cache.get(serverSettings.botRoleID);
    if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) return;
    const ServedEmbed = new MessageEmbed()
      .setColor("#ffffff")
      .setTitle(srvname)
      .setThumbnail(icon)
      .addField("Prefix", `${prefix}`)
      .setDescription(`Miembros: ${message.guild.memberCount}`)
      .addFields(
        { name: "Logs", value: `${log}`, inline: true },
        { name: "Welcome", value: `${welcome}`, inline: true },
        { name: "Sugerencias", value: `${sugestion}`, inline: true }
      )
      .addFields(
        { name: "Mute", value: `${muteRole}`, inline: true },
        { name: "Auto", value: `${autoRole}`, inline: true },
        { name: "Bot", value: `${botRole}`, inline: true }
      )
      .setFooter("Tidewave", avtTW);
    return message.channel.send({ embeds: [ServedEmbed] });
  },
};
