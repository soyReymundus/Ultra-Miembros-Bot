/**
 * @fileoverview Regala coins a una persona. Solo superusuarios pueden usarlo.
 * @author UltraMiembros<ultramiembros@gmail.com>
 */


const { Message, Client } = require("discord.js");
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
module.exports.su = true;

/**
 * Indica la version actual del comando.
 */
module.exports.version = "v1";

/**
 * Ejecutor de un comando que eegala coins a una persona indicada en los argumentos, solo superusuario pueden usar este comando.
 * @param {Message} message Mensaje que ejecuto el comando.
 * @param {String[]} args Argumentos de el comando.
 * @param {Client} client Bot cliente que se esta usando.
 * @param {util} utils Funciones utiles.
 * @param {Connection} database Base de datos que utiliza el bot.
 * @returns {Boolean} devuelve true si se ejecuto correctamente el comando.
 */
module.exports.run = (message, args, client, utils, database) => {
    let amount = parseInt(args[0]);
    //verifica si es una cantidad de monedas valida
    if (typeof amount != "number" || amount <= 0) {
        message.channel.send("Ingresa una cantidad valida.");
        return false;
    };
    //dara error si no hay argumento 2 asi que se prevee eso
    try {
        //verifica si es una id valida
        if (typeof parseInt(args[1].replace("<@", "").replace(">", "").replace("!", "")) != "number") {
            message.channel.send("Ingresa una id valida.");
            return false;
        };
    } catch{
        //se ejecuta si no hay argumento 2
        message.channel.send("Ingresa una id valida.");
        return false;
    };
    try {
        client.users.fetch(args[1].replace("<@", "").replace(">", "").replace("!", ""))
            .then((user) => {
                database.query(`SELECT * FROM listaUsuarios WHERE id ='${user.id}'`, (errorDatabase, usuariosBusqueda) => {
                    /**
                     * Fragmente de historial. Todo usuario en el bot tiene un historial este es un fragmento de la actual transaccion.
                     * @type {{operacion: String, cantidad: Number, fecha: Number, referencia: String, DESDE: String, DESTINO: String}}
                     */
                    let HistorialFragmento = {
                        "operacion": "COBRO",
                        "cantidad": amount,
                        "fecha": new Date().getTime(),
                        "referencia": "Regalo del super usuario " + message.author.tag,
                        "DESDE": null,
                        "DESTINO": user.id
                    };
                    //Se comprueba si el usuario uso previamente el bot.
                    if (!usuariosBusqueda[0]) {
                        /**
                         * Datos a escapar para añadir a la base de datos.
                         * @type {{ historial: String, coins: Number, id: String, icon: String, nombre: String }}
                         */
                        let data = {
                            "historial": JSON.stringify([HistorialFragmento]),
                            "coins": amount,
                            "id": user.id,
                            "icon": user.avatarURL(),
                            "nombre": user.username
                        };
                        database.query("INSERT INTO listaUsuarios SET ?", data);
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
                            historial = JSON.parse(usuariosBusquedaNotArray["historial"]).push(HistorialFragmento);
                        } catch (errorDeserialize) {
                            historial = [HistorialFragmento];
                        };
                        /**
                         * Datos a escapar para añadir y por consecuencia modificar la base de datos.
                         * @type {{ historial: String, coins: Number, icon: String, nombre: String }}
                         */
                        let data = {
                            "historial": JSON.stringify(historial),
                            "coins": amount + usuariosBusquedaNotArray.coins,
                            "icon": user.avatarURL(),
                            "nombre": user.username
                        };
                        database.query(`UPDATE listaUsuarios WHERE id ='${user.id}' SET ?`, data);
                    };
                    //esto siempre se ejecutara
                    message.channel.send(`Se agrego ${amount} coins a el usuario ${user.id}`);
                });
            })
            .catch((err) => {
                //se ejecuta si el usuario no existe.
                message.channel.send("Ingresa una id valida.");
            });
    } catch (err) {
        //Se ejecuta casa vez que ocurra un error
        message.channel.send("ALGO SALIO MAL");
        return false;
    };
    return true;
};