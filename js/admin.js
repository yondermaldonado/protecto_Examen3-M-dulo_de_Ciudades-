// js/admin.js

document.getElementById('form-login')?.addEventListener('submit', (e) => {

    e.preventDefault();

    const email = document.getElementById('log-email').value;
    const pass = document.getElementById('log-pass').value;

    if (email === "admin@mail.com" && pass === "123456") {

        document.getElementById('login-block').classList.remove('active');
        document.getElementById('admin-dashboard').style.display = "block";
        mostrarDashboard();
        actualizarDashboard();
        inicializarMódulosDashboard();
        activarDashboardCards();

    } else {

        StorageManager.showAlert('Credenciales incorrectas', 'error');

    }

});

function inicializarMódulosDashboard() {

    configurarNavegacionTabs();

    renderizarTablaCategorias();
    renderizarTablaEventos();
    actualizarTablaVentasAdmin();
    cargarDesplegableCategorias();

    document.getElementById("close-sale").addEventListener("click", () => {

        document.getElementById("modal-sale").classList.remove("active");

    });

    document.getElementById("btn-add-cat").addEventListener("click", () => {

        abrirModalCategoria();

    });

    document.getElementById("btn-add-ev").addEventListener("click", () => {

        abrirModalEvento();

    });

    document
        .getElementById("form-category")
        .addEventListener("submit", guardarCategoria);

    document
        .getElementById("form-event")
        .addEventListener("submit", guardarEvento);

    document.querySelectorAll(".close-generic").forEach(boton => {

        boton.addEventListener("click", () => {

            document.getElementById("modal-cat").classList.remove("active");
            document.getElementById("modal-ev").classList.remove("active");

        });

    });

    document
        .getElementById("btn-logout")
        .addEventListener("click", () => {

            location.href = "index.html";

        });

}

function configurarNavegacionTabs() {

    const pestañas = document.querySelectorAll("#admin-nav a[data-target]");

    pestañas.forEach(pes => {

        pes.addEventListener("click", (e) => {

            pestañas.forEach(t => t.classList.remove("active"));

            document.querySelectorAll(".admin-section")
                .forEach(sec => sec.style.display = "none");

            e.target.classList.add("active");

            const target = e.target.dataset.target;

            document.getElementById(target).style.display = "block";

            if (target === "mod-ventas") {

                actualizarTablaVentasAdmin();

            }

        });

    });

}

/* ==========================================================================
   CRUD: CATEGORÍAS
   ========================================================================== */

function renderizarTablaCategorias() {

    const cats = StorageManager.get("categories");

    const tbody = document.querySelector("#table-categories tbody");

    if (!tbody) return;

    tbody.innerHTML = "";

    cats.forEach(c => {

        tbody.innerHTML += `
            <tr>

                <td data-label="Nombre">${c.name}</td>

                <td data-label="Descripción">${c.description}</td>

                <td data-label="Acciones">

                    <button
                        class="btn btn-secondary btn-edit-cat"
                        data-id="${c.id}">
                        Editar
                    </button>

                    <button
                        class="btn btn-primary btn-delete-cat"
                        data-id="${c.id}">
                        Eliminar
                    </button>

                </td>

            </tr>
        `;

    });

    tbody.querySelectorAll(".btn-edit-cat").forEach(btn => {

        btn.addEventListener("click", () => {

            abrirModalCategoria(btn.dataset.id);

        });

    });

    tbody.querySelectorAll(".btn-delete-cat").forEach(btn => {

        btn.addEventListener("click", () => {

            eliminarCategoria(btn.dataset.id);

        });

    });

}

function abrirModalCategoria(id = null) {

    document.getElementById("modal-cat").classList.add("active");

    if (id) {

        const cat = StorageManager
            .get("categories")
            .find(c => c.id === id);

        document.getElementById("cat-modal-title").textContent = "Editar Categoría";

        document.getElementById("cat-id").value = cat.id;
        document.getElementById("cat-name").value = cat.name;
        document.getElementById("cat-desc").value = cat.description;

    } else {

        document.getElementById("form-category").reset();

        document.getElementById("cat-modal-title").textContent = "Nueva Categoría";

        document.getElementById("cat-id").value = "";

    }

}

function guardarCategoria(e) {

    e.preventDefault();

    const id = document.getElementById("cat-id").value;
    const name = document.getElementById("cat-name").value;
    const description = document.getElementById("cat-desc").value;

    let lista = StorageManager.get("categories");

    if (id) {

        lista = lista.map(cat =>
            cat.id === id
                ? { id, name, description }
                : cat
        );

    } else {

        lista.push({

            id: "cat-" + Date.now(),

            name,

            description

        });

    }

    StorageManager.set("categories", lista);

    document.getElementById("modal-cat").classList.remove("active");

    renderizarTablaCategorias();

    cargarDesplegableCategorias();

    StorageManager.showAlert("Categoría guardada con éxito.");
    actualizarDashboard();

}

