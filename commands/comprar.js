/**
 * @fileoverview Comando hecho para que los usuarios puedan comprar miembros con los coins que tienen.
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

    /**
     * Prioridad del pedido.
     * @type {Number}
     */
    let prioridad = 1;

    //se le asigna una prioridad segun la cantidad de miembros comprados.
    if (cantidadMiembros >= 100) {
        prioridad = 2;
    } else if (cantidadMiembros >= 1000) {
        prioridad = 3;
    } else if (cantidadMiembros >= 10000) {
        prioridad = 4;
    };

    //se obtiene el usuario que compro miembros
    database.query(`SELECT * FROM listaUsuarios WHERE id='${message.author.id}'`, (error, usuariosBusqueda) => {
        /**
         * Fragmente de historial. Todo usuario en el bot tiene un historial este es un fragmento de la actual transaccion.
         * @type {{operacion: String, cantidad: Number, fecha: Number, referencia: String, DESDE: String, DESTINO: String}}
         */
        let HistorialFragmento = {
            "operacion": "PAGO",
            "cantidad": cantidadMiembros,
            "fecha": new Date().getTime(),
            "referencia": "Compra de miembros.",
            "DESDE": message.author.id,
            "DESTINO": null
        };
        //Se comprueba si el usuario uso previamente el bot.
        if (!usuariosBusqueda[0]) {
            /**
             * Datos a escapar para añadir a la base de datos.
             * @type {{ historial: String, coins: Number, id: String, icon: String, nombre: String }}
             */
            let data = {
                "historial": "[]",
                "coins": 0,
                "id": member.user.id,
                "icon": member.user.avatarURL(),
                "nombre": member.user.username
            };
            DBconnection.query("INSERT INTO listaUsuarios SET ?", data);
            //se le informa al usuario que necesita coins para poder comprar miembros.
            message.channel.send("No tienes coins suficientes.");
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
                "coins": usuariosBusquedaNotArray.coins - cantidadMiembros,
                "icon": member.user.avatarURL(),
                "nombre": member.user.username
            };

            //Se verifica si el usuario tiene esos coins
            if (data.coins < 0) {
                //se le informa al usuario que necesita coins para poder comprar miembros.
                message.channel.send("No tienes coins suficientes.");
            } else {
                //se actualiza el usuario en la base de datos.
                DBconnection.query(`UPDATE listaUsuarios SET ? WHERE id ="${member.user.id}"`, data);

                //se obtiene el ordenId mas alto para poder crear el pedido.
                database.query("SELECT MAX(ordenId) FROM listaPedidos", (errDb, max_ordenId_Array) => {
                    /**
                     * El ordenId mas alto en la base de datos.
                     * @type {Number}
                     */
                    let db_ordenId = max_ordenId_Array[0]['MAX(ordenId)'];

                    /**
                     * El ordenId para este pedido.
                     * @type {Number}
                     */
                    max_ordenId = db_ordenId + 1;

                    //Se crea la invitacion para el pedido en un canal aleatorio.
                    message.guild.channels.cache.random().createInvite({
                        maxAge: 0,
                        maxUses: 0,
                        unique: true,
                        reason: "Compra de miembros"
                    })
                        .then((invite) => {

                            /**
                             * Datos del pedido
                             * @type {{ estado: String, ordenId: Number, userId: String, serverId: String, prioridad: Number, total: Number, contador: Number, miembros: String, invitacion: String, mensaje: String }}
                             */
                            let pedidoData = {
                                estado: "IN PROCESS",
                                ordenId: max_ordenId,
                                userId: message.author.id,
                                serverId: message.guild.id,
                                prioridad: prioridad,
                                total: cantidadMiembros,
                                invitacion: invite.code,
                                mensaje: mensajePedido
                            };

                            //se añade su pedido a la base de datos.
                            database.query("INSERT INTO listaPedidos SET ?", pedidoData)
                        })
                        .catch((err) => {
                            //en caso se fallar se le pide al usuario permiso de administrador para evitar errores futuros.
                            message.channel.send("El bot debe tener permiso de administrador.")
                        });
                });
            };
        };
    });
};