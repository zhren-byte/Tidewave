const { Permissions } = require("discord.js");
const mysql = require("mysql");
const conn = mysql.createConnection({
  host: `${process.env.DB_HOST}`,
  port: `${process.env.DB_PORT}`,
  user: `${process.env.DB_USER}`,
  password: `${process.env.DB_PASS}`,
  database: "sugerencias",
});
conn.connect(function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log(`- Conectado a 'sugerencias' -`);
  }
});
module.exports = {
  name: "chebo",
  aliases: [],
  category: "admin",
  description:
    "Envia una sugerencia, error, o arreglo hacia los creadores de este humilde bot",
  usage: ">chebo [sugerencia, error, arreglo]",
  async execute(client, message, args) {
    if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) return;
    let contenido = args.slice(1).join(" ");
    conn.query(
      `INSERT INTO sugerencia (dname, sugerencia) VALUES ('${message.member.user.tag}','${contenido}')`,
      (message, err) => {
        if (err) console.log(err);
      }
    );
    message.author.send(
      `${message.member.user.tag}: Tu mensaje se envio correctamente, gracias por tu ayuda`
    );
  },
};
