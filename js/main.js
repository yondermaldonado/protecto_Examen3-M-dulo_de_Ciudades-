// js/main.js 

let carrito = StorageManager.get('cart');

document.addEventListener('DOMContentLoaded', () => {

    cargarCategoriasFiltro();

    renderizarVitrinaEventos();

    // Filtros

    document
        .getElementById('search-input')
        ?.addEventListener('input', renderizarVitrinaEventos);

    document
        .getElementById('filter-ciudad')
        ?.addEventListener('change', renderizarVitrinaEventos);

    document
        .getElementById('filter-categoria')
        ?.addEventListener('change', renderizarVitrinaEventos);

    // Modales

    document
        .getElementById('ver-carrito')
        ?.addEventListener('click', () => {

            abrirCerrarModal('modal-carrito', true);

        });

    document
        .getElementById('close-carrito')
        ?.addEventListener('click', () => {

            abrirCerrarModal('modal-carrito', false);

        });

    document
        .getElementById('close-detalle')
        ?.addEventListener('click', () => {

            abrirCerrarModal('modal-detalle', false);

        });

    // Compra

    document
        .getElementById('form-compra')
        ?.addEventListener('submit', procesarCompraCliente);

    // Restaurar carrito

    document.getElementById('cart-count').innerText = carrito.length;

    actualizarVistaModalCarrito();

});

function cargarCategoriasFiltro() {

    const select = document.getElementById('filter-categoria');

    if (!select) return;

    const categorias = StorageManager.get('categories');

    categorias.forEach(cat => {

        select.innerHTML += `
            <option value="${cat.id}">
                ${cat.name}
            </option>
        `;

    });

}

function renderizarVitrinaEventos() {

    const contenedor = document.getElementById('eventos-container');

    if (!contenedor) return;

    const eventos = StorageManager.get('events');

    const categorias = StorageManager.get('categories');

    const textoBuscado =
        document.getElementById('search-input').value.toLowerCase();

    const ciudadSeleccionada =
        document.getElementById('filter-ciudad').value;

    const categoriaSeleccionada =
        document.getElementById('filter-categoria').value;

    contenedor.innerHTML = "";

    const eventosFiltrados = eventos.filter(ev => {

        const coincideNombre =
            ev.name.toLowerCase().includes(textoBuscado);

        const coincideCiudad =
            ciudadSeleccionada === "" ||
            ev.city === ciudadSeleccionada;

        const coincideCategoria =
            categoriaSeleccionada === "" ||
            ev.category === categoriaSeleccionada;

        return (
            coincideNombre &&
            coincideCiudad &&
            coincideCategoria
        );

    });

    eventosFiltrados.forEach(ev => {

        const categoria = categorias.find(c => c.id === ev.category);

        const card = document.createElement("event-card");

        card.setAttribute("event-id", ev.id);
        card.setAttribute("name", ev.name);
        card.setAttribute("price", ev.price);
        card.setAttribute("date", ev.date);
        card.setAttribute("city", ev.city);
        card.setAttribute("image", ev.image);
        card.setAttribute(
            "category-name",
            categoria ? categoria.name : "Evento"
        );

        contenedor.appendChild(card);

    });

    enlazarBotonesTarjetas();

}

function enlazarBotonesTarjetas() {

    document.querySelectorAll(".btn-comprar").forEach(btn => {

        btn.addEventListener("click", (e) => {

            añadirAlCarrito(
                e.currentTarget.dataset.id
            );

        });

    });

    document.querySelectorAll(".btn-ver").forEach(btn => {

        btn.addEventListener("click", (e) => {

            verFichaDetalle(
                e.currentTarget.dataset.id
            );

        });

    });

}
/* ==========================================================================
   CARRITO DE COMPRAS
   ========================================================================== */

function añadirAlCarrito(id) {

    const evento = StorageManager
        .get("events")
        .find(e => e.id === id);

    carrito.push(evento);

    StorageManager.set("cart", carrito);

    document.getElementById("cart-count").innerText = carrito.length;

    StorageManager.showAlert(`"${evento.name}" añadido al carrito.`);

    actualizarVistaModalCarrito();

}

function eliminarDelCarrito(index) {

    carrito.splice(index, 1);

    StorageManager.set("cart", carrito);

    document.getElementById("cart-count").innerText = carrito.length;

    actualizarVistaModalCarrito();

}

