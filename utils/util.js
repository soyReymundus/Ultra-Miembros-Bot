/**
 * @fileoverview Archivo con funciones utiles que sirven para ahorrar lineas de codigo.
 * @author Reymundus<arceleandro@protonmail.com>
 */

const { Message, GuildMember, User, Guild } = require("discord.js");

/**
 * Valida archivos con comandos.
 * @param {String[]} commands Lista con los comandos a validar.
 * @returns {Map<String, { on: Boolean, valid: Boolean, su: Boolean, version: String, run(message: Message, args: String[], client: Client, utils: util, database: Connection): Boolean }>} Lista con los comandos validos.
 */
function commandValidator(commands) {
    let output = new Map();
    for (let index = 0; index < commands.length; index++) {
        const element = commands[index];
        try {
            /**
             * Comando deserealizado y listo para usar en caso de ser valido.
             */
            const commandsDeserialize = require("../commands/" + element);
            if (commandsDeserialize.valid) {
                output.set(element.slice(0, element.length - 3), commandsDeserialize);
            };
        } catch (e) { };
    };
    return output;
};

/**
 * Devuelve un Map en base a otro Map con la lista de comandos listo para usar en un console.table()
 * @param {Map<String, { on: Boolean, valid: Boolean, su: Boolean, version: String, run(message: Message, args: String[], client: Client, utils: util, database: Connection): Boolean }>} commands Map con los comandos.
 * @returns {Array<{ COMANDO: String, ESTADO: String }>} Devuelve una JSON deserealizado con todos los comandos listos para usar en un console.table()
 */
function commandTableGenerator(commands) {
    let output = [];

    //pasa por todos los comandos
    for (let [key, value] of commands) {
        /**
         * Indica si el comando esta encendido o apagado
         * @type {String}
         */
        let on = value.on ? "ENCENDIDO" : "APAGADO";

        //los guarda en el otro Map para devolver.
        output.push({ "COMANDO": key, "ESTADO": on });
    };

    return output;
};

/**
 * Devuelve una lista de servidores apto para enviar a un usuario
 * @param {object[]} Servers Lista de servidores
 * @returns {{ iconHash: String, id: String, region: String, ownerID: String }[]} Servidores aptos para enviar a un usuario.
 */
function serverValidator(Servers) {
    /**
     * Es una lista de servidores que devuelve esta funcion.
     * @type {{ iconHash: String, id: String, region: String, ownerID: String }[]}
     */
    let valid = [];

    //Comprueba si hay servidores para validar.
    if (Servers.length != 0) {
        //Pasa por toda la lista de servidores
        for (let index = 0; index < Servers.length; index++) {
            /**
             * Servidor actual por el que pasa el bucle.
             */
            const element = Servers[index];
            //Añade este servidor a la lista de validos solo con ciertas propiedades.
            valid.push({
                "iconHash": element.icon,
                "id": element.id,
                "region": element.region,
                "ownerID": element.ownerID
            });
        };
    };
    return valid;
};

/**
 * A partir de la clase Date crea una cadena apta para poner en una consulta SQL en el tipo de dato DATE.
 * Tambien le puedes añadir dias extras por ejemplo si estamos en el dia 30/08/2020 y le añadimos 5 dias estaremos en el 04/09/2020.
 * @param {Date} date Clase date con la que se ara la cadena.
 * @param {(Number | String)?} extraDays Dias extra que se le añadiran a la cadena. Parametro opcional.
 * @returns {String} Cadena con el formato de el tipo de dato DATE en sql.
 */
