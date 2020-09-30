
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

    /**
     * Un Iterator Con los nombres de los comandos.
     */
    let commandsIter = commands.keys();
    /**
     * Indica si seguir con el bucle o no hacerlo.
     * @type {Boolean}
     */
    let loop = true;

    while (loop) {
        /**
         * Indica el nombre de el comando.
         * @type {String}
         */
        let value = commandsIter.next().value;
        if (value != undefined) {
            /**
             * Indica si el comando esta encendido o apagado
             * @type {String}
             */
            let on = commands.get(value).on ? "ENCENDIDO" : "APAGADO";

            output.push({ "COMANDO": value, "ESTADO": on });
        } else {
            loop = false;
        };
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

    if (Servers.length == 0) {
        return valid;
    } else {
        for (let index = 0; index < Servers.length; index++) {
            const element = Servers[index];
            valid.push({
                "iconHash": element.icon,
                "id": element.id,
                "region": element.region,
                "ownerID": element.ownerID
            });
        };
        return valid;
    };
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
 * Si se llama con un await sirve como un sleep() y detiene temporalmente la sincronia del codigo.
 * @param {Number} ms Tiempo de espera en milisegundos.
 * @returns {Promise<void>} Devuelve una promesa sin nada despues de esperar el tiemp indicado.
 */
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Lista de funciones utiles, ninguna de estar tendra contacto con la base de datos. Simplemente sirven para ahorrar lineas de codigo usando funciones ya hechas.
 */
module.exports = {
    commandValidator,
    commandTableGenerator,
    serverValidator,
    DATESQLGenerator,
    sleep
};