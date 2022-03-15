const { MessageEmbed, Permissions } = require("discord.js");
const mongoose = require("mongoose");
const Guild = require("../../models/guild");
const User = require("../../models/user");
module.exports = {
  name: "unwarn",
  aliases: ["unw", "unadv"],
  description: "Saca un warn o mas a un usuario",
  category: "moderation",
  async execute(client, message, args) {
    if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD))
      return message.channel.send("No tienes permisos para hacer esto.");
    warningSet = await Guild.findOne({ _id: message.guild.id });
    let channel =
      client.channels.cache.get(warningSet.logChannelID) || message.channel;
    let user =
      (await message.guild.members.cache.get(args[0])) ||
      message.mentions.users.first();
    let mod = message.author.username;
    let number = parseInt(args[1]);
    let reason = args.slice(2).join(" ");
    if (!number) {
      reason = args.slice(1).join(" ");
      number = 1;
    }
    if (!user) return message.channel.send("Mencione un usuario.");
    if (user.id === message.author.id)
      return message.channel.send("No te puedes unwarnear a ti mismo.");
    if (user.id === client.user.id)
      return message.channel.send("No puedes unwarnearme.");
    if (!reason) reason = "No hay razón provista";
    warnSet = await User.findOne(
      {
        guildID: message.guild.id,
        userID: user.id,
      },
      (err, usuario) => {
        if (err) console.error(err);
        const warnembed = new MessageEmbed()
          .setColor("#4697e1")
          .setAuthor({ name: 'Tidewave', iconURL: client.user.displayAvatarURL(), url: 'https://exithades.tk' })
          .setDescription(
            `**Miembro:** ${user} (${
              user.id
            })\n**Accion:** UnWarn\n**Razon:** ${reason}\n**Warns:** ${
              usuario.warns - number
            }\n**Moderador:** ${mod}`
          )
          .setTimestamp();
        if (!usuario) {
          const newUser = new User({
            _id: mongoose.Types.ObjectId(),
            guildID: message.guild.id,
            userID: user.id,
            userName: user.username,
            warns: 0,
          });
          newUser.save().catch((err) => console.error(err));
          return channel.send({ embeds: [warnembed] });
        } else {
          usuario
            .updateOne({
              warns: usuario.warns - number,
            })
            .catch((err) => console.error(err));
          return channel.send({ embeds: [warnembed] });
        }
      }
    );
  },
};
