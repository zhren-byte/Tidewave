const { MessageEmbed, Permissions } = require("discord.js");
const Guild = require("../../models/guild");
module.exports = {
  name: "kick",
  aliases: ["expulsar", "patear", "k"],
  category: "moderation",
  description:
    "Expulsa de la comunidad yacente a aquel que haya perturbado su armonía como un pelotudo",
  async execute(client, message, args) {
    if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD))
      return message.channel.send("No tienes permisos para hacer esto.");
    warningSet = await Guild.findOne({ _id: message.guild.id });
    let channel =
      client.channels.cache.get(warningSet.logChannelID) || message.channel;
    let user =
      message.mentions.users.first() ||
      message.guild.members.cache.get(args[0]);
    let mod = message.author.username;
    let reason = args.slice(1).join(" ");
    if (!user) return message.channel.send("Mencione un usuario.");
    if (user.id === message.author.id)
      return message.channel.send("No te puedes expulsar a ti mismo.");
    if (user.id === client.user.id)
      return message.channel.send("No puedes expulsarme.");
    if (!reason) reason = "No hay razón provista";
    message.guild.members
      .kick(user, [reason])
      .then(() => {
        const kickembed = new MessageEmbed()
          .setColor("#ff0000")
          .setAuthor({ name: 'Tidewave', iconURL: client.user.displayAvatarURL(), url: 'https://exithades.tk' })
          .setDescription(
            `**Miembro:** ${user} (${user.id})\n **Accion:** Kick\n**Razon:** ${reason}\n **Moderador:** ${mod}`
          )
          .setTimestamp();
        channel.send({ embeds: [kickembed] });
      })
      .catch((err) => {
        message.reply("No he podido kickear al miembro");
      });
  },
};
