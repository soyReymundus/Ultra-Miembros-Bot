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

+ message [message](https://discord.js.org/#/docs/main/stable/class/Message)
+ args [Array](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Array)<[String](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/String)>
+ client [client](https://discord.js.org/#/docs/main/stable/class/Client)
+ utils [util](https://github.com/toelf412/Ultra-Miembros-Bot/blob/master/utils/util.js)
+ database [database](https://www.npmjs.com/package/mysql#introduction)

