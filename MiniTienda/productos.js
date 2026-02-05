
let carrito = []; // aqui guardamos los productos seleccionados

const productosJSON = `[
  {
    "id": "TSH01",
    "nombre": "MACACARENA",
    "descripcion": "Quan balles sense vergonya i el ritme et domina.",
    "precioBase": 19.95,
    "tallas": ["S", "M", "L", "XL"],
    "colores": ["blanco", "negro", "mostaza"],
    "imagenes": {
      "blanco": "img/MACACARENA.png",
      "negro": "img/MACACARENA_BLACK.png",
      "mostaza": "img/MACACARENA.png"
    },
    "tags": ["nuevo"]
  },
  {
    "id": "TSH02",
    "nombre": "NINETIES MODE",
    "descripcion": "Un homenatge pixelat als anys 90.",
    "precioBase": 21.50,
    "tallas": ["S", "M", "L", "XL", "XXL"],
    "colores": ["gris", "negro"],
    "imagenes": {
      "gris": "img/NINETIES.png",
      "negro": "img/NINETIES_BLACK.png"
    },
    "tags": ["retro"]
  },
  {
    "id": "TSH03",
    "nombre": "RESERVOIR INVADERS",
    "descripcion": "Quan Tarantino coneix els videojocs clàssics.",
    "precioBase": 22.90,
    "tallas": ["M", "L", "XL"],
    "colores": ["azul", "negro"],
    "imagenes": {
      "azul": "img/RESERVOIR.png",
      "negro": "img/RESERVOIR_BLACK.png"
    },
    "tags": ["edicion-especial"]
  },
  {
    "id": "TSH04",
    "nombre": "VITRUVIAN CODE",
    "descripcion": "Art, codi i proporció perfecta.",
    "precioBase": 24.00,
    "tallas": ["S", "M", "L", "XL"],
    "colores": ["blanco", "negro"],
    "imagenes": {
      "blanco": "img/VITRUVIAN.png",
      "negro": "img/VITRUVIAN_BLACK.png"
    },
    "tags": ["premium"]
  }
]`;

function init() {
    const listaProductos = JSON.parse(productosJSON);
    muestraProductos(listaProductos);
}

function muestraProductos(productos) {
    const contenedor = document.getElementById('contenedor-productos');
    contenedor.innerHTML = '';

    productos.forEach(producto => {
        const articleProducto = crearCardProducto(producto);
        contenedor.appendChild(articleProducto);
    });
}


function crearCardProducto(producto) {
    const article = document.createElement('article');
    article.classList.add('producto-card');

    article.appendChild(crearTitulo(producto.nombre));

    const colorDefault = Object.keys(producto.imagenes)[0];
    article.appendChild(crearImagen(producto.imagenes[colorDefault], producto.nombre));
    
    article.appendChild(crearDescripcion(producto.descripcion));
    
    // Precio
    article.appendChild(crearPrecio(producto.precioBase));

    // Contenedor para Controles 
    const divControles = document.createElement('div');
    divControles.classList.add('controles-compra');

    // Referencias a los inputs 
    const inputCantidad = crearInputCantidad();
    const selectTalla = crearSelectorTallas(producto.tallas);

    divControles.appendChild(inputCantidad);
    divControles.appendChild(selectTalla);
    article.appendChild(divControles);

    // Botón de compra 
    const boton = crearBotonCompra(producto, inputCantidad, selectTalla);
    article.appendChild(boton);

    return article;
}


function crearTitulo(texto) {
    const h3 = document.createElement('h3');
    h3.textContent = texto;
    h3.classList.add('producto-titulo');
    return h3;
}

function crearImagen(src, alt) {
    const img = document.createElement('img');
    img.src = src;
    img.alt = `Camiseta ${alt}`;
    img.classList.add('producto-imagen');
    return img;
}

function crearDescripcion(texto) {
    const p = document.createElement('p');
    p.textContent = texto;
    p.classList.add('producto-descripcion');
    return p;
}

function crearPrecio(precio) {
    const p = document.createElement('p');
    p.textContent = `€${precio.toFixed(2)}`;
    p.classList.add('producto-precio');
    return p;
}

function crearSelectorTallas(tallas) {
    const select = document.createElement('select');
    select.classList.add('selector-talla');
    tallas.forEach(talla => {
        const option = document.createElement('option');
        option.value = talla;
        option.textContent = talla;
        select.appendChild(option);
    });
    return select;
}

function crearInputCantidad() {
    const input = document.createElement('input');
    input.type = 'number';
    input.min = '1';
    input.value = '1';
    input.classList.add('input-cantidad');
    return input;
}

function crearBotonCompra(productoObj, inputCantidadRef, selectTallaRef) {
    const btn = document.createElement('button');
    btn.textContent = 'Añadir al Carrito';
    btn.classList.add('btn-comprar');
    
    btn.addEventListener('click', function() {
        const cantidad = parseInt(inputCantidadRef.value);
        const talla = selectTallaRef.value;

        if (cantidad > 0) {
            agregarAlCarrito(productoObj, cantidad, talla);
        } else {
            alert("Por favor, selecciona una cantidad válida.");
        }
    });

    return btn;
}

function agregarAlCarrito(producto, cantidad, talla) {
    const indiceExistente = carrito.findIndex(item => item.id === producto.id && item.talla === talla);

    if (indiceExistente > -1) {
        carrito[indiceExistente].cantidad += cantidad;
    } else {
        
        const nuevoItem = {
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precioBase,
            talla: talla,
            cantidad: cantidad
        };
        carrito.push(nuevoItem);
    }

    
    pintarTicket();
}

function pintarTicket() {
    const contenedorLista = document.getElementById('lista-ticket');
    const contenedorTotal = document.getElementById('total-ticket');
    

    contenedorLista.innerHTML = '';

    let totalCuenta = 0;

    if (carrito.length === 0) {
        contenedorLista.innerHTML = '<p>El carrito está vacío.</p>';
        contenedorTotal.textContent = 'Total: €0.00';
        return;
    }
    
    carrito.forEach(item => {
        const subtotal = item.cantidad * item.precio;
        totalCuenta += subtotal;

        const lineaTicket = document.createElement('div');
        lineaTicket.classList.add('item-ticket');
        
        lineaTicket.innerHTML = `
            <span>${item.cantidad} x ${item.nombre} [${item.talla}]</span>
            <span>€${subtotal.toFixed(2)}</span>
        `;
        contenedorLista.appendChild(lineaTicket);
    });

    contenedorTotal.textContent = `Total: €${totalCuenta.toFixed(2)}`;
}