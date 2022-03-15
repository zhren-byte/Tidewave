const { Permissions } = require("discord.js");
module.exports = {
  name: "join",
  aliases: [],
  category: "adminHades",
  description: "Command description",
  usage: "[args input]",
  async execute(client, message, args) {
    message.delete();
    if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) return;
    client.emit("guildMemberAdd", message.member);
  },
};
