document.addEventListener('DOMContentLoaded', function () {
    const formulario = document.getElementById('contactoForm');
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    if (formulario) {
        formulario.addEventListener('submit', handleSubmitForm);
    } else {
        console.error('No se encontró el formulario con id="contactoForm".');
    }

    function handleSubmitForm(event) {
        event.preventDefault();

        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const mensaje = document.getElementById('mensaje').value;

        if (!nombre || !email || !mensaje) {
            showAlert('Por favor, completa todos los campos.');
            return;
        }

        console.log(`Nombre: ${nombre}, Email: ${email}, Mensaje: ${mensaje}`);
        showAlert('¡Gracias por contactarnos!');
        formulario.reset();
    }

    function showAlert(message) {
        alert(message);
    }

    function actualizarCarrito() {
        const carritoLista = document.getElementById('carrito');
        const total = document.getElementById('total');
        carritoLista.innerHTML = '';
        let totalPrecio = 0;

        carrito.forEach((producto, index) => {
            const li = document.createElement('li');
            li.classList.add('list-group-item');
            li.innerHTML = `${producto.nombre} - $${producto.precio.toFixed(2)} <button class="eliminarProducto" data-index="${index}">Eliminar</button>`;
            carritoLista.appendChild(li);
            totalPrecio += producto.precio;
        });

        total.textContent = `$${totalPrecio.toFixed(2)}`;
        agregarEventosEliminar();
        mostrarBotonTerminarCompra();
    }

    function agregarEventosEliminar() {
        const botonesEliminar = document.querySelectorAll('.eliminarProducto');
        botonesEliminar.forEach(boton => {
            boton.addEventListener('click', eliminarProducto);
        });
    }

    function mostrarBotonTerminarCompra() {
        const botonTerminarCompra = document.getElementById('terminarCompra');
        if (botonTerminarCompra) {
            if (carrito.length > 0) {
                botonTerminarCompra.style.display = 'block';
                botonTerminarCompra.disabled = false;
                botonTerminarCompra.addEventListener('click', finalizarCompra);
            } else {
                botonTerminarCompra.style.display = 'none';
                botonTerminarCompra.disabled = true;
            }
        }
    }

    function agregarAlCarrito(event) {
        const boton = event.target;
        const id = boton.getAttribute('data-id');
        const nombre = boton.getAttribute('data-nombre');
        const precio = parseFloat(boton.getAttribute('data-precio'));

        const productoExistente = carrito.find(producto => producto.id === id);
        if (productoExistente) {
            showAlert(`El producto "${nombre}" ya está en el carrito.`);
            return;
        }

        const producto = { id, nombre, precio };
        carrito.push(producto);
        localStorage.setItem('carrito', JSON.stringify(carrito));
        actualizarCarrito();

        mostrarMensajeAgregado(nombre);
    }

    function eliminarProducto(event) {
        const index = event.target.getAttribute('data-index');
        carrito.splice(index, 1);
        localStorage.setItem('carrito', JSON.stringify(carrito));
        actualizarCarrito();
    }

    function finalizarCompra() {
        showAlert('¡Su compra o reserva se ha realizado con éxito!');
        localStorage.removeItem('carrito');
        carrito.length = 0;
        actualizarCarrito();
        console.log('Carrito reiniciado:', carrito);
    }

    function mostrarMensajeAgregado(nombreProducto) {
        const mensaje = document.createElement('div');
        mensaje.classList.add('mensaje-agregado');
        mensaje.textContent = `El producto "${nombreProducto}" ha sido agregado al carrito.`;
        document.body.appendChild(mensaje);

        setTimeout(() => {
            mensaje.remove();
        }, 3000);
    }

    const botonesAgregar = document.querySelectorAll('.agregarCarrito');
    botonesAgregar.forEach(boton => {
        boton.addEventListener('click', agregarAlCarrito);
    });

    actualizarCarrito();
});

