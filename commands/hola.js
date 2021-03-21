/**
 * @fileoverview Sirve para darle indicaciones al usuario de como usar el bot.
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
 * Ejecutor del comando. Te devulve un manual de como usar el bot.
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
                .setDescription("Hola usted debe ser el dueño de este servidor. Yo soy U-Miembros soy un bot que se podra encargar de conseguirle miembros a su servidor. Aqui le dejo mi manual de instrucciones.")
                .addField("Paso 1", `Primero ingrese el comando **${client.prefix}patro** para buscar un servidor que te da 2 coins por unirte.`, true)
                .addField("Paso 2", `Cada coin vale 1 miembro. Pon **${client.prefix}comprar 4** para comprar 4 miembros para tu servidor.`, true)
                .addField("Paso 3", `Ahora pon **${client.prefix}buscar** para buscar servidores y unirte casa vez que te unas a un servidor se te dara 1 coin.`, true)
                .addField("Consejo", `Usa el comando **${client.prefix}tip** para recibir un consejo aleatorio sobre como usar el bot.`, true)
                .addField("¡COINS GRATIS!", `Unete a alguno de estos servidores para recibir coins gratis [Ejemplo server](https://discord.gg/invitacion a un servidor patrocinado)`, true);

            message.channel.send(embedData);
        } catch (e) {
            return false;
        };
        return true;
    } else {
        try {
            embedData = new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL())
                .setColor("RANDOM")
                .setFooter("U-Miebros no es legalmente una empresa", client.user.avatarURL())
                .setDescription("Hola usted " + message.author.username + " lindo nombre. Soy U-Miembros un bot que se encargara de conseguirte miembros para tu discord, aqui te dejo mi manual de instrucciones.")
                .addField("Paso 1", `[Haz click aqui](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot) para agregarme a tu servidor ¡yo me encargare de conseguirte miembros!.`, true)
                .addField("Paso 2", `Primero ingrese el comando **${client.prefix}patro** para buscar un servidor que te da 2 coins por unirte.`, true)
                .addField('\u200b', '\u200b')
                .addField("Paso 3", `Cada coin vale 1 miembro. Pon **${client.prefix}comprar 4** para comprar 4 miembros para tu servidor.`, true)
                .addField("Paso 4", `Ahora pon **${client.prefix}buscar** para buscar servidores y unirte casa vez que te unas a un servidor se te dara 1 coin.`, true)
                .addField("Consejo", `Usa el comando **${client.prefix}tip** para recibir un consejo aleatorio sobre como usar el bot.`, false)
                .addField("¡COINS GRATIS!", `Unete a alguno de estos servidores para recibir coins gratis [Ejemplo server](https://discord.gg/invitacionAUnServidorPatrocinado)`, true);

            message.channel.send(embedData);
        } catch (e) {
            return false;
        };
        return true;
    };
};