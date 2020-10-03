# util

Es un objeto que contiene un conjunto de funciones utiles el objetivo principal es el de ahorrar lineas de codigo. Ninguna de estas funciones debera poder comunicarse con la base de datos de manera directa.

## Funciones

**commandValidator(commands)**

+ commands [Array](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Array)<[String](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/String)> Lista con los nombres de los archivos de los comandos a validar.
+ Returns: [Map](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Map)<[String](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/String), [command](https://github.com/toelf412/Ultra-Miembros-Bot/blob/master/docs/comandos.md)>

Devuelve un [Map](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Map) con los comandos listos para ser llamados.

**commandTableGenerator(commands)**

+ commands [Map](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Map)<[String](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/String), [command](https://github.com/toelf412/Ultra-Miembros-Bot/blob/master/docs/comandos.md)>
+ Returns: [Array](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Array)<{COMANDO: [String](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/String), ESTADO: [String](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/String)}>

Devuelve un [Array](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Array) con las lista de comandos lista para ser pasadas por un console.table() mostrando si el comando esta encendido o apagado.

**serverValidator(Servers)**

+ Servers [Array](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Array)<[GuildJson](https://github.com/discordjs/discord.js/blob/stable/src/structures/Guild.js#L1504)>
+ Returns: [Array](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Array)<{ iconHash: [String](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/String), id: [String](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/String), region: [String](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/String), ownerID: [String](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/String) }>

Devuelvo un [Array](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Array) unicamento con algunos datos selectos de los servidores que se les alla pasado como parametro.

**DATESQLGenerator(date[, extraDays])**

+ date [Date](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Date)
+ extraDays ([Number](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Number) | [String](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/String))
+ Returns: [String](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/String)

A partir de la clase Date crea una cadena apta para poner en una consulta SQL en el tipo de dato DATE.
Tambien le puedes añadir dias extras por ejemplo si estamos en el dia 30/08/2020 y le añadimos 5 dias estaremos en el 04/09/2020.

**sleep(ms)**

+ ms [Number](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Number)
+ Returns: [Promise](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Promise)<void>

Es una promesa que tarda la cantidad de milisegundos que se indique en resolverse. Sirve mas que nada en funciones asincronas donde se puede usar el "await" para detener la ejecucion del codigo un rato.