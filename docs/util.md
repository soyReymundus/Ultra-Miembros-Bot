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

**createOrder(message, database, cantidadMiembros, mensajePedido)**

+ message [Message](https://discord.js.org/#/docs/main/stable/class/Message) Mensaje que envio el usuario para crear su pedido.
+ database [database](https://www.npmjs.com/package/mysql#introduction) Conexión directa con la base de datos.
+ cantidadMiembros [Number](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Number) Cantidad de miembros a comprar
+ mensajePedido [String](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/String) El mensaje que usa el usuario para promocionar su servidor.

**addUserOrder(user, inviteCode, database)**

+ user [User](https://discord.js.org/#/docs/main/stable/class/User) Usuario que se unio al servidor.
+ inviteCode [String](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/String) Codigo de la invitacion que uso el usuario, si la invitacion no esta asociada a un pedido la funcion no hara nada.
+ database [database](https://www.npmjs.com/package/mysql#introduction) Conexión directa con la base de datos.

Añade un miembro a un pedido de miembros que hay actualmente activo en la base de datos.

**removeUserOrder(user, server, database)**

+ user [User](https://discord.js.org/#/docs/main/stable/class/User) Usuario que se fue del servidor.
+ server [Guild](https://discord.js.org/#/docs/main/stable/class/Guild) Servidor donde se realizo el pedido, si no se realizo ningun pedido en el servidor la funcion simplemente no hace nada.
+ database [database](https://www.npmjs.com/package/mysql#introduction) Conexión directa con la base de datos.

Remueve un miembro de un pedido de miembros que hay actualmente activo en la base de datos.

**addCoins(coins, user, historialFragmento, database)**

+ coins [Number](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Number) Cantidad de coins a agregar al usuario.
+ user [User](https://discord.js.org/#/docs/main/stable/class/User) Usuario al cual se le agregaran coins.
+ historialFragmento [Object](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Object) Trozo de historial que se le añadira al historial de usuario en la base de datos.
+ database [database](https://www.npmjs.com/package/mysql#introduction) Conexión directa con la base de datos.

Añade coins a un usuario.

**removeCoins(coins, user, historialFragmento, database)**

+ coins [Number](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Number) Cantidad de coins a remover al usuario.
+ user [User](https://discord.js.org/#/docs/main/stable/class/User) Usuario al cual se le removeran coins.
+ historialFragmento [Object](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Object) Trozo de historial que se le añadira al historial de usuario en la base de datos.
+ database [database](https://www.npmjs.com/package/mysql#introduction) Conexión directa con la base de datos.

Remueve coins a un usuario. Si el usuario no existia se crea en la base de datos y se le asigna 0 coins y si existia se le retira los coins y puede tener coins negativos.