function eliminarCategoria(id) {

    mostrarConfirmacion(

        "¿Desea eliminar esta categoría?",

        () => {

            let lista = StorageManager
                .get("categories")
                .filter(c => c.id !== id);

            StorageManager.set("categories", lista);

            renderizarTablaCategorias();

            cargarDesplegableCategorias();

            StorageManager.showAlert("Categoría eliminada.");
            actualizarDashboard();
        }

    );


}
/* ==========================================================================
   CRUD: EVENTOS
   ========================================================================== */

function renderizarTablaEventos() {

    const eventos = StorageManager.get("events");

    const tbody = document.querySelector("#table-events tbody");

    if (!tbody) return;

    tbody.innerHTML = "";

    eventos.forEach(evento => {

        tbody.innerHTML += `
            <tr>

                <td data-label="Código">${evento.id}</td>

                <td data-label="Nombre">${evento.name}</td>

                <td data-label="Ciudad">${evento.city}</td>

                <td data-label="Precio">
                    $${evento.price.toLocaleString()}
                </td>

                <td data-label="Acciones">

                    <button
                        class="btn btn-secondary btn-edit-event"
                        data-id="${evento.id}">
                        Editar
                    </button>

                    <button
                        class="btn btn-primary btn-delete-event"
                        data-id="${evento.id}">
                        Eliminar
                    </button>

                </td>

            </tr>
        `;

    });

    tbody.querySelectorAll(".btn-edit-event").forEach(btn => {

        btn.addEventListener("click", () => {

            abrirModalEvento(btn.dataset.id);

        });

    });

    tbody.querySelectorAll(".btn-delete-event").forEach(btn => {

        btn.addEventListener("click", () => {

            eliminarEvento(btn.dataset.id);

        });

    });

}

function cargarDesplegableCategorias() {

    const selector = document.getElementById("ev-cat");

    if (!selector) return;

    selector.innerHTML = "";

    StorageManager.get("categories").forEach(cat => {

        selector.innerHTML += `
            <option value="${cat.id}">
                ${cat.name}
            </option>
        `;

    });

}

function abrirModalEvento(id = null) {

    document.getElementById("modal-ev").classList.add("active");

    const inputCodigo = document.getElementById("ev-code");
    const inputFecha = document.getElementById("ev-date");
    inputFecha.min = new Date().toISOString().split("T")[0];

    if (id) {

        const evento = StorageManager
            .get("events")
            .find(ev => ev.id === id);

        document.getElementById("ev-modal-title").textContent =
            "Modificar Evento";

        inputCodigo.value = evento.id;
        inputCodigo.disabled = true;

        document.getElementById("ev-name").value = evento.name;
        document.getElementById("ev-cat").value = evento.category;
        document.getElementById("ev-price").value = evento.price;
        document.getElementById("ev-date").value = evento.date;
        document.getElementById("ev-time").value = evento.time;
        document.getElementById("ev-city").value = evento.city;
        document.getElementById("ev-img").value = evento.image;
        document.getElementById("ev-desc").value = evento.description;

    } else {

        document.getElementById("form-event").reset();

        document.getElementById("ev-modal-title").textContent =
            "Gestionar Nuevo Evento";

        inputCodigo.disabled = false;

    }

}

function guardarEvento(e) {

    e.preventDefault();

    const id = document.getElementById("ev-code").value;

    let listaEventos = StorageManager.get("events");

    const datosEvento = {

        id,

        name: document.getElementById("ev-name").value,

        category: document.getElementById("ev-cat").value,

        price: parseInt(document.getElementById("ev-price").value),

        date: document.getElementById("ev-date").value,

        time: document.getElementById("ev-time").value,

        city: document.getElementById("ev-city").value,

        image: document.getElementById("ev-img").value,

        description: document.getElementById("ev-desc").value

    };

    const existe = listaEventos.some(ev => ev.id === id);

    if (document.getElementById("ev-code").disabled || existe) {

        listaEventos = listaEventos.map(ev =>
            ev.id === id
                ? datosEvento
                : ev
        );

    } else {

        listaEventos.push(datosEvento);

    }

    StorageManager.set("events", listaEventos);

    document.getElementById("modal-ev").classList.remove("active");

    renderizarTablaEventos();

    StorageManager.showAlert("Evento registrado en la cartelera.");
    actualizarDashboard();

}

function eliminarEvento(id) {

    mostrarConfirmacion(

        "¿Desea dar de baja este evento?",

        () => {

            const lista = StorageManager
                .get("events")
                .filter(ev => ev.id !== id);

            StorageManager.set("events", lista);

            renderizarTablaEventos();

            StorageManager.showAlert("Evento eliminado.");
            actualizarDashboard();
        }

    );

}
/* ==========================================================================
   TABLA DE VENTAS (LOCALSTORAGE)
   ========================================================================== */

