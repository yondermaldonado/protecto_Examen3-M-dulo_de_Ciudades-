// js/storage.js

const StorageManager = {

    init() {

        // Categorías
        if (!localStorage.getItem('categories')) {
            localStorage.setItem(
                'categories',
                JSON.stringify(initialCategories)
            );
        }

        // Eventos
        if (!localStorage.getItem('events')) {
            localStorage.setItem(
                'events',
                JSON.stringify(initialEvents)
            );
        }

        // Carrito
        if (!localStorage.getItem('cart')) {
            localStorage.setItem(
                'cart',
                JSON.stringify([])
            );
        }

        // Ventas
        if (!localStorage.getItem('sales')) {
            localStorage.setItem(
                'sales',
                JSON.stringify([])
            );
        }

        // Ciudades
        if (!localStorage.getItem("cities")) {

            localStorage.setItem(
                "cities",
                JSON.stringify([])
            );
        
        }

    },

    get(key) {

        return JSON.parse(localStorage.getItem(key)) || [];

    },

    set(key, data) {

        localStorage.setItem(
            key,
            JSON.stringify(data)
        );

    },

    registrarNuevaVenta(nuevaVenta) {

        const ventas = this.get('sales');

        ventas.push(nuevaVenta);

        this.set('sales', ventas);

    },

    limpiarCarrito() {

        this.set('cart', []);

    },

    limpiarVentas() {

        this.set('sales', []);

    },

    limpiarTodo() {

        localStorage.removeItem('categories');
        localStorage.removeItem('events');
        localStorage.removeItem('cart');
        localStorage.removeItem('sales');

        this.init();

    },
    showAlert(message, type = "success") {

        const toast = document.getElementById("toast");
    
        if(!toast){
            return;
        }
    
        toast.className = "toast";
    
        toast.classList.add(type);
    
        let icono = "";
    
        switch(type){
    
            case "success":
                icono = "✔ ";
                break;
    
            case "error":
                icono = "✖ ";
                break;
    
            case "info":
                icono = "ℹ ";
                break;
    
            default:
                icono = "";
        }
    
        toast.innerHTML = icono + message;
    
        toast.classList.add("show");
    
        clearTimeout(this.toastTimer);
    
        this.toastTimer = setTimeout(()=>{
    
            toast.classList.remove("show");
    
        },3000);
    
    }

};

// Inicializar LocalStorage
StorageManager.init();