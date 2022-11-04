//ESTO VIENE A REPRESENTAR EL LADO DEL CLIENTE

const socket = io (); //CONECCION ESTABLECIDA!! YA PUEDO USAR LOS SOCKETS DEL LADO DEL CLIENTE :)

const productosRecibidos = document.getElementById ( 'productosRecibidos' )
const btnSend = document.getElementById ('btnSend')
const titulo = document.getElementById ('titulo')
const precio = document.getElementById ('precio')
const foto = document.getElementById ('foto')

let fecha = new Date();

function AgregarAtabla ( e ){
    const ProductoAgregado = {
        titulo : document.getElementById ( 'titulo' ).value,
        precio: document.getElementById ( 'precio' ).value
    };
    socket.emit ( 'nuevo-producto', ProductoAgregado )
    return false;
}

function renderizador( ListadeProductos ) {

    if ( ListadeProductos.length !==0  ) {
            productosRecibidos.innerHTML='';
            productosRecibidos.innerHTML=`<thead>
                                                <tr>
                                                    <th>Producto</th>
                                                    <th>Precio</th>
                                                    <th>Imagen</th>
                                                </tr>
                                          </thead>`
            ListadeProductos.forEach( nuevoProd => {
                productosRecibidos.innerHTML += 
                        `<tr>
                             <td>${nuevoProd.titulo}</td>
                             <td>$${nuevoProd.precio}</td>
                             <td>${nuevoProd.socketID}</td>
                        </tr>`
    });
    }      
}

function addMessage( e ) {

    const NuevosMensajes = {
        email: document.getElementById( "email" ).value,
        texto: document.getElementById ( "mensaje" ).value,
        hora: `${fecha}`
    };
    socket.emit( "nuevo-mensaje", NuevosMensajes )
    return false //POR TEMAS DE FRONT SIEMPRE DEBE RETORNAR ALGO 
}

function MostrarMensajes( Arraymensajes ) {
    const hmtl = Arraymensajes.map( elem => { 
        return(` <div> 
                    <strong class="email">${elem.email}</strong> <span class="hora">${elem.hora}</span>: 
                    <em class="mensaje" >Mensaje: ${elem.texto}</em> 
                 </div>`)
     }).join( "" );
     document.getElementById( "mensajesrecibidos" ).innerHTML = hmtl;
     //document.getElementById( "hora" ).innerHTML = fecha;

}


//CADA MENSAJE NUEVO SE ENVIA AL SERVIDOR.CON LA ESTRUCTURA QUE SE PIDE. EL NOMBRE DEL EVENTO ES INPUTEXT
btnSend.addEventListener ( 'click', ()=> { 
            
    socket.emit( 'guardarProducto', { socketID: socket.id, titulo: titulo.value, precio: precio.value })
    titulo.value ='';
    precio.value = '';
    foto.value= '';
} 
)

socket.on ( 'ProductoActual', ListadeProductos => {
    productosRecibidos.innerHTML='';
    productosRecibidos.innerHTML=`<thead>
                                        <tr>
                                            <th>Producto</th>
                                            <th>Precio</th>
                                            <th>Imagen</th>
                                        </tr>
                                  </thead>`
    ListadeProductos.forEach( nuevoProd => {
        productosRecibidos.innerHTML += 
                `<tr>
                     <td>${nuevoProd.titulo}</td>
                     <td>$${nuevoProd.precio}</td>
                     <td>${nuevoProd.socketID}</td>
                </tr>`
    });
    
})

socket.on ( "Tabla de Productos", ListadeProductos => { renderizador ( ListadeProductos ) } )

socket.on ( "ID de mensaje", Arraymensajes=>{  MostrarMensajes ( Arraymensajes )  } )