function DATESQLGenerator(date, extraDays) {
    //compruaba si se le sumaran dias extra al resultado final.
    if (!extraDays) {
        /**
         * Cadena que representa el dia que indica el date.
         * @type {String}
         */
        let dia = date.getDate().toString();
        /**
         * Cadena que representa el mes que indica el date.
         * @type {String}
         */
        let mes = (date.getMonth() + 1).toString();
        /**
         * Cadena que representa el año que indica el date.
         * @type {String}
         */
        let año = date.getFullYear().toString();

        //Arreglamos los meses.
        if (mes != "12" && mes != "11" && mes != "10") {
            mes = "0" + mes;
        };
        //Arreglamos los dias
        if (dia == "1" || dia == "2" || dia == "3" || dia == "4" || dia == "5" || dia == "6" || dia == "7" || dia == "8" || dia == "9") {
            dia = "0" + dia;
        };

        /**
         * Cadena con el formato DATE de mySQL.
         * @type {String}
         */
        let DATE = `${año}-${mes}-${dia}`;

        /**
         * El anterior formato DATE pasado a un entero.
         * @type {Number}
         */
        let DATEInt = parseInt(DATE.replace(/-/g, ""));

        //Comprueba si baja de el minimo impuesto por mySQL.
        if (DATEInt < 10000101) {
            return "1000-01-01";
        }//Comprueba si supera el maximo impuesto por mySQL.
        else if (DATEInt > 99991231) {
            return "9999-12-31";
        } else {
            return DATE;
        };

    } else {
        /**
         * Creamos otra variable con el Date para poder modificarla a gusto.
         */
        let result = new Date(date);
        /**
         * Cantidad de dias extras.
         * @type {Number}
         */
        let days;

        //se comprueba que tipo de dato es el parametro extraDays.
        if (typeof extraDays == "string") {
            /**
             * El parametro extraDays pasado a numero.
             */
            let numero = parseInt(extraDays);
            //se comprueba si es realmente un numero en caso de no serlo seria una cantidad de dias extra igual a 0.
            if (numero == NaN) {
                days = 0;
            } else {
                days = numero;
            };
        } else if (typeof extraDays == "number") {
            days = extraDays;
        } else {
            //si no es ningun tipo de dato valido se suma 0 dias extra.
            days = 0;
        };

        //Se le suma los dias extra al date
        result.setDate(result.getDate() + days);

        /**
         * Cadena que representa el dia que indica el date.
         * @type {String}
         */
        let dia = result.getDate().toString();
        /**
         * Cadena que representa el mes que indica el date.
         * @type {String}
         */
        let mes = (result.getMonth() + 1).toString();
        /**
         * Cadena que representa el año que indica el date.
         * @type {String}
         */
        let año = result.getFullYear().toString();

        //Arreglamos los meses.
        if (mes != "12" && mes != "11" && mes != "10") {
            mes = "0" + mes;
        };
        //Arreglamos los dias
        if (dia == "1" || dia == "2" || dia == "3" || dia == "4" || dia == "5" || dia == "6" || dia == "7" || dia == "8" || dia == "9") {
            dia = "0" + dia;
        };

        /**
         * Cadena con el formato DATE de mySQL.
         * @type {String}
         */
        let DATE = `${año}-${mes}-${dia}`;

        /**
         * El anterior formato DATE pasado a un entero.
         * @type {Number}
         */
        let DATEInt = parseInt(DATE.replace(/-/g, ""));

        //Comprueba si baja de el minimo impuesto por mySQL.
        if (DATEInt < 10000101) {
            return "1000-01-01";
        }//Comprueba si supera el maximo impuesto por mySQL.
        else if (DATEInt > 99991231) {
            return "9999-12-31";
        } else {
            return DATE;
        };

    };
};

/**
 * Espera el tiempo indicado para cumplir la promesa.
 * Si se llama con un await sirve como un sleep() que detiene temporalmente la sincronia del codigo.
 * @param {Number} ms Tiempo de espera en milisegundos.
 * @returns {Promise<void>} Devuelve una promesa sin nada despues de esperar el tiemp indicado.
 */
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Crea un pedido de miembros a base de un mensaje enviado por el usuario que quiere crearlo.
 * @param {Message} message Mensaje que envio el usuario para crear su pedido.
 * @param {Connection} database Base de datos MySQL que se usara para almacenar el pedido.
 * @param {Number} cantidadMiembros Cantidad de miembros a comprar
 */
function createOrder(message, database, cantidadMiembros) {

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
         * Fragmento de historial. Todo usuario en el bot tiene un historial este es un fragmento de la actual transaccion.
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
                "id": message.author.id,
                "icon": message.author.avatarURL(),
                "nombre": message.author.username
            };
            database.query("INSERT INTO listaUsuarios SET ?", data);
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
                database.query(`UPDATE listaUsuarios SET ? WHERE id ="${member.user.id}"`, data);

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

