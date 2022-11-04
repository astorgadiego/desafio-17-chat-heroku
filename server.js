//ESTO VIENE A REPRESENTEAR EL LADO DEL SERVIDOR
//IMPORTANDO LIBRERIAS
const express = require('express')

const HandleBar = require('express-handlebars'); //CARGO EL MODULO DE EXPRESS-HANDLEBARS

const { Server : IOServer } = require ('socket.io')

const { Server : HttpServer } = require ( 'http' )
//-----------------
const PORT = 8080
//-----------------

//INSTANCIANDO EL SERVIDOR Y EL SOCKET
const app = express()
const httpServer = new HttpServer ( app )
const io  = new IOServer ( httpServer )

//INDICAMOS QUE QUEREMOS CARGAR NUESTRO ARCHIVO INDEX.HTML EN LA RAIZ DE LA MISMA
app.use ( express.static ( './public' )  )

//ESTA RUTA CARGA NUESTRO ARCHIVO INDEX.HTML EN LA RAIZ DE LA MISMA
app.get ( '/', ( req, res)=>{ 
    res.sendFile ( 'index.html', { root:__dirname }  ) 
    }
)

const ListadeProductos =   [];
const mensaje = "Hola Mundo"
const Arraymensajes = [];

io.on ('connection', ( socket ) =>{
    console.log("Un usuario se ha conectado");
    socket.emit("Tabla de Productos", ListadeProductos )//ACA LE ENVIAMOS LOS PRODUCTOS QUE ESTAN A ESE CLIENTE NUEVO!!
    socket.emit("ID de mensaje", Arraymensajes)//ACA LE ENVIAMOS LOS MENSAJES QUE ESTAN A ESE CLIENTE NUEVO!!

    socket.on ( 'guardarProducto', prod => {
        ListadeProductos.push( prod );
        io.sockets.emit ( 'ProductoActual', ListadeProductos )//-->ACA LO ENVIA TODOS LOS USUARIOS
    })

    socket.on ( "nuevo-mensaje", data=>{ 
        Arraymensajes.push( data )
        io.sockets.emit("Mensajes Actualizados", Arraymensajes)
     });

});

//EL SERVIDOR FUNCIONANDO EN EL PUERTO 3000
const server = httpServer.listen(PORT, () => console.log(`Servidor OK en puertO : ${PORT} `));  // INICIO LA APLICACION