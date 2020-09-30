/**
 * @fileoverview Archivo principal se encarga de hacer que el bot de discord funcione, conectarse a la base de datos y tiene un sistema de para reportar errores.
 * @author Reymundus<arceleandro@protonmail.com>
 */

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
const DBconnection = mysql.createConnection({
    host: '0.0.0.0',
    user: 'admin',
    password: 'admin',
    database: 'UMiembros',
    insecureAuth: false
});

DBconnection.connect();

DBconnection.query("CREATE TABLE IF NOT EXISTS listaUsuarios( historial TEXT, coins SMALLINT, id TEXT NOT NULL, icon TEXT, nombre TEXT NOT NULL, proximaBusqueda DATE )");
DBconnection.query("CREATE TABLE IF NOT EXISTS listaPedidos( estado TEXT NOT NULL, ordenId INT NOT NULL, userId TEXT NOT NULL, serverId TEXT NOT NULL, prioridad TINYINT NOT NULL, total SMALLINT NOT NULL, contador SMALLINT, miembros TEXT, invitacion VARCHAR(16), mensaje VARCHAR(300), vencimiento DATE, PRIMARY KEY (ordenId) )");

DBconnection.on("error", (err) => {
    throw err;
});

/*
░█▀▀▄ ▀█▀ ░█▀▀▀█ ░█▀▀█ ░█▀▀▀█ ░█▀▀█ ░█▀▀▄ 　 ░█▀▀█ ░█▀▀▀█ ▀▀█▀▀ 
░█─░█ ░█─ ─▀▀▀▄▄ ░█─── ░█──░█ ░█▄▄▀ ░█─░█ 　 ░█▀▀▄ ░█──░█ ─░█── 
░█▄▄▀ ▄█▄ ░█▄▄▄█ ░█▄▄█ ░█▄▄▄█ ░█─░█ ░█▄▄▀ 　 ░█▄▄█ ░█▄▄▄█ ─░█──
*/
const fs = require("fs");
const util = require("./utils/util");
const Discord = require("discord.js");
const client = new Discord.Client({
    fetchAllMembers: true,
    messageCacheMaxSize: 1000,
    retryLimit: 3,
    presence: {
        status: "online",
        activity: {
            name: "Escribe u!hola para empezar a usarme",
            type: "PLAYING"
        }
    }
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
client.su = ["Discord id"];
/**
 * Lista con las invitaciones de los servidores donde esta el bot.
 * @type {{}}
 */
client.invites = {};

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
    let estados = ["Unete al servidor de soporte discord.gg/FYcVCZN", "Escribe u!hola para empezar a usarme"];
    /**
     * Cuenta en que pocision del array de estados va.
     * @type {Number}
     */
    let contador = 0;
    /**
     * Intervalo de tiempo que se espera entre cada cambio de estado
     */
    let intervalo = 300000;

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

    //Espera 5 minutos para ver el cache y guardar las invite en un objeto.
    setTimeout(async () => {
        for (const [id, guild] of client.guilds.cache) {
            //se mira y guarda en cache todas las invitaciones de un servidor.
            guild.fetchInvites()
                .then((guildInvites) => {
                    client.invites[id] = guildInvites;
                })
                .catch((err) => { });
            //se espera cierta cantidad de milisegundos para no romper el limite de velocidad de la api de discord.
            await util.sleep(70);
        };
    }, 300000);

    //Comprueba cada 3 horas si hay un pedido en retencion que ya deba finalizar o si el bot pedio administrador en algun servidor.
    setInterval(async () => {
        //comprueba si ya acabo el estado de retencion de un pedido.
        DBconnection.query(`UPDATE listaPedidos SET estado='FINISH' WHERE estado='RETENTION' AND vencimiento='${util.DATESQLGenerator(new Date())}'`);
        //comprueba si perdio administrador de algun servidor.
        for (const [id, guild] of client.guilds.cache) {
            //se mira el miembro (este bot) en el servidor. No usando la cache.
            guild.members.fetch(client.user.id)
                .then((member) => {
                    //Se guarda el booleano que indica si tiene permiso de admin o no.
                    let admin = member.hasPermission("ADMINISTRATOR");
                    //Si no tiene permiso de admin se cancelan todos los pedidos
                    if (!admin) {
                        DBconnection.query(`UPDATE listaPedidos SET estado='FINISH' WHERE serverId='${member.guild.id}'`);
                    };
                })
                .catch((err) => { });
            //se espera cierta cantidad de milisegundos para no romper el limite de velocidad de la api de discord.
            await util.sleep(70);
        };
    }, 10800000);
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

client.on("guildMemberAdd", (member) => {
    member.guild.fetchInvites()
        .then((guildInvites) => {
            //guardo en esta variable una copia de todas las invitaciones del servidor donde se unio el miembro.
            /**
             * Invitaciones de el servidor guardadas en cache.
             * @type {Discord.Collection<String, Discord.Invite>}
             */
            const invites_Temp = client.invites[member.guild.id];
            //Actualizo la cache!
            client.invites[member.guild.id] = guildInvites;
            /**
             * Invitacion usada por el usuario.
             * @type {Discord.Invite}
             */
            let invite = guildInvites.find(i => invites_Temp.get(i.code).uses < i.uses);

            //si el sistema fallo y no se unio por ninguna invitacion hacemos un "return" asi no pasa por las condicionales.
            if (!invite) {
                return;
            };

            if (invite.code == "bzseT3G" || invite.code == "ZnNmpHR") {
                //Al usuario por unirse al servidor patrocinado se le agrega 2 coin extra.
                DBconnection.query(`SELECT * FROM listaUsuarios WHERE id='${member.user.id}'`, (error, usuariosBusqueda) => {
                    /**
                     * Fragmente de historial. Todo usuario en el bot tiene un historial este es un fragmento de la actual transaccion.
                     * @type {{operacion: String, cantidad: Number, fecha: Number, referencia: String, DESDE: String, DESTINO: String}}
                     */
                    let HistorialFragmento = {
                        "operacion": "COBRO",
                        "cantidad": 2,
                        "fecha": new Date().getTime(),
                        "referencia": "Unirse al servidor " + member.guild.id + " el cual es un servidor patrocinado.",
                        "DESDE": "CENTRAL",
                        "DESTINO": member.user.id
                    };
                    //Se comprueba si el usuario uso previamente el bot.
                    if (!usuariosBusqueda[0]) {
                        /**
                         * Datos a escapar para añadir a la base de datos.
                         * @type {{ historial: String, coins: Number, id: String, icon: String, nombre: String }}
                         */
                        let data = {
                            "historial": JSON.stringify([HistorialFragmento]),
                            "coins": 2,
                            "id": member.user.id,
                            "icon": member.user.avatarURL(),
                            "nombre": member.user.username
                        };
                        DBconnection.query("INSERT INTO listaUsuarios SET ?", data);
                    } else {
                        /**
                         * Datos comunmente de un usuario guardado en la base de datos.
                         * @type {{ historial: String, coins: Number, id: String, icon: String, nombre: String }}
                         */
                        let usuariosBusquedaNotArray = usuariosBusqueda[0];
                        /**
                        * Array con el historial de un usuario deserializado.
                        * @type {Array<{operacion: String, cantidad: Number, fecha: Number, referencia: String, DESDE: String, DESTINO: String}>}
                         */
                        let historial;
                        try {
                            historial = JSON.parse(usuariosBusquedaNotArray["historial"]);
                            historial.push(HistorialFragmento);
                        } catch (errorDeserialize) {
                            historial = [HistorialFragmento];
                        };
                        /**
                         * Datos a escapar para añadir y por consecuencia modificar la base de datos.
                         * @type {{ historial: String, coins: Number, icon: String, nombre: String }}
                         */
                        let data = {
                            "historial": JSON.stringify(historial),
                            "coins": 1 + usuariosBusquedaNotArray.coins,
                            "icon": member.user.avatarURL(),
                            "nombre": member.user.username
                        };
                        DBconnection.query(`UPDATE listaUsuarios SET ? WHERE id ='${member.user.id}'`, data);
                    };
                });
            } else {
                //Se manda a la base de datos a buscar si hay pedidos que cumplan la condicion
                DBconnection.query(`SELECT * FROM listaPedidos WHERE invitacion='${invite.code}' AND estado='IN PROCESS'`, (error, pedidoArray) => {
                    /**
                     * Pedido donde el usuario participo.
                     * @type {{ estado: String, ordenId: Number, userId: String, serverId: String, prioridad: Number, total: Number, contador: Number, miembros: String, invitacion: String, mensaje: String }}
                     */
                    let pedido = pedidoArray[0];

                    //comprueba si hay pedido o no.
                    if (!pedido) { } else {

                        /**
                         * Lista de los miembros que participan en el pedido.
                         * @type {Array<String>}
                         */
                        let miembrosArray;

                        //Comprueba si existe el array con los miembros dentro del pedido.
                        if (!pedido.miembros) {
                            miembrosArray = [member.user.id];
                        } else {
                            try {
                                //se intenta deserializar el array y guardar la id del actual miembro.
                                miembrosArray = JSON.parse(pedido.miembros);
                                miembrosArray.push(member.user.id);
                            } catch (err) {
                                miembrosArray = [member.user.id];
                            };
                        };

                        /**
                         * El array con los miembros serializado.
                         * @type {String}
                         */
                        let miembrosArraySerializado = JSON.stringify(miembrosArray);
                        //Agarramos el contador y le sumamos 1
                        /**
                         * Variable que contiene el contador actual de miembros que participaron en el pedido.
                         * @type {Number}
                         */
                        let contador = pedido.contador + 1;
                        /**
                         * Limite de miembros que pueden participar en el pedido.
                         * @type {Number}
                         */
                        let total = pedido.total;

                        //se verifica si se llego a la cantidad de miembros limite. Si no llego solo se agrega el miembro actual al pedido.
                        if (total <= contador) {
                            DBconnection.query(`UPDATE listaPedidos SET miembros='${miembrosArraySerializado}', contador=${total}, vencimiento='${util.DATESQLGenerator(new Date(), 5)}', estado='RETENTION' WHERE ordenId=${pedido.ordenId}`);
                        } else {
                            DBconnection.query(`UPDATE listaPedidos SET miembros='${miembrosArraySerializado}', contador=${contador} WHERE ordenId=${pedido.ordenId}`);
                        };
                        //Al usuario por participar en el pedido se le agrega 1 coin extra.
                        DBconnection.query(`SELECT * FROM listaUsuarios WHERE id='${member.user.id}'`, (error, usuariosBusqueda) => {
                            /**
                             * Fragmente de historial. Todo usuario en el bot tiene un historial este es un fragmento de la actual transaccion.
                             * @type {{operacion: String, cantidad: Number, fecha: Number, referencia: String, DESDE: String, DESTINO: String}}
                             */
                            let HistorialFragmento = {
                                "operacion": "COBRO",
                                "cantidad": 1,
                                "fecha": new Date().getTime(),
                                "referencia": "Unirse al servidor " + pedido.serverId + " el cual compro " + pedido.total + " miembros.",
                                "DESDE": pedido.ordenId.toString(),
                                "DESTINO": member.user.id
                            };
                            //Se comprueba si el usuario uso previamente el bot.
                            if (!usuariosBusqueda[0]) {
                                /**
                                 * Datos a escapar para añadir a la base de datos.
                                 * @type {{ historial: String, coins: Number, id: String, icon: String, nombre: String }}
                                 */
                                let data = {
                                    "historial": JSON.stringify([HistorialFragmento]),
                                    "coins": 1,
                                    "id": member.user.id,
                                    "icon": member.user.avatarURL(),
                                    "nombre": member.user.username
                                };
                                DBconnection.query("INSERT INTO listaUsuarios SET ?", data);
                            } else {
                                /**
                                 * Datos comunmente de un usuario guardado en la base de datos.
                                 * @type {{ historial: String, coins: Number, id: String, icon: String, nombre: String }}
                                 */
                                let usuariosBusquedaNotArray = usuariosBusqueda[0];
                                /**
                                * Array con el historial de un usuario deserializado.
                                * @type {Array<{operacion: String, cantidad: Number, fecha: Number, referencia: String, DESDE: String, DESTINO: String}>}
                                 */
                                let historial;
                                try {
                                    historial = JSON.parse(usuariosBusquedaNotArray["historial"]);
                                    historial.push(HistorialFragmento);
                                } catch (errorDeserialize) {
                                    historial = [HistorialFragmento];
                                };
                                /**
                                 * Datos a escapar para añadir y por consecuencia modificar la base de datos.
                                 * @type {{ historial: String, coins: Number, icon: String, nombre: String }}
                                 */
                                let data = {
                                    "historial": JSON.stringify(historial),
                                    "coins": 1 + usuariosBusquedaNotArray.coins,
                                    "icon": member.user.avatarURL(),
                                    "nombre": member.user.username
                                };
                                DBconnection.query(`UPDATE listaUsuarios SET ? WHERE id ='${member.user.id}'`, data);
                            };
                        });
                    };
                });
            };
        })
        .catch((err) => {
            throw err;
        });
});

client.on("guildMemberRemove", (member) => {
    if (member.guild.id == "730299838863769630" || member.guild.id == "699850469086068819") {
        //Al usuario por irse del servidor patrocinado se le retira los 2 coins.
        DBconnection.query(`SELECT * FROM listaUsuarios WHERE id='${member.user.id}'`, (error, usuariosBusqueda) => {
            /**
             * Fragmente de historial. Todo usuario en el bot tiene un historial este es un fragmento de la actual transaccion.
             * @type {{operacion: String, cantidad: Number, fecha: Number, referencia: String, DESDE: String, DESTINO: String}}
             */
            let HistorialFragmento = {
                "operacion": "PAGO",
                "cantidad": 2,
                "fecha": new Date().getTime(),
                "referencia": "Salirse del servidor patrocinado " + member.guild.id + ". Sus coins son devueltos a la central.",
                "DESDE": member.user.id,
                "DESTINO": "CENTRAL"
            };
            //Se comprueba si el usuario uso previamente el bot.
            if (!usuariosBusqueda[0]) {
                /**
                 * Datos a escapar para añadir a la base de datos.
                 * @type {{ historial: String, coins: Number, id: String, icon: String, nombre: String }}
                 */
                let data = {
                    "historial": JSON.stringify([HistorialFragmento]),
                    "coins": 0,
                    "id": member.user.id,
                    "icon": member.user.avatarURL(),
                    "nombre": member.user.username
                };
                DBconnection.query("INSERT INTO listaUsuarios SET ?", data);
            } else {
                /**
                 * Datos comunmente de un usuario guardado en la base de datos.
                 * @type {{ historial: String, coins: Number, id: String, icon: String, nombre: String }}
                 */
                let usuariosBusquedaNotArray = usuariosBusqueda[0];
                /**
                * Array con el historial de un usuario deserializado.
                * @type {Array<{operacion: String, cantidad: Number, fecha: Number, referencia: String, DESDE: String, DESTINO: String}>}
                 */
                let historial;
                try {
                    historial = JSON.parse(usuariosBusquedaNotArray["historial"]);
                    historial.push(HistorialFragmento);
                } catch (errorDeserialize) {
                    historial = [HistorialFragmento];
                };
                /**
                 * Datos a escapar para añadir y por consecuencia modificar la base de datos.
                 * @type {{ historial: String, coins: Number, icon: String, nombre: String }}
                 */
                let data = {
                    "historial": JSON.stringify(historial),
                    "coins": usuariosBusquedaNotArray.coins - 2,
                    "icon": member.user.avatarURL(),
                    "nombre": member.user.username
                };
                DBconnection.query(`UPDATE listaUsuarios SET ? WHERE id ='${member.user.id}'`, data);
            };
        });
    } else {
        //Se manda a la base de datos a buscar si hay pedidos que cumplan la condicion
        DBconnection.query(`SELECT * FROM listaPedidos WHERE serverId='${member.guild.id}' AND (estado='RETENTION' OR estado='IN PROCESS') AND miembros LIKE '%${member.user.id}%'`, (error, pedidoArray) => {
            /**
             * Pedido donde el usuario participo.
             * @type {{ estado: String, ordenId: Number, userId: String, serverId: String, prioridad: Number, total: Number, contador: Number, miembros: String, invitacion: String, mensaje: String }}
             */
            let pedido = pedidoArray[0];

            //comprueba si hay pedido o no.
            if (!pedido) { } else {

                /**
                 * Lista de los miembros que participan en el pedido.
                 * @type {Array<String>}
                 */
                let miembrosArray;

                //Comprueba si existe el array con los miembros dentro del pedido.
                if (!pedido.miembros) { } else {
                    try {
                        //se intenta deserializar el array y eliminar la id del actual miembro.
                        miembrosArray = JSON.parse(pedido.miembros);
                        miembrosArray.splice(miembrosArray.indexOf(member.user.id), 1);
                    } catch (err) { };
                };

                /**
                 * El array con los miembros serializado.
                 * @type {String}
                 */
                let miembrosArraySerializado = JSON.stringify(miembrosArray);

                //se actualiza el pedido en la base de datos.
                DBconnection.query(`UPDATE listaPedidos SET miembros='${miembrosArraySerializado}' WHERE ordenId=${pedido.ordenId}`);

                //Al usuario por participar en el pedido se le quita 1 coin por irse.
                DBconnection.query(`SELECT * FROM listaUsuarios WHERE id='${member.user.id}'`, (error, usuariosBusqueda) => {
                    /**
                     * Fragmente de historial. Todo usuario en el bot tiene un historial este es un fragmento de la actual transaccion.
                     * @type {{operacion: String, cantidad: Number, fecha: Number, referencia: String, DESDE: String, DESTINO: String}}
                     */
                    let HistorialFragmento = {
                        "operacion": "PAGO",
                        "cantidad": 1,
                        "fecha": new Date().getTime(),
                        "referencia": "Irse del servidor " + pedido.serverId + " el cual compro " + pedido.total + " miembros.",
                        "DESDE": member.user.id,
                        "DESTINO": pedido.userId
                    };
                    //Se comprueba si el usuario uso previamente el bot.
                    if (!usuariosBusqueda[0]) {
                        /**
                         * Datos a escapar para añadir a la base de datos.
                         * @type {{ historial: String, coins: Number, id: String, icon: String, nombre: String }}
                         */
                        let data = {
                            "historial": JSON.stringify([HistorialFragmento]),
                            "coins": 0,
                            "id": member.user.id,
                            "icon": member.user.avatarURL(),
                            "nombre": member.user.username
                        };
                        DBconnection.query("INSERT INTO listaUsuarios SET ?", data);
                    } else {
                        /**
                         * Datos comunmente de un usuario guardado en la base de datos.
                         * @type {{ historial: String, coins: Number, id: String, icon: String, nombre: String }}
                         */
                        let usuariosBusquedaNotArray = usuariosBusqueda[0];
                        /**
                        * Array con el historial de un usuario deserializado.
                        * @type {Array<{operacion: String, cantidad: Number, fecha: Number, referencia: String, DESDE: String, DESTINO: String}>}
                         */
                        let historial;
                        try {
                            historial = JSON.parse(usuariosBusquedaNotArray["historial"]);
                            historial.push(HistorialFragmento);
                        } catch (errorDeserialize) {
                            historial = [HistorialFragmento];
                        };
                        /**
                         * Datos a escapar para añadir y por consecuencia modificar la base de datos.
                         * @type {{ historial: String, coins: Number, icon: String, nombre: String }}
                         */
                        let data = {
                            "historial": JSON.stringify(historial),
                            "coins": usuariosBusquedaNotArray.coins - 1,
                            "icon": member.user.avatarURL(),
                            "nombre": member.user.username
                        };
                        DBconnection.query(`UPDATE listaUsuarios SET ? WHERE id ="${member.user.id}"`, data);
                    };
                });

                //Al dueño del pedido se le rembolsa 1 coin
                DBconnection.query(`SELECT * FROM listaUsuarios WHERE id='${pedido.userId}'`, (error, usuariosBusqueda) => {
                    /**
                     * Fragmente de historial. Todo usuario en el bot tiene un historial este es un fragmento de la actual transaccion.
                     * @type {{operacion: String, cantidad: Number, fecha: Number, referencia: String, DESDE: String, DESTINO: String}}
                     */
                    let HistorialFragmento = {
                        "operacion": "COBRO",
                        "cantidad": 1,
                        "fecha": new Date().getTime(),
                        "referencia": "Rembolso de un pedido en el server " + pedido.serverId + " por la salida de un miembro.",
                        "DESDE": member.user.id,
                        "DESTINO": pedido.userId
                    };
                    //Se comprueba si el usuario uso previamente el bot.
                    if (!usuariosBusqueda[0]) { } else {
                        /**
                         * Datos comunmente de un usuario guardado en la base de datos.
                         * @type {{ historial: String, coins: Number, id: String, icon: String, nombre: String }}
                         */
                        let usuariosBusquedaNotArray = usuariosBusqueda[0];
                        /**
                        * Array con el historial de un usuario deserializado.
                        * @type {Array<{operacion: String, cantidad: Number, fecha: Number, referencia: String, DESDE: String, DESTINO: String}>}
                         */
                        let historial;
                        try {
                            historial = JSON.parse(usuariosBusquedaNotArray["historial"]);
                            historial.push(HistorialFragmento);
                        } catch (errorDeserialize) {
                            historial = [HistorialFragmento];
                        };
                        /**
                         * Datos a escapar para añadir y por consecuencia modificar la base de datos.
                         * @type {{ historial: String, coins: Number, icon: String, nombre: String }}
                         */
                        let data = {
                            "historial": JSON.stringify(historial),
                            "coins": 1 + usuariosBusquedaNotArray.coins
                        };
                        DBconnection.query(`UPDATE listaUsuarios SET ? WHERE id ='${pedido.userId}'`, data);
                    };
                });
            };

        });
    };
});

client.on("guildDelete", (guild) => {
    //Borro las invitaciones de ese servidor de cache.
    client.invites[guild.id] = null;
    //Finalizo todas las compras de ese server.
    DBconnection.query(`UPDATE listaPedidos SET estado='FINISH' WHERE serverId='${guild.id}'`);
});

client.on("guildCreate", (guild) => {
    //Revisa todas las invitaciones del nuevo servidor y las guarda en cache.
    guild.fetchInvites()
        .then((guildInvites) => {
            client.invites[guild.id] = guildInvites;
        })
        .catch((err) => {
            throw err;
        });
});

client.on("inviteCreate", (invite) => {
    /**
     * Todas las invitaciones de el servidor de esta invitacion guardadas en cache.
     * @type {Discord.Collection<String, Discord.Invite>}
     */
    let server_invite_cache_temp = client.invites[invite.guild.id];

    try {
        //Guardo en esa variable la nueva invite
        server_invite_cache_temp.set(invite.code, invite);
        //guardo esa variable en cache remplazando la anterior guardada en cache.
        client.invites[invite.guild.id] = server_invite_cache_temp;
    } catch (e) {
        //si hay algun error se vuelve a obtener las invitaciondes de ese servidor.
        invite.guild.fetchInvites()
            .then((guildInvites) => {
                client.invites[invite.guild.id] = guildInvites;
            })
            .catch((err) => { });
    };
});

client.on("inviteDelete", (invite) => {
    /**
     * Todas las invitaciones de el servidor de esta invitacion guardadas en cache.
     * @type {Discord.Collection<String, Discord.Invite>}
     */
    let server_invite_cache_temp = client.invites[invite.guild.id];

    try {
        //Elimino la invitacion que no exite de esa variable
        server_invite_cache_temp.delete(invite.code);
        //guardo esa variable en cache remplazando la anterior guardada en cache.
        client.invites[invite.guild.id] = server_invite_cache_temp;
    } catch (e) {
        //si hay algun error se vuelve a obtener las invitaciondes de ese servidor.
        invite.guild.fetchInvites()
            .then((guildInvites) => {
                client.invites[invite.guild.id] = guildInvites;
            })
            .catch((err) => { });
    };

    //Finalizo los pedidos que se allan hecho con esa invite.
    DBconnection.query(`UPDATE listaPedidos SET estado='FINISH' WHERE invitacion='${invite.code}'`);
});

client.login("Discord Bot Token");