/**
 * Actualiza una orden en base a un miembro que supuestamente apoyo el pedido.
 * @param {User} user Usuario que se unio al servidor entrando al pedido.
 * @param {String} inviteCode Invitacion al servidor que se asocia un pedido. Si la invitacion so esta asociada a un pedido simplemente la funcion no hace nada.
 * @param {Connection} database Base de datos mysql con las tablas a actualizar.
 * @returns {Promise}
 */
function addUserOrder(user, inviteCode, database) {
    return new Promise((resolve, reject) => {
        //Se manda a la base de datos a buscar si hay pedidos que cumplan la condicion
        database.query(`SELECT * FROM listaPedidos WHERE invitacion='${inviteCode}' AND estado='IN PROCESS'`, (error, pedidoArray) => {
            /**
             * Pedido donde el usuario participo.
             * @type {{ estado: String, ordenId: Number, userId: String, serverId: String, prioridad: Number, total: Number, contador: Number, miembros: String, invitacion: String, mensaje: String }}
             */
            let pedido = pedidoArray[0];

            //comprueba si hay pedido o no.
            if (!pedido) {
                reject("The order does not exist.");
            } else {

                /**
                 * Lista de los miembros que participan en el pedido.
                 * @type {Array<String>}
                 */
                let miembrosArray;

                //Comprueba si existe el array con los miembros dentro del pedido.
                if (!pedido.miembros) {
                    miembrosArray = [user.id];
                } else {
                    try {
                        //se intenta deserializar el array y guardar la id del actual miembro.
                        miembrosArray = JSON.parse(pedido.miembros);
                        miembrosArray.push(user.id);
                    } catch (err) {
                        miembrosArray = [user.id];
                    };
                };

                /**
                 * El array con los miembros serializado.
                 * @type {String}
                 */
                let miembrosArraySerializado = JSON.stringify(miembrosArray);
                //Agarramos el contador y le sumamos 1
                /**
                 * Variable que contiene el contador actual de miembros que participaron en el pedido.
                 * @type {Number}
                 */
                let contador = pedido.contador + 1;
                /**
                 * Limite de miembros que pueden participar en el pedido.
                 * @type {Number}
                 */
                let total = pedido.total;

                //se verifica si se llego a la cantidad de miembros limite. Si no llego solo se agrega el miembro actual al pedido.
                if (total <= contador) {
                    database.query(`UPDATE listaPedidos SET miembros='${miembrosArraySerializado}', contador=${total}, vencimiento='${util.DATESQLGenerator(new Date(), 5)}', estado='RETENTION' WHERE ordenId=${pedido.ordenId}`);
                } else {
                    database.query(`UPDATE listaPedidos SET miembros='${miembrosArraySerializado}', contador=${contador} WHERE ordenId=${pedido.ordenId}`);
                };
                resolve(pedido);
            };
        });
    });
};

/**
 * Verifica si un usuario participo en cierto pedido y lo remueve.
 * @param {User} user Usuario a remover del pedido.
 * @param {Guild} server Servidor donde se realizo el supuesto pedido.
 * @param {Connection} database Base de datos mysql donde aplicar los cambios.
 */
