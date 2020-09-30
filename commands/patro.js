/**
 * @fileoverview Envia un embed que sirve para que un usuario se inicialize con el bot.
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
 * Ejecutor del comando. Envia un embed con los servidores selectos para iniciar con la estafa en una persona.
 * @param {Message} message Mensaje que ejecuto el comando.
 * @param {String[]} args Argumentos de el comando.
 * @param {Client} client Bot cliente que se esta usando.
 * @param {util} utils Funciones utiles.
 * @param {Connection} database Base de datos que utiliza el bot.
 * @returns {Boolean} devuelve true si se ejecuto correctamente el comando.
 */
module.exports.run = (message, args, client, utils, database) => {
    /**
     * Embed a enviar. Es diferente el embed para el dueño del servidor.
     */
    let embedData;
    //Se comprueba si el que envio el mensaje es dueño del servidor
    if (message.author.id == message.guild.ownerID) {
        try {
            embedData = new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL())
                .setColor("RANDOM")
                .setFooter("U-Miebros no es legalmente una empresa", client.user.avatarURL())
                .setDescription("Hola usted debe ser el dueño de este servidor. Yo soy U-Miembros soy un bot que se podra encargar de conseguirle miembros a su servidor. Aqui una lista de servidores especiales que ¡les dara 2 coins por unirse!")
                .addField("XDevShop 💎", `[Haz click aqui](https://discord.gg/bzseT3G)`, true)
                .addField("Samurai", `[Haz click aqui](https://discord.gg/ZnNmpHR)`, true);
        } catch (e) {
            return false;
        };
        message.channel.send(embedData);
        return true;
    } else {
        try {
            embedData = new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL())
                .setColor("RANDOM")
                .setFooter("U-Miebros no es legalmente una empresa", client.user.avatarURL())
                .setDescription("Hola usted debe ser " + message.author.username + " lindo nombre. Soy U-Miembros un bot que se encargara de conseguirte miembros para tu discord, solo quiero avisar que ¡primero tienes que añadir a tu servidor!.")
                .addField("¡PRIMERO!", `Debes añadirme a tu servidor para hacerlo [haz click aqui](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot)`, true)
                .addField("XDevShop 💎", `[Haz click aqui](https://discord.gg/bzseT3G)`, true)
                .addField("Samurai", `[Haz click aqui](https://discord.gg/ZnNmpHR)`, true);
        } catch (e) {
            return false;
        };
        message.channel.send(embedData);
        return true;
    };
};