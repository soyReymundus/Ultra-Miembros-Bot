/**
 * @fileoverview Obtienes toda la informacion de una persona.
 * @author Reymundus<arceleandro@protonmail.com>
 */

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
module.exports.su = true;

/**
 * Indica la version actual del comando.
 */
module.exports.version = "v1";

/**
 * Ejecutor del comando. Obtienes un archivo con toda la informacion de el usuario.
 * @param {Message} message Mensaje que ejecuto el comando.
 * @param {String[]} args Argumentos de el comando.
 * @param {Client} client Bot cliente que se esta usando.
 * @param {util} utils Funciones utiles.
 * @param {Connection} database Base de datos que utiliza el bot.
 * @returns {Boolean} devuelve true si se ejecuto correctamente el comando.
 */
module.exports.run = (message, args, client, utils, database) => {
    //"mutual_guilds"


    //dara error si no hay argumento 2 asi que se prevee eso
    try {
        //verifica si es una id o usuario valido
        if (typeof parseInt(args[0].replace("<@", "").replace(">", "").replace("!", "")) != "number") {
            message.channel.send("Ingresa una id valida.");
            return false;
        };
    } catch {
        //se ejecuta si no hay argumento 2
        message.channel.send("Ingresa una id valida.");
        return false;
    };

    try {
        //mando a la API de discord a darme los datos que tiene del usuario.
        client.users.fetch(args[0].replace("<@", "").replace(">", "").replace("!", ""))
            .then((user) => {
                database.query(`SELECT * FROM listaUsuarios WHERE id ='${user.id}'`, (errorDatabase, usuariosBusqueda) => {

                    /**
                     * Datos de un usuario deserializado y preparados para enviar.
                     */
                    let userDataDes = {
                        /**
                         * Nombre completo del usuario
                         */
                        "tag": user.tag,
                        /**
                         * Id del usuario
                         */
                        "id": user.id,
                        /**
                         * Datos de el usuario guardado en la base de datos.
                         * @type {{ historial: String, coins: Number, id: String, icon: String, nombre: String }}
                         */
                        "botDatabase": !!usuariosBusqueda[0] ? usuariosBusqueda[0] : null,
                        /**
                         * Servidores en comun con el usuario.
                         */
                        "mutual_guilds": client.guilds.cache.filter(g =>
                            g.members.cache.filter(m => m.id === user.id)).toJSON()
                    };
                    /**
                     * Datos del usuario serializados
                     * @type {String}
                     */
                    let userData = JSON.stringify(userDataDes);

                    message.channel.send("Los datos solicitados del usuario:", {
                        files: [{
                            attachment: Buffer.from(userData),
                            name: "Datos de " + user.username + ".json"
                        }]
                    });
                });
            })
            .catch((e) => {
                message.channel.send("Ingresa una id valida.");
            });
    } catch (e) {
        //Se ejecuta casa vez que ocurra un error
        message.channel.send("ALGO SALIO MAL");
        return false;
    };
    //se ejecutara si no se ejecuto otro return antes.
    return true;
};