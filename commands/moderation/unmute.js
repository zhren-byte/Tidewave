const Discord = require("discord.js");
module.exports = {
  name: "unmute",
  description: "lo demutea al wachin muteado",
  category: "moderation",
  run: async (client, message, args) => {
    if (!message.member.hasPermission("ADMINISTRATOR"))
      return message.channel.send("No tienes permisos para hacer esto.");
    let member = message.mentions.members.first();
    let role = message.guild.roles.cache.find(
      (r) => r.id == "691040456758394941"
    );
    member.roles.remove(role).catch(console.error);
    const channel = client.channels.cache.get("675585949983440897");
    const embed = new Discord.MessageEmbed()
      .setColor("#ff0000")
      .setAuthor({ name: 'Tidewave', iconURL: client.user.displayAvatarURL(), url: 'https://exithades.tk' })
      .setDescription(
        `**Miembro:** ${member} (${member.id})\n **Accion:** Un-Mute\n **Moderador:** ${message.author.username}`
      )
      .setTimestamp();
    channel.send(embed);
  },
};
