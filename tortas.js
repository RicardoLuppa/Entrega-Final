let carritoArray = JSON.parse(localStorage.getItem("carrito")) ?? [];
let inputTexto
let div1 = document.getElementById('div1')
let div2 = document.getElementById("div2")
let div3 = document.getElementById("div3")
let div4 = document.getElementById("div4")
let div5 = document.querySelector('#div5')
let div6 = document.getElementById("div6")

//Primer card de bienvenida
const bienvenida = () => {
    
    div1.innerHTML +=
    `
        <center>
            <div class="card" style="width: 18rem;">
                <div class="card-body">
                    <h2 class="card-title">¡Bienvenidx al portal web de <b>Misky Nuna Reposteria Artesanal!</b></h2>
                    <label for="name">Ingrese su nombre:</label>
                    <input type="text" id="nombreUsuario">
                </div>
            </div>
        </center>
    `
        let inputTexto = document.getElementById('nombreUsuario')
        inputTexto.addEventListener('change', () => {
        let saludo = document.createElement('h1')
        saludo.innerText = `Bienvenidx ${inputTexto.value}!`
        div2.prepend(saludo);
        div1.remove()
    })
}
bienvenida()

//Despliegue de cards
const seleccion = () => {
 
    fetch("scriptContainer.json")
    .then(response => response.json())
    .then(tortas => {
    tortas.forEach((tortasjson)=> {

        let {id, nombre, precio, tiempoPrep, ingrPri} = tortasjson;        
        div3.innerHTML +=
        `
        <div class="card" style="margin: 2rem; padding">
            <div  class="card-body">
                <h2 class="card-title">${nombre}</h2>
                <p>Precio: <b>$${precio} c/u</b></p>
                <p>Tiempo de Produccion: <b>${tiempoPrep} días</b></p>
                <p>Ingrediente Principal: <b>${ingrPri}</b></p>
                <button type="button" id= "botoncito${id}" class="btn btn-info">Agregar al carrito</button>
            </div>
        </div>
        `
    }) //Enviar al carrito
    tortas.forEach((e) => {
        document.getElementById(`botoncito${e.id}`)
            .addEventListener('click',()=>{
                let indexCarritoArray = carritoArray.findIndex((productoCarritoArray) => {
                    return parseInt(productoCarritoArray.id) === parseInt(e.id);
                    })
                    if (indexCarritoArray !=-1 ) { 
                            carritoArray [indexCarritoArray].cantidad ++;
                    } else {
                        e.cantidad = 1                        
                        carritoArray.push(e);
                    }
                    localStorage.setItem('carrito', JSON.stringify(carritoArray))
                    console.log(carritoArray)
                    toastify(e)
            })
        })
    })
}

//toastify
const toastify = (e)=>{

    document.getElementById(`botoncito${e.id}`).addEventListener('click',()=>{
        Toastify({
            text: "¡Producto agregado!",
            duration: 2000,
            close: true,
            gravity: "top",
            position: "left",
            stopOnFocus: true,
            style: {
            background: "white-blue",
            },
            onClick: function () { }
        }).showToast();
})}
seleccion()

//MOSTRAR CARRITO
const botonCarrito = ()=> {

    let mostrarCarrito = document.querySelector('#div4').innerHTML +=
        `
            <button id= "mostrarCarrito" type="button" class="btn btn-primary">Mostrar Carrito</button>
            <br></br>
        `;

    let carritoAbierto = document.getElementById("mostrarCarrito").addEventListener("click", () => {        

    carritoArray.forEach((e) => {
    const {nombre, precio, cantidad} = e;
        div5.innerHTML +="";
        div5.innerHTML +=
        `
        <br>
        <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header">
            </div>
                <div class="toast-body">
                <h4 class="card-title">${nombre}</h4>
                <p class="card-text">$${precio} c/u</p>
                <p class="card-text">Cantidad: ${cantidad}</p>
                <p id= "precioFinal" class="card-text">$${precioTotal(precio,cantidad)}</p
                </div>
        </div>
        `
        })

        finalizarCompra()
        div4.remove()
    })
}
botonCarrito()



//ultimo boton y limpieza del html
const finalizarCompra = ()=> {

    document.querySelector('#div6').innerHTML = 
    `
        <br></br>
        <button id= "finalizarCompra" type="button" class="btn btn-primary">Finalizar Compra</button>
        <br></br>
    `;

    document.getElementById("finalizarCompra").addEventListener("click",()=> {
        div5.remove()
        div6.remove()
        div3.remove()
        div1.remove()
        cardFinal()
    }) 
}

// Card Resumen de Compras   
const cardFinal = ()=> {

    let acumulador = 0;

    document.body.innerHTML +=
        `
        <center>
            <br></br>
            <h2 class="card-text"><b>Resumen de Compra</b></h2>
            <hr size="8px" color="black" />
        </center>
        `
    carritoArray.forEach( e => {

        const {nombre, precio, cantidad} = e; 
        acumulador += precio * cantidad;
        document.body.innerHTML +=
        `
        <center>
            <p class="card-text">${nombre}<br>$${precioTotal(precio,cantidad)}<br>Cant: ${cantidad}</p>
            <hr size="8px" color="black" />          
        </center>
        `
    })
    document.body.innerHTML +=
        `
        <center>
            <h3>Total: $${acumulador}</h3>
            <h6>¡Muchas gracias por su compra!</h6>
        </center>
        <br>
        `
    localStorage.removeItem('carrito')   
}

// Funcionalidades
function precioTotal (precio, cantidad) {
        return    precio * cantidad 
}