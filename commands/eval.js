/**
 * @fileoverview Ejecuta codigo js de manera insegura desde el bot de discord. Solo superusuarios pueden usar este comando.
 * @author Reymundus<arceleandro@protonmail.com>
 */


const { Message, Client } = require("discord.js");
const util = require("../utils/util");
const sql = require("mysql").createConnection();

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
 * Ejecutor del comando. Ejecuta codigo de manera no controlada.
 * @param {Message} message Mensaje que ejecuto el comando.
 * @param {String[]} args Argumentos de el comando.
 * @param {Client} client Bot cliente que se esta usando.
 * @param {util} utils Funciones utiles.
 * @param {sql} database Base de datos que utiliza el bot.
 * @returns {Boolean} devuelve true si se ejecuto correctamente el comando.
 */
module.exports.run = (message, args, client, utils, database) => {
    try {
        const { inspect } = require("util");

        let input = args.join(" ");

        let messageEval = "";
        messageEval = messageEval + "Input:" + `\`\`\`${input}\`\`\`\n` + "Output:";

        try {
            messageEval = messageEval + `\`\`\`js\n${inspect(eval(input))}\`\`\`\n`;
        } catch (error) {
            messageEval = messageEval + `\`\`\`xl\n${error}\`\`\`\n`;
        };

        message.channel.send(messageEval);
        return true;
    } catch (e) {
        return false;
    };
};