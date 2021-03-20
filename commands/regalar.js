/**
 * @fileoverview Regala coins a una persona. Solo superusuarios pueden usarlo.
 * @author Reymundus<arceleandro@protonmail.com>
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
    } catch {
        //se ejecuta si no hay argumento 2
        message.channel.send("Ingresa una id valida.");
        return false;
    };
    try {
        client.users.fetch(args[1].replace("<@", "").replace(">", "").replace("!", ""))
            .then((user) => {
                /**
                 * Fragmente de historial. Todo usuario en el bot tiene un historial este es un fragmento de la actual transaccion.
                 * @type {{operacion: String, cantidad: Number, fecha: Number, referencia: String, DESDE: String, DESTINO: String}}
                */
                let HistorialFragmento = {
                    "operacion": "COBRO",
                    "cantidad": amount,
                    "fecha": new Date().getTime(),
                    "referencia": "Regalo del super usuario " + message.author.tag,
                    "DESDE": "CENTRAL",
                    "DESTINO": user.id
                };

                utils.addCoins(amount, user, HistorialFragmento, database);

                //esto siempre se ejecutara
                message.channel.send(`Se agrego ${coins} coins a el usuario ${user.id}`);
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