function actualizarTablaVentasAdmin() {

    const tbody = document.querySelector("#table-sales tbody");

    if (!tbody) return;

    tbody.innerHTML = "";

    const ventas = StorageManager.get("sales");

    if (ventas.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center;">
                    No existen ventas registradas.
                </td>
            </tr>
        `;

        return;

    }

    const ventasOrdenadas = [...ventas].sort(
        (a, b) => b.timestamp - a.timestamp
    );

    ventasOrdenadas.forEach((venta, index) => {

        tbody.innerHTML += `
            <tr>

                <td>${venta.fecha}</td>

                <td>${venta.cliente.nombre}</td>

                <td>${venta.ciudad}</td>

                <td>$${venta.total.toLocaleString()}</td>

                <td>

                    <button
                        class="btn btn-secondary btn-sale-detail"
                        data-index="${index}">
                        Ver
                    </button>

                </td>

            </tr>
        `;

    });

    tbody.querySelectorAll(".btn-sale-detail").forEach(btn => {

        btn.addEventListener("click", () => {

            verDetalleVenta(Number(btn.dataset.index));

        });

    });

}

function verDetalleVenta(index) {

    const ventas = [...StorageManager.get("sales")].sort(
        (a, b) => b.timestamp - a.timestamp
    );

    const venta = ventas[index];

    if (!venta) return;

    let html = `
        <h3>Información del Cliente</h3>

        <p><strong>Nombre:</strong> ${venta.cliente.nombre}</p>

        <p><strong>Identificación:</strong> ${venta.cliente.identificacion}</p>

        <p><strong>Teléfono:</strong> ${venta.cliente.telefono}</p>

        <p><strong>Correo:</strong> ${venta.cliente.email}</p>

        <p><strong>Dirección:</strong> ${venta.cliente.direccion}</p>

        <hr>

        <h3>Información de la Compra</h3>

        <p><strong>Fecha:</strong> ${venta.fecha}</p>

        <p><strong>Ciudad:</strong> ${venta.ciudad}</p>

        <p><strong>Cantidad de tickets:</strong> ${venta.cantidad}</p>

        <hr>

        <h3>Eventos Comprados</h3>

        <table style="width:100%; border-collapse:collapse;">

            <thead>

                <tr>

                    <th>Evento</th>

                    <th>Ciudad</th>

                    <th>Precio</th>

                </tr>

            </thead>

            <tbody>
    `;

    venta.tickets.forEach(ticket => {

        html += `
            <tr>

                <td>${ticket.name}</td>

                <td>${ticket.city}</td>

                <td>$${ticket.price.toLocaleString()}</td>

            </tr>
        `;

    });

    html += `
            </tbody>

        </table>

        <hr>

        <h2 style="text-align:right;color:green;">

            Total: $${venta.total.toLocaleString()} COP

        </h2>
    `;

    document.getElementById("sale-detail-content").innerHTML = html;

    document.getElementById("modal-sale").classList.add("active");

}

/* ==========================================================================
   MODAL DE CONFIRMACIÓN
   ========================================================================== */

function mostrarConfirmacion(mensaje, accionAceptar) {

    document.getElementById("confirm-message").textContent = mensaje;

    document.getElementById("modal-confirm").classList.add("active");

    const btnCancelar = document.getElementById("confirm-cancel");
    const btnAceptar = document.getElementById("confirm-ok");

    const nuevoCancelar = btnCancelar.cloneNode(true);
    const nuevoAceptar = btnAceptar.cloneNode(true);

    btnCancelar.parentNode.replaceChild(nuevoCancelar, btnCancelar);
    btnAceptar.parentNode.replaceChild(nuevoAceptar, btnAceptar);

    nuevoCancelar.addEventListener("click", () => {

        document.getElementById("modal-confirm").classList.remove("active");

    });

    nuevoAceptar.addEventListener("click", () => {

        document.getElementById("modal-confirm").classList.remove("active");

        accionAceptar();

    });

}
function mostrarDashboard() {

    document.querySelectorAll(".admin-section").forEach(sec => {

        sec.style.display = "none";

    });

    document.getElementById("mod-dashboard").style.display = "block";

    document.querySelectorAll("#admin-nav a[data-target]").forEach(a => {

        a.classList.remove("active");

    });

    document.querySelector('[data-target="mod-dashboard"]').classList.add("active");

}
function actualizarDashboard() {

    document.querySelector("#dash-cat h1").textContent =
        StorageManager.get("categories").length;

    document.querySelector("#dash-event h1").textContent =
        StorageManager.get("events").length;

    const ventas = StorageManager.get("sales");

    const totalGanado = ventas.reduce((total, venta) => {

        return total + venta.total;

    }, 0);

    document.querySelector("#dash-sales h1").textContent =
        "$" + totalGanado.toLocaleString();

}
function activarDashboardCards() {

    document.querySelectorAll("dashboard-card").forEach(card => {

        card.addEventListener("click", () => {

            const destino = card.dataset.target;

            document.querySelectorAll(".admin-section").forEach(sec => {

                sec.style.display = "none";

            });

            document.getElementById(destino).style.display = "block";

            document.querySelectorAll("#admin-nav a[data-target]").forEach(a => {

                a.classList.remove("active");

            });

            document
                .querySelector(`[data-target="${destino}"]`)
                .classList.add("active");

            if (destino === "mod-ventas") {

                actualizarTablaVentasAdmin();

            }

        });

    });

}