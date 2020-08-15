/*
░█▀▀█ ░█▀▀█ ─█▀▀█ ░█▀▀▀█ ░█─░█    ░█▀▀█ ░█▀▀▀ ░█▀▀█ ░█▀▀▀█ ░█▀▀█ ▀▀█▀▀ ░█▀▀▀ ░█▀▀█ 
░█─── ░█▄▄▀ ░█▄▄█ ─▀▀▀▄▄ ░█▀▀█ ▀▀ ░█▄▄▀ ░█▀▀▀ ░█▄▄█ ░█──░█ ░█▄▄▀ ─░█── ░█▀▀▀ ░█▄▄▀ 
░█▄▄█ ░█─░█ ░█─░█ ░█▄▄▄█ ░█─░█    ░█─░█ ░█▄▄▄ ░█─── ░█▄▄▄█ ░█─░█ ─░█── ░█▄▄▄ ░█─░█
*/

const Reporter = require("@toelf/crash-reporter");
process.on("uncaughtException", (exception) => {
    let currentError = new Reporter(exception);
    currentError.createReport(true);
});

/*
░█▀▄▀█ ░█──░█ ░█▀▀▀█ ░█▀▀█ ░█─── 
░█░█░█ ░█▄▄▄█ ─▀▀▀▄▄ ░█─░█ ░█─── 
░█──░█ ──░█── ░█▄▄▄█ ─▀▀█▄ ░█▄▄█
*/
const mysql = require('mysql');
/*const DBconnection = mysql.createConnection({
    host: 'localhost',
    user: 'admin',
    password: 'sq1fA)gq',
    database: 'UltraDB'
});*/
const DBconnection = mysql.createConnection({
    host: '51.79.85.74',
    user: 'admin',
    password: 'sq1fA)gq',
    database: 'test',
    insecureAuth: false
});

DBconnection.connect();

DBconnection.query("CREATE TABLE IF NOT EXISTS listaUsuarios( historial TEXT, coins SMALLINT, id TEXT NOT NULL, icon TEXT NOT NULL, nombre TEXT NOT NULL )")
DBconnection.query("CREATE TABLE IF NOT EXISTS listaPedidos( estado TEXT NOT NULL, ordenId INT NOT NULL, userId TEXT NOT NULL, serverId TEXT NOT NULL, prioridad TINYINT NOT NULL, total SMALLINT NOT NULL, contador SMALLINT, miembros TEXT, invitacion VARCHAR(16), mensaje VARCHAR(300), PRIMARY KEY (ordenId) )")

DBconnection.on("error", (err) => {
    throw err;
});

/*
░█▀▀▄ ▀█▀ ░█▀▀▀█ ░█▀▀█ ░█▀▀▀█ ░█▀▀█ ░█▀▀▄ 　 ░█▀▀█ ░█▀▀▀█ ▀▀█▀▀ 
░█─░█ ░█─ ─▀▀▀▄▄ ░█─── ░█──░█ ░█▄▄▀ ░█─░█ 　 ░█▀▀▄ ░█──░█ ─░█── 
░█▄▄▀ ▄█▄ ░█▄▄▄█ ░█▄▄█ ░█▄▄▄█ ░█─░█ ░█▄▄▀ 　 ░█▄▄█ ░█▄▄▄█ ─░█──
*/
const fs = require("fs");
const util = require("./utils/util")
const Discord = require("discord.js");
const client = new Discord.Client({
    fetchAllMembers: true,
    messageCacheMaxSize: 1000
});
/**
 * Lista de comandos que usara el bot.
 * @type {Map<String, { on: Boolean, valid: Boolean, su: Boolean, version: String, run(message: Message, args: String[], client: Client, utils: util, database: DBconnection): Boolean }>} Map con la lista de comandos.
 */
client.commands = util.commandValidator(fs.readdirSync("commands/"));
/**
 * Prefijo para los comandos de el bot.
 * @type {String}
 */
client.prefix = "u!";
/**
 * Lista de IDs de superusuarios dentro del bot.
 * @type {String[]}
 */
client.su = ["656982590028513320", "522197129465167938"];

client.on("ready", () => {
    /**
     * Usuario actual del bot
     */
    let user = client.user;
    //Escribe en la consola el usuario actual junto a su id
    console.log(`El bot inicio con el nombre de ${user.tag} y con la id ${user.id}`);

    /**
     * Objeto apto para motrarlo mediante un console table.
     */
    let commandsTable = util.commandTableGenerator(client.commands);
    //Muestra todos los comandos en consola.
    console.table(commandsTable);

    /**
     * Array con los estados que usara el bot.
     * @type {String[]}
     */
    let estados = ["Escribe u!hola para empezar a usarme", "Unete al servidor de soporte discord.gg/FYcVCZN"];
    /**
     * Cuenta en que pocision del array de estados va.
     * @type {Number}
     */
    let contador = 0;
    /**
     * Intervalo de tiempo que se espera entre cada cambio de estado
     */
    let intervalo = 300000;

    //actualiza el estado del bot por primera vez para no esperar el interval.
    client.user.setPresence({
        status: "online",
        activity: {
            name: estados[contador],
            type: "PLAYING"
        }
    });
    //Sumamos 1 al contador para cuando se ejecute el interval
    contador++;

    setInterval(() => {
        //Comprueba si el contador es mas grande que el array para restablecer el contador.
        if (estados.length <= contador) {
            contador = 0;
        };
        //actualiza el estado del bot.
        client.user.setPresence({
            status: "online",
            activity: {
                name: estados[contador],
                type: "PLAYING"
            }
        });
        //suma 1 al contador.
        contador++;
    }, intervalo);

});

client.on("message", (message) => {
    /**
     * Argumentos que utiliza el comando.
     * @type {String[]}
     */
    const args = message.content.slice(client.prefix.length).trim().split(/ +/g);
    /**
     * El comando. Esto sirve para utilizar como clave en algun MAP o de nombre de propiedad en un Object para obtener el comando.
     */
    const command = args.shift().toLowerCase();

    /**
     * Comando deserealizado y listo para usar en caso de ser valido.
     * @type {{ on: Boolean, valid: Boolean, su: Boolean, version: String, run(message: Message, args: String[], client: Client, utils: util, database: DBconnection): Boolean }}
     */
    const commandDeserialize = client.commands.get(command);

    if (commandDeserialize != undefined) {
        if (commandDeserialize.on == true) {
            if (commandDeserialize.su == true) {
                if (client.su.includes(message.author.id)) {
                    commandDeserialize.run(message, args, client, util, DBconnection);
                };
            } else {
                commandDeserialize.run(message, args, client, util, DBconnection);
            };
        };
    };

});

client.login("NzQwMDY3MTUyNTkzNDIwMzA4.XyjnPg.HSjso5XJHxBfnw_A4RdoOfroUVQ");