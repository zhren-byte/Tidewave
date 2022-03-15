const { MessageEmbed, Permissions } = require("discord.js");
const Guild = require("../../models/guild");
const mongoose = require("mongoose");

module.exports = {
  name: "sugestionchannel",
  aliases: ["suggestionChannel"],
  category: "admin",
  description:
    "Selecciona el canal donde se enviaran los mensajes de sugerencias",
  usage: `sugestionChannel <#channel, channelID>`,
  async execute(client, message, args) {
    message.delete();
    if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD))
      return message.channel.send(
        "No tienes permisos para utilizar este comando"
      );
    const channel =
      (await message.mentions.channels.first()) ||
      message.guild.channels.cache.get(args[0]);
    sugestionSettings = await Guild.findOne(
      {
        _id: message.guild.id,
      },
      async (err, guild) => {
        if (err) console.error(err);
        if (!guild) {
          const newGuild = new Guild({
            _id: message.guild.id,
            guildName: message.guild.name,
            sugestionChannelID: channel.id,
          });
          await newGuild.save().catch((err) => console.error(err));
        }
      }
    );
    let avtTW = client.user.displayAvatarURL();
    let icon = message.guild.iconURL() || client.user.avatarURL();
    let sugestionChFetch = message.guild.channels.cache.get(
      sugestionSettings.sugestionChannelID
    );
    const sugestionChFetchEmbed = new MessageEmbed()
      .setColor("#ffffff")
      .setThumbnail(icon)
      .addField("Sugerencias", `${sugestionChFetch}`)
      .setFooter({ text: 'Tidewave', iconURL: avtTW });
    if (!channel)
      return message.channel.send({ embeds: [sugestionChFetchEmbed] });
    await sugestionSettings.updateOne({
      sugestionChannelID: channel.id,
    });
    const sugestionChEmbed = new MessageEmbed()
      .setColor("#ffffff")
      .setThumbnail(icon)
      .addField("Sugerencias", `${channel}`)
      .setFooter({ text: 'Tidewave', iconURL: avtTW });
    return message.channel.send({ embeds: [sugestionChEmbed] });
  },
};
