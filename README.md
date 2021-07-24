# que sucedio?

Este bot había empezado como un proyecto de github privado y es un bot del estilo "Join 4 Join" que antes discord les aceptaba el formulario de verificación con la condición de que no se pudieran comprar con dinero las monedas del bot para comprar miembros (cosa que todos salteaban poniendo las compras en un web externa). Actualmente anunciaron que este tipo de bots ya no los verificaran y les empezaran a quitar el verificado a los que ya existen.

![f join 4 join](https://media.discordapp.net/attachments/745811541298905158/760827363930931210/unknown.png)

Por eso tome la dedición de hacer el código público porque mantener un bot de este tipo sin que genere ninguna ganancia no lo iba a hacer pero pensaba vender el código pero ahora que ya los prohibieron **no pierdo nada al hacer esto.**

## Consejos

Con respecto al código no me molesta si lo modifican pueden siempre descargarse el código y modificarlo o usar la función Fork. Mi consejo  es que simplemente estén atentos a cómo funciona por dentro el bot (como registra los comandos, donde van las ids de los administradores del bot, que clase de datos se guardan en la base de datos) recomiendo ver los archivos útil.js y example.js y la primera parte del index.js antes de empezar a modificarlo.

Con respecto a poner el bot en funcionamiento yo quiero aclarar que no me hago responsable de lo que discord le haga a su cuenta. Hasta ahora lo único que se sabe es que no van a verificar bots de este tipo, eso es un obvio problema con el límite de 100 servidores e intentar hacer algo como enviar un formulario con datos falsos es muy peligroso igualmente si decides ignorar mi consejo o mágicamente discord retrocedió con su decisión respecto a los bots J4J aquí dejo las respuestas al formulario de verificación.

+ What does your application do? Please be as detailed as possible, and feel free to include links to image or video examples.
```
Esta aplicación únicamente funciona de bot. El bot funciona con el objetivo de hacer crecer comunidades de discord cada usuario que use el bot, el usuario puedo conseguir "coins" (que es el nombre de la moneda que usa el bot aunque en ingles coin signifique moneda) uniéndose a servidores que patrocina el bot o servidores de personas que pidan miembros luego con esos coins puede pedir a cambio miembros para su servidor (1 coin = 1 miembro) y los miembros que se unan recibirán un coin por unirse.
```
+ WHAT DISCORD DATA DO YOU STORE?
```
El bot guarda los datos de los usuarios que lo usen específicamente guarda su id, nombre de usuario y foto de perfil y va actualizando su nombre de usuario y foto de perfil cada vez que ingrese ciertos comandos para obtener coins o miembros.
Estos datos los asociamos en nuestra base de datos a otros datos como la  cantidad de coins que el usuario posee, el historial de movimientos de coins que el usuario tiene.
También cuando un usuario hace un pedido de miembros la id del servidor, una invitación que crea el bot, los miembros que se unieron gracias al pedido y la id del usuario que pidió los miembros se guardan en nuestra base de datos 
A continuación dejo exactamente todos los datos provengan de discord o no que guarda el bot en nuestra base de datos:
Usuarios: ( historial TEXT, coins SMALLINT, id TEXT NOT NULL, icon TEXT, nombre TEXT NOT NULL, proximaBusqueda DATE )
Pedidos: ( estado TEXT NOT NULL, ordenId INT NOT NULL, userId TEXT NOT NULL, serverId TEXT NOT NULL, prioridad TINYINT NOT NULL, total SMALLINT NOT NULL, contador SMALLINT, miembros TEXT, invitacion VARCHAR(16), mensaje VARCHAR(300), vencimiento DATE, PRIMARY KEY (ordenId) )
```
+ FOR WHAT PURPOSE(S) DO YOU STORE IT?
```
Guarda todos esos datos para que pueda manejar sus coins y pedidos de miebros dentro del bot.
```
+ FOR HOW LONG DO YOU STORE IT?
```
Lo almacenamos un tiempo indefinido igualmente cualquier usuario puede solicitar eliminar su información.
```
+ WHAT IS THE PROCESS FOR USERS TO REQUEST DELETION OF THEIR DATA?
```
Cualquier usuario puede entrar a el servidor de soporte del bot y pedirle a un soporte que eliminemos sus datos. El soporte le avisara a alguien que pueda administrar la base de datos para la eliminación.
```
+ DOES YOUR APPLICATION UTILIZE OTHER THIRD-PARTY AUTH SERVICES OR CONNECTIONS? IF SO, WHICH, AND WHY?
```
El bot no usa algun Auth de terceros y no tiene ninguna conexión con algún servicio de terceros lo único a lo que se conecta el bot es a nuestra base de datos "mysql" alojada en otro servidor.
```

# Ultra Miembros Bot

Este es un bot estilo J4J que no se sale de lo convencional tiene comandos para buscar servidores a los cuales unirse a cambio de 1 coin y un comando para comprar miembros a cambio de esos coins. 
Este bot está diseñado para que un usuario aprenda a usarlo a medida que lo valla usando con el comando u!hola que todo usuario puede ver en el estado personalizado del bot.

## En marcha

Con respecto a cómo poner el bot en funcionamiento se le tiene que especificar un token de bot de discord que se puedo obtener en https://discord.com/developers en la última línea del index.js, tambien tienen que modificar los parametro de autenticacion para acceder a una base de datos mysql al principio del index.js y reajustar los eventos de entrada y salida de miembros poniendo las ids de los servidores patrocinados, con respecto a los comandos se recomienda modificar el comando u!hola, u!patro y u!buscar y colocar sus servidores patrocinados.

## Bugs

Cabe aclarar que este bot no está exento de errores y que da en sus manos arreglarlos y darle soporte. Esto no significa que si alguien reporta un error no estaré dispuesto arreglarlo significa que el bot ya no me interesa y además estoy seguro que solo mis amigos visitaran esta página de github así que solo arreglare los errores que me reporten cuando tenga ganas solo pido que cumplas esta condiciones :D.

+ Que sea un error que se pueda reproducir con mediana facilidad.
+ Que el error no se produzca por alguna modificación que le allá hecho al código.
+ Que el error no se produzca a causa de no saber operar el bot o algún factor externo.

## En fin

Espero que les sirva de algo el bot a las 5 personas que hayan visitado este repositorio no duden en contactarme cualquier cosa que necesiten espero que este bot sin uso alguno les sirva de algo bye :,D.