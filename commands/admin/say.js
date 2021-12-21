module.exports = {
  name: "say",
  category: "admin",
  description: "Envia un mensaje al canal",
  usage: `say <mensaje>`,
  async execute(client, message, args) {
    if (!message.member.hasPermission("ADMINISTRATOR"))
      return message.channel
        .send("No tienes permisos para utilizar este comando")
        .then((m) => m.delete({ timeout: 5000 }));
    const channel = message.mentions.channels.first();
    let as = args.slice(1).join(" ");
    if (!channel) return message.channel.send("Especifica el canal");
    if (!as) return message.channel.send("Especifica lo que quieres decir");
    channel.send(as);
  },
};
