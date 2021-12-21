const { MessageEmbed, Permissions } = require("discord.js");
const mongoose = require("mongoose");
const Guild = require("../../models/guild");
const User = require("../../models/user");
module.exports = {
  name: "warn",
  aliases: ["w", "adv"],
  description: "Advierte al usuario por su comportamiento",
  category: "moderation",
  async execute(client, message, args) {
    if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD))
      return message.channel.send("No tienes permisos para hacer esto.");
    warningSet = await Guild.findOne({ _id: message.guild.id });
    let channel =
      client.channels.cache.get(warningSet.logChannelID) || message.channel;
    let ids = args[0];
    let user =
      (await message.mentions.users.first()) ||
      message.guild.members.cache.get(ids);
    let mod = message.author.username;
    let reason = args.slice(1).join(" ");
    if (!user) return message.channel.send("Mencione un usuario.");
    if (user.id === message.author.id)
      return message.channel.send("No te puedes banear a ti mismo.");
    if (user.id === client.user.id)
      return message.channel.send("No puedes banearme.");
    if (!reason) reason = "No hay razón provista";
    warnSet = await User.findOne(
      {
        guildID: message.guild.id,
        userID: user.id,
      },
      (err, usuario) => {
        if (err) console.error(err);
        if (!usuario) {
          const newUser = new User({
            _id: mongoose.Types.ObjectId(),
            guildID: message.guild.id,
            userID: user.id,
            userName: user.username,
            warns: 1,
          });
          newUser.save().catch((err) => console.error(err));
          const warnembed = new MessageEmbed()
            .setColor("#ff0000")
            .setAuthor(`Tidewave`, client.user.avatarURL())
            .setDescription(
              `**Miembro:** ${user} (${user.id})\n**Accion:** Warn\n**Razon:** ${reason}\n**Warns:** 1\n**Moderador:** ${mod}`
            )
            .setTimestamp();
          return channel.send({ embeds: [warnembed] });
        } else {
          usuario
            .updateOne({
              warns: usuario.warns + 1,
            })
            .catch((err) => console.error(err));
          const warnembed = new MessageEmbed()
            .setColor("#ff0000")
            .setAuthor(`Tidewave`, client.user.avatarURL())
            .setDescription(
              `**Miembro:** ${user} (${
                user.id
              })\n**Accion:** Warn\n**Razon:** ${reason}\n**Warns:** ${
                usuario.warns + 1
              }\n**Moderador:** ${mod}`
            )
            .setTimestamp();
          return channel.send({ embeds: [warnembed] });
        }
      }
    );
  },
};
