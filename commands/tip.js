/**
 * @fileoverview Comando que envia consejos de como usar el bot de manera aleatoria
 * @author UltraMiembros<ultramiembros@gmail.com>
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
 * Ejecutor del comando. Manda un embed con tips/consejos aleatorios sobre como usar el bot.
 * @param {Message} message Mensaje que ejecuto el comando.
 * @param {String[]} args Argumentos de el comando.
 * @param {Client} client Bot cliente que se esta usando.
 * @param {util} utils Funciones utiles.
 * @param {Connection} database Base de datos que utiliza el bot.
 * @returns {Boolean} devuelve true si se ejecuto correctamente el comando.
 */
module.exports.run = (message, args, client, utils, database) => {
    /**
     * Lista de objetos embeds con los tips o consejos que se eligiran de manera aleatoria.
     * @type {{title: String, description: String, color: String}[]}
     */
    let tips = [{
        title: "¡Precaución!",
        description: "Debes tener en cuenta el riesgo que corres al darle tus coins a otra persona ya que puedes resultar estafado.",
        color: "RED"
    }, {
        title: "¡No te vallas!",
        description: "Tambien debes tener en cuenta que al salirte de un servidor en el periodo de espera para obtener los coins ese periodo sera cancelado y tus coins no los podras obtener, eso quiere decir que deberas de permanecer dentro.",
        color: "YELLOW"
    }, {
        title: "¡Primeros pasos!",
        description: "Para hacer un uso correcto del bot al agregarlo a tu discord debes utilizar el comando u!hola y seguir los pasos que se mostraran en la lista.",
        color: "GREEN"
    }, {
        title: "¡Soporte!",
        description: "Recuerda que si tienes algún tipo de problema puedes contactarte con el staff de U-Miembros y asi obtener ayuda.",
        color: "GREEN"
    }, {
        title: "¡Precaución!",
        description: "A la hora de comprar miembros asegurate de tener los coins suficientes y de que el bot este en tu discord y no en el de un amigo.",
        color: "RED"
    }, {
        title: "¡Piensa!",
        description: "Solamente debes preocuparte por permanecer dentro de los discords a  los que te uniste para no perder coins.",
        color: "YELLOW"
    }, {
        title: "¡Estate atento!",
        description: "De vez en cuando se estaran realizando sorteos en el discord de soporte hacia el bot, ahi podras obtener coins o alguna otra cosa.",
        color: "GREEN"
    }, {
        title: "!Nosotros sabemos lo que hacemos¡",
        description: "El bot es completamente funcional, por lo tanto quedate tranquilo.",
        color: "GREEN"
    }, {
        title: "!Cuidado¡",
        description: "Si sacas al bot de tu servidor o le quitas permisos de administrador mientras compraste miembros perderas todos los coins usados.",
        color: "RED"
    }, {
        title: "!Cuidado¡",
        description: "Si eliminas la invitacion que el bot esta usando para obtener tus miembros cancelaras toda la operacion y perderas los coins gastados.",
        color: "RED"
    }];
    try {
        /**
         * Embed que contiene un tip aleatorio.
         */
        let embedTip = new MessageEmbed(tips[Math.floor(Math.random() * tips.length)]);

        message.channel.send(embedTip);
        return true;
    } catch (e) {
        return false;
    };
};