function actualizarVistaModalCarrito() {

    const contenedorItems = document.getElementById("carrito-items");

    if (!contenedorItems) return;

    contenedorItems.innerHTML = "";

    let total = 0;

    carrito.forEach((item, index) => {

        total += item.price;

        contenedorItems.innerHTML += `

            <div
                style="
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    margin-bottom:8px;
                    border-bottom:1px dashed #ddd;
                    padding-bottom:6px;
                ">

                <div>

                    <strong>${item.name}</strong><br>

                    <small>${item.city}</small>

                </div>

                <div style="text-align:right;">

                    <strong>$${item.price.toLocaleString()}</strong><br>

                    <button
                        class="btn-eliminar-carrito"
                        data-index="${index}"
                        style="
                            margin-top:5px;
                            padding:4px 8px;
                            cursor:pointer;
                        ">

                        ❌

                    </button>

                </div>

            </div>

        `;

    });

    document.getElementById("carrito-total").innerText =
        `$${total.toLocaleString()} COP`;

    document
        .querySelectorAll(".btn-eliminar-carrito")
        .forEach(btn => {

            btn.addEventListener("click", (e) => {

                eliminarDelCarrito(

                    Number(e.currentTarget.dataset.index)

                );

            });

        });

}
/* ==========================================================================
   DETALLE DEL EVENTO
   ========================================================================== */

function verFichaDetalle(id) {

    const ev = StorageManager
        .get("events")
        .find(e => e.id === id);

    const contenido = document.getElementById("detalle-content");

    if (!contenido) return;

    contenido.innerHTML = `

        <img
            src="${ev.image}"
            style="
                width:100%;
                max-height:280px;
                object-fit:cover;
                border-radius:8px;
            ">

        <h2
            style="
                margin:12px 0;
                color:var(--secondary-color);
            ">
            ${ev.name}
        </h2>

        <p
            style="
                color:#555;
                line-height:1.5;
            ">
            ${ev.description}
        </p>

        <p>
            <strong>📍 Ciudad:</strong>
            ${ev.city}
        </p>

        <p>
            <strong>📅 Fecha:</strong>
            ${ev.date}
        </p>

        <p>
            <strong>🕒 Hora:</strong>
            ${ev.time}
        </p>

        <h3
            style="
                color:var(--primary-color);
                margin-top:15px;
            ">
            $${ev.price.toLocaleString()} COP
        </h3>

    `;

    abrirCerrarModal("modal-detalle", true);

}

/* ==========================================================================
   PROCESAR COMPRA
   ========================================================================== */

function procesarCompraCliente(e) {

    e.preventDefault();

    if (carrito.length === 0) {

        StorageManager.showAlert(
            "El carrito está vacío.",
            "error"
        );

        return;

    }

    const total = carrito.reduce(

        (suma, item) => suma + item.price,

        0

    );

    const venta = {

        id: "VEN-" + Date.now(),

        fecha: new Date().toLocaleDateString("es-CO"),

        timestamp: Date.now(),

        ciudad: carrito[0].city,

        cliente: {

            identificacion:
                document.getElementById("cli-id").value,

            nombre:
                document.getElementById("cli-nombre").value,

            direccion:
                document.getElementById("cli-direccion").value,

            telefono:
                document.getElementById("cli-telefono").value,

            email:
                document.getElementById("cli-email").value

        },

        tickets: [...carrito],

        cantidad: carrito.length,

        total

    };

    StorageManager.registrarNuevaVenta(venta);

    StorageManager.showAlert(
        "¡Compra realizada con éxito!"
    );

    if (typeof actualizarTablaVentasAdmin === "function") {

        actualizarTablaVentasAdmin();

    }

    if (typeof actualizarDashboard === "function") {

        actualizarDashboard();

    }

    carrito = [];

    StorageManager.set("cart", []);

    document.getElementById("cart-count").innerText = "0";

    actualizarVistaModalCarrito();

    document.getElementById("form-compra").reset();

    abrirCerrarModal(
        "modal-carrito",
        false
    );

}

/* ==========================================================================
   MODALES
   ========================================================================== */

function abrirCerrarModal(id, visible) {

    document
        .getElementById(id)
        ?.classList.toggle("active", visible);

}