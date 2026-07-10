// js/data-seed.js

const initialCategories = [
    { id: "cat-1", name: "Conciertos", description: "Festivales y eventos musicales en vivo" },
    { id: "cat-2", name: "Deportes", description: "Torneos, partidos y encuentros athletic" },
    { id: "cat-3", name: "Sorteos", description: "Rifas y actividades pro-fondos" }
];

const initialEvents = [
    {
        id: "EV-001",
        name: "Festival de Música Urbana",
        category: "cat-1",
        price: 45000,
        date: "2026-10-15",
        time: "19:00",
        city: "Cúcuta",
        image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=500",
        description: "El festival más grande del año con artistas internacionales en el Estadio General Santander."
    },
    {
        id: "EV-002",
        name: "Gran Torneo de Fútbol Local",
        category: "cat-2",
        price: 15000,
        date: "2026-10-22",
        time: "14:00",
        city: "Bucaramanga",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbhUgaeOT0vZpNDWkZ7hUXxGHExtuFdePUvMb_wPN9RQ&s=10",
        description: "Apoya a tu equipo local en las canchas profesionales de la región."
    },
    {
        id: "EV-003",
        name: "Rifa Pro-Fondos Tecnológicos",
        category: "cat-3",
        price: 10000,
        date: "2026-11-05",
        time: "17:00",
        city: "Bogotá",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbLYigZX5usi6zP1Evf1tIwXzKQ487Btg4vwkGN0tWeOZABpkxk1734Jyk&s=10",
        description: "Sorteo de una Laptop Gamer de última generación con kit completo de accesorios."
    }
];