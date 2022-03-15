const { MessageEmbed, Permissions } = require("discord.js");
const Guild = require("../../models/guild");
const mongoose = require("mongoose");

module.exports = {
  name: "welcome",
  category: "admin",
  description:
    "Selecciona el canal donde se enviaran los mensajes de bienvenidas",
  usage: `welcome <#channel, channelID>`,
  async execute(client, message, args) {
    message.delete();
    if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD))
      return message.channel.send(
        "No tienes permisos para utilizar este comando"
      );
    const channel =
      (await message.mentions.channels.first()) ||
      message.guild.channels.cache.get(args[0]);
    welcomeSet = await Guild.findOne(
      {
        _id: message.guild.id,
      },
      async (err, guild) => {
        if (err) console.error(err);
        if (!guild) {
          const newGuild = new Guild({
            _id: message.guild.id,
            guildName: message.guild.name,
            welcomeChannelID: channel.id,
          });
          await newGuild.save().catch((err) => console.error(err));
        }
      }
    );
    let avtTW = client.user.displayAvatarURL();
    let icon = message.guild.iconURL() || client.user.avatarURL();
    let welcomeChFetch = message.guild.channels.cache.get(
      welcomeSet.welcomeChannelID
    );
    const welcomeChFetchEmbed = new MessageEmbed()
      .setColor("#ffffff")
      .setThumbnail(icon)
      .addField("Welcome", `${welcomeChFetch}`)
      .setFooter({ text: 'Tidewave', iconURL: avtTW });
    if (!channel)
      return message.channel.send({ embeds: [welcomeChFetchEmbed] });
    await welcomeSet.updateOne({
      welcomeChannelID: channel.id,
    });
    const welcomeChEmbed = new MessageEmbed()
      .setColor("#ffffff")
      .setThumbnail(icon)
      .addField("Welcome", `${channel}`)
      .setFooter({ text: 'Tidewave', iconURL: avtTW });
    return message.channel.send({ embeds: [welcomeChEmbed] });
  },
};
