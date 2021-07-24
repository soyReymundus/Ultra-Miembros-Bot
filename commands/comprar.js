/**
 * @fileoverview Comando hecho para que los usuarios puedan comprar miembros con los coins que tienen.
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
module.exports.su = false;

/**
 * Indica la version actual del comando.
 */
module.exports.version = "v1";

/**
 * Ejecutor del comando. Este comando sirve para realizar un pedido a cambio de coins para obtener usuarios.
 * @param {Message} message Mensaje que ejecuto el comando.
 * @param {String[]} args Argumentos de el comando.
 * @param {Client} client Bot cliente que se esta usando.
 * @param {util} utils Funciones utiles.
 * @param {Connection} database Base de datos que utiliza el bot.
 * @returns {Boolean} devuelve true si se ejecuto correctamente el comando.
 */
module.exports.run = (message, args, client, utils, database) => {

    //se verifica si al comando se le dio argumentos.
    if (!args[0]) {
        message.channel.send("Ingresa la cantidad a comprar.");
        return true;
    };

    /**
     * Cantidad de miembros a comprar.
     * @type {Number}
     */
    let cantidadMiembros = parseInt(args[0]);

    /**
     * Array con que contiene el mensaje del pedido.
     * @type {Array<String>}
     */
    let argsM = args.slice(1);

    /**
     * Mensaje del pedido.
     * @type {String}
     */
    let mensajePedido = argsM.join(" ");

    //Se modifica el mensaje del pedido en caso de ser muy largo o muy corto.
    if (mensajePedido.length > 300) mensajePedido = "Join my server pls";
    if (mensajePedido.length == 0) mensajePedido = "Join my server pls";

    //se verifica si se el mensaje se envio desde el canal de un servidor.
    if(!message.guild) {
        message.channel.send("Debes escribir este comando en un servidor!");
        return true;
    };

    //se verifica si el numbero de miembros en realidad es un numero.
    if (isNaN(cantidadMiembros)) {
        message.channel.send("Ingresa la cantidad a comprar.");
        return true;
    };

    //Se impone un minimo de miembros a comprar.
    if (cantidadMiembros < 4) {
        message.channel.send("Ingresa la cantidad igual o mayor a 4.");
        return true;
    };

    utils.createOrder(message, database, cantidadMiembros, mensajePedido);

};