function removeUserOrder(user, server, database) {
    return new Promise((resolve, reject) => {
        //Se manda a la base de datos a buscar si hay pedidos que cumplan la condicion
        database.query(`SELECT * FROM listaPedidos WHERE serverId='${server.id}' AND (estado='RETENTION' OR estado='IN PROCESS') AND miembros LIKE '%${user.id}%'`, (error, pedidoArray) => {
            /**
             * Pedido donde el usuario participo.
             * @type {{ estado: String, ordenId: Number, userId: String, serverId: String, prioridad: Number, total: Number, contador: Number, miembros: String, invitacion: String, mensaje: String }}
             */
            let pedido = pedidoArray[0];

            //comprueba si hay pedido o no.
            if (!pedido) {
                reject("The order does not exist.");
            } else {

                /**
                 * Lista de los miembros que participan en el pedido.
                 * @type {Array<String>}
                 */
                let miembrosArray;

                //Comprueba si existe el array con los miembros dentro del pedido.
                if (!pedido.miembros) { } else {
                    try {
                        //se intenta deserializar el array y eliminar la id del actual miembro.
                        miembrosArray = JSON.parse(pedido.miembros);
                        miembrosArray.splice(miembrosArray.indexOf(user.id), 1);
                    } catch (err) { };
                };

                /**
                 * El array con los miembros serializado.
                 * @type {String}
                 */
                let miembrosArraySerializado = JSON.stringify(miembrosArray);

                //se actualiza el pedido en la base de datos.
                database.query(`UPDATE listaPedidos SET miembros='${miembrosArraySerializado}' WHERE ordenId=${pedido.ordenId}`);
            
                resolve(pedido);
            };

        });
    });
};

/**
 * Añade cierta cantidad de coins a un usuario en especifico.
 * @param {Number} coins Cantidad de coins a agregar.
 * @param {User} user Usuario a agregar los coins.
 * @param {{"operacion": String, "cantidad": Number, "fecha": Number, "referencia": String, "DESDE": String, "DESTINO": String}} HistorialFragmento Fragmento de historial que se incluira al usuario.
 * @param {Connection} database Base de datos mysql donde se guardara la informacion.
*/
function addCoins(coins, user, HistorialFragmento, database) {
    database.query(`SELECT * FROM listaUsuarios WHERE id ='${user.id}'`, (errorDatabase, usuariosBusqueda) => {

        //Se comprueba si el usuario uso previamente el bot.
        if (!usuariosBusqueda[0]) {
            /**
             * Datos a escapar para añadir a la base de datos.
             * @type {{ historial: String, coins: Number, id: String, icon: String, nombre: String }}
             */
            let data = {
                "historial": JSON.stringify([HistorialFragmento]),
                "coins": coins,
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
                "coins": coins + usuariosBusquedaNotArray.coins,
                "icon": user.avatarURL(),
                "nombre": user.username
            };
            database.query(`UPDATE listaUsuarios WHERE id ='${user.id}' SET ?`, data);
        };
    });
};

/**
 * Quita cierta cantidad de coins a un usuario en especifico. 
 * Si el usuario no existia se crea en la base de datos y se le asigna 0 coins y si existia se le retira los coins y puede tener coins negativos.
 * @param {Number} coins Cantidad de coins a retirar si es posible.
 * @param {User} user Usuario afectado.
 * @param {{"operacion": String, "cantidad": Number, "fecha": Number, "referencia": String, "DESDE": String, "DESTINO": String}} HistorialFragmento Fragmento de historial que se incluira al usuario si se le retiran los coins.
 * @param {Connection} database Base de datos mysql donde se guardara la informacion.
*/
function removeCoins(coins, user, HistorialFragmento, database) {
    database.query(`SELECT * FROM listaUsuarios WHERE id ='${user.id}'`, (errorDatabase, usuariosBusqueda) => {

        //Se comprueba si el usuario uso previamente el bot.
        if (!usuariosBusqueda[0]) {
            /**
             * Datos a escapar para añadir a la base de datos.
             * @type {{ historial: String, coins: Number, id: String, icon: String, nombre: String }}
             */
            let data = {
                "historial": "[]",
                "coins": 0,
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
                "coins": usuariosBusquedaNotArray.coins - coins,
                "icon": user.avatarURL(),
                "nombre": user.username
            };
            database.query(`UPDATE listaUsuarios WHERE id ='${user.id}' SET ?`, data);
        };
    });
};

/**
 * Lista de funciones utiles, ninguna de estas tendra contacto directo con la base de datos. Simplemente sirven para ahorrar lineas de codigo usando funciones ya hechas.
 */
module.exports = {
    commandValidator,
    commandTableGenerator,
    serverValidator,
    DATESQLGenerator,
    sleep,
    createOrder,
    addUserOrder,
    removeUserOrder,
    addCoins,
    removeCoins
};