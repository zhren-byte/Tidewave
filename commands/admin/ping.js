const {MessageEmbed} = require("discord.js");
module.exports = {
  name: "ping",
  aliases: [],
  category: "admin",
  description: "Command description",
  usage: "[args input]",
  async execute(client, message, args) {
    const channel = client.channels.cache.get("622624908995723285");
    // const embed = new MessageEmbed()
    //   .setColor("#ff0000")
    //   .setAuthor(`O'Connor`, client.user.avatarURL())
    //   .setDescription(
    //     `**Miembro:** ${
    //       message.author
    //     }\n **Accion:** Auto-Mute\n **Moderador:** O'Connor\n **Fecha:** ${message.createdAt.toLocaleString()} `
    //   );
    channel.send(message.createdAt.toISOString().replace(/T/, ' ').replace(/\..+/, ''));
  },
};
