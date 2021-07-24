# comandos

Cada archivo de comandos es un objeto que tiene varias propiedades y una funcion para su correcto funcionamiento eso se puede ver en el archivo example.js. Intenta replicarlas para cada comando que crees.

## Propiedades

**version**

+ [String](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/String)

No sirve de nada puedes indicar ahi la version del comando pero realmente en ningun momento se toma en cuenta para algo.

**on**

+ [Bool](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Boolean)

Sirve para indicar si el comando esta encendido o no. En caso de no estar encendio no se ejecutara cada vez que lo llamen.

**valid**

+ [Bool](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Boolean)

Sirve para indicar si el comando es valido o contiene errores. En caso de no ser valido no se registrara como un comando.

**su**

+ [Bool](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Boolean)

Indica si el comando unicamente lo pueden ejecutar administradores del bot.

## Funciones

**run(message, args, client, utils, database)**

+ message [Message](https://discord.js.org/#/docs/main/stable/class/Message) Mensaje que hizo llamar a el comando
+ args [Array](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Array)<[String](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/String)> Argumentos para el comando.
+ client [Client](https://discord.js.org/#/docs/main/stable/class/Client) Cliente del bot
+ utils [util](https://github.com/toelf412/Ultra-Miembros-Bot/blob/master/utils/util.js) Archivo de funciones utiles.
+ database [database](https://www.npmjs.com/package/mysql#introduction) Conexión directa con la base de datos.
+ Returns: ([Bool](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Boolean) | void) Puede llegar a retornar true si no hubo ningun error en la ejecucion del comando y delvolver false si el comando tubo un error en la ejecucion. Con "error en la ejecucion" me refiero a una exepcion o error en la base de datos no a que el usuario pudo ingresar mal un argumento y el comando le respondio con un error.
