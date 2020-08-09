
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

            output.push({"COMANDO": value, "ESTADO": on});
        } else {
            loop = false;
        };
    };

    return output;
};


/**
 * Lista de funciones utiles, ninguna de estar tendra contacto con la base de datos. Simplemente sirven para ahorrar lineas de codigo usando funciones ya hechas.
 */
module.exports = {
    commandValidator,
    commandTableGenerator
};