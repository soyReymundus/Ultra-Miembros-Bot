/**
 * @fileoverview Busca servidores que esten buscando miembros a cambio de unirte se te dara 1 coin
 * @author Reymundus<arceleandro@protonmail.com>
 */


const { Message, Client, MessageEmbed } = require("discord.js");
const util = require("../utils/util");

/**
 * Indica si el comando esta encendido o apagado.
 * @type {Boolean}
 */
module.exports.on = true;

/**
 * Indica si el comando esta listo para su uso o no esta listo.
 * @type {Boolean}
 */
module.exports.valid = true;

/**
 * Indica si se necesitan permisos de super usuario para usar el comando.
 */
module.exports.su = false;

/**
 * Indica la version actual del comando.
 */
module.exports.version = "v1";

/**
 * Ejecutor del comando. Busca servidores donde la gente que se una se les otorgara 1 coin.
 * @param {Message} message Mensaje que ejecuto el comando.
 * @param {String[]} args Argumentos de el comando.
 * @param {Client} client Bot cliente que se esta usando.
 * @param {util} utils Funciones utiles.
 * @param {Connection} database Base de datos que utiliza el bot.
 * @returns {Boolean} devuelve true si se ejecuto correctamente el comando.
 */
module.exports.run = (message, args, client, utils, database) => {
    let author = message.author;
    try {
        /**
         * Hace un Map con los servidores en comun que se tiene con el usuario.
         */
        let mutual_guilds = client.guilds.cache.filter(g =>
            g.members.cache.filter(m => m.id === author.id).first().id === author.id
        );

        //Usando el anterior Map se busca si el usuario se unio almenos a algunos de los dos servidores principales.
        if (mutual_guilds.get("id de un servidor patrocinado") == undefined) {
            /**
             * Embed con los dos servidores principales.
             */
            const embed = new MessageEmbed()
                .setColor("RED")
                .setTitle("¡SERVIDORES ENCONTRADOS!")
                .setDescription("Se encontraron un servidor donde podras obtener 2 coins. [Ejemplo server](https://discord.gg/invitacionAUnServidorPatrocinado) unete a este interesante servidor.")
            //Se envia el anterior embed debido a que no esta en ninguno de los dos servidores
            message.channel.send(embed);
            return true;
        } else {
            /**
             * Consulta sql a realizar.
             * @type {String}
             */
            let sql = "SELECT * FROM listaPedidos WHERE prioridad = (SELECT MAX(prioridad) FROM listaPedidos) AND estado = 'IN PROCESS'";

            //se ejecuta si con una probabilidad del 3% y cambia la consulta sql para que busca con la prioridad mas baja.
            if (Math.floor(Math.random() * 100) >= 97) {
                sql = "SELECT * FROM listaPedidos WHERE prioridad = 1 AND estado = 'IN PROCESS'";
            };

            //Ya que el usuario esta almenos en alguno de esos dos servidores, le buscamos algun servidor que necesite miembros que este en la base de datos.
            database.query(sql, (err, servidores) => {

                //Si la base de datos dio mas de un servidor se elige uno random y se guarda en esta variable.
                /**
                 * Servidor a enviar al usuario.
                 * @type {{ estado: String, ordenId: Number, userId: String, serverId: String, prioridad: Number, total: Number, contador: Number, miembros: String, invitacion: String, mensaje: String }}
                 */
                let servidorElegido = servidores[Math.floor(Math.random() * servidores.length)];
                //Se comprueba si almenos se encontro un servidor
                if (!servidorElegido) {
                    message.channel.send("No se encontraron servidores :p lo sentimos");
                } else {
                    /**
                     * Embed que contiene los datos de un servidor encontrado.
                     */
                    const embed = new MessageEmbed()
                        .setColor("RANDOM")
                        .setTitle("¡SERVIDORES ENCONTRADOS!")
                        .setDescription(servidorElegido.mensaje)
                        .addField("¡INVITACION!", `https://discord.gg/${servidorElegido.invitacion}`)
                    message.channel.send(embed);
                };
            });
            return true;
        };
    } catch (err) {
        //Se ejecuta cuando ocurre un error y envia un mensaje para no quedar como que el bot tiene mal funcionamiento.
        message.channel.send("No se encontraron servidores :p lo sentimos");
        return false;
    };
};