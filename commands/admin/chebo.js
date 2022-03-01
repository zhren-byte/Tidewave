const { Permissions } = require("discord.js");
const mysql = require("mysql");
const conn = mysql.createConnection({
  host: `${process.env.DB_HOST}`,
  port: `${process.env.DB_PORT}`,
  user: `${process.env.DB_USER}`,
  password: `${process.env.DB_PASS}`,
  database: "sugerencias",
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
	conn.connect(function (err) {
	if (err) {
		console.log("Base de datos no disponible");
		console.log(err);
	} else {
    console.log(`- Se envio una nueva propuesta desde -> ${message.member.user.tag}`);
	}
	});
    let contenido = args.slice(0).join(" ");
    let date = message.createdAt
      .toISOString()
      .replace(/T/, " ")
      .replace(/\..+/, "");
    conn.query(
      `INSERT INTO sugerencia (dname, sugerencia, fecha) VALUES ('${message.member.user.tag}','${contenido}', '${date}')`,
      (message, err) => {
        if (err) console.log(err);
      }
    );
    message.author.send(
      `${message.member.user.tag}: Tu mensaje se envio correctamente, gracias por tu ayuda`
    );
  },
};
