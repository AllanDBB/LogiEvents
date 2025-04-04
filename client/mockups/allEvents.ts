import type { Event } from "@/models/event";


const allEvents: Event[] = [
  {
    id: "1",
    name: "Fiesta",
    description: "Gran fiesta en la playa con musica en vivo y juegos",
    image: "",
    category: "Ocio",
    date: "Domingo, 23 feb",
    hour: "08:00 AM",
    location: "Liberia, Guanacaste",
    availableSpots: 4
  },
  {
    id: "2",
    name: "Concierto Rock",
    description: "Los mejores grupos de rock nacional e internacional",
    image: "",
    category: "Música",
    date: "Sabado, 15 mar",
    hour: "19:30 PM",
    location: "San Jose, Estadio Nacional",
    availableSpots: 120
  },
  {
    id: "3",
    name: "Exposicion de Arte",
    description: "Obras de artistas contemporaneos de todo el mundo",
    image: "https://www.kasandbox.org/programming-images/avatars/leaf-green.png",
    category: "Exhibición",
    date: "Viernes, 10 abr",
    hour: "10:00 AM",
    location: "Museo Nacional, San Jose",
    availableSpots: 50
  },
  {
    id: "4",
    name: "Maraton Ciudad",
    description: "Carrera anual de 10k y media maraton",
    image: "",
    category: "Deportes",
    date: "Domingo, 05 may",
    hour: "06:00 AM",
    location: "Parque Metropolitano, San Jose",
    availableSpots: 200
  },  
  {
    id: "5",
    name: "Conferencia Tech",
    description: "Ultimas tendencias en desarrollo de software",
    image: "https://www.kasandbox.org/programming-images/avatars/leaf-orange.png",
    category: "Tecnología",
    date: "Jueves, 18 jun",
    hour: "14:00 PM",
    location: "Centro de Convenciones, Heredia",
    availableSpots: 15
  },
  {
    id: "6",
    name: "Taller de Cocina",
    description: "Aprende a cocinar platos internacionales",
    image: "",
    category: "Gastronomía",
    date: "Miercoles, 20 jul",
    hour: "17:00 PM",
    location: "Centro Gastronómico, Escazu",
    availableSpots: 8
  },
  {
    id: "7",
    name: "Festival de Cine",
    description: "Proyecciones de peliculas independientes",
    image: "https://www.kasandbox.org/programming-images/avatars/leaf-green.png",
    category: "Entretenimiento",
    date: "Lunes, 12 ago",
    hour: "19:00 PM",
    location: "Cine Magaly, San Jose",
    availableSpots: 30
  },
  {
    id: "8",
    name: "Torneo de Futbol",
    description: "Competencia entre equipos locales",
    image: "https://www.kasandbox.org/programming-images/avatars/leaf-red.png",
    category: "Deportes",
    date: "Sábado, 21 mar",
    hour: "09:00 AM",
    location: "Estadio Saprissa, San Jose",
    availableSpots: 16
  },
  {
    id: "9",
    name: "Exposición de Tecnología",
    description: "Avances más recientes en gadgets y software",
    image: "https://www.kasandbox.org/programming-images/avatars/leaf-green.png",
    category: "Tecnología",
    date: "Miércoles, 25 jun",
    hour: "10:00 AM",
    location: "Centro de Exposiciones, San Jose",
    availableSpots: 100
  },
  {
    id: "10",
    name: "Curso de Programación",
    description: "Aprende a programar en Python desde cero",
    image: "https://www.kasandbox.org/programming-images/avatars/leaf-yellow.png",
    category: "Educación",
    date: "Lunes, 30 mar",
    hour: "09:00 AM",
    location: "Universidad Tecnológica, San Jose",
    availableSpots: 25
  },
  {
    id: "11",
    name: "Conferencia de Marketing Digital",
    description: "Tendencias de marketing en la era digital",
    image: "https://www.kasandbox.org/programming-images/avatars/leaf-orange.png",
    category: "Tecnología",
    date: "Viernes, 10 may",
    hour: "13:00 PM",
    location: "Auditorio Nacional, San Jose",
    availableSpots: 30
  },
  {
    id: "12",
    name: "Festival Gastronómico",
    description: "Comida internacional en un solo lugar",
    image: "https://www.kasandbox.org/programming-images/avatars/leaf-green.png",
    category: "Gastronomía",
    date: "Sábado, 25 jun",
    hour: "11:00 AM",
    location: "Parque La Sabana, San Jose",
    availableSpots: 50
  },
  {
    id: "13",
    name: "Feria de Ciencia y Tecnología",
    description: "Demostraciones de proyectos científicos innovadores",
    image: "https://www.kasandbox.org/programming-images/avatars/leaf-green.png",
    category: "Exhibición",
    date: "Jueves, 05 abr",
    hour: "09:00 AM",
    location: "Museo de los Niños, San Jose",
    availableSpots: 20
  },
  {
    id: "14",
    name: "Torneo de Ajedrez",
    description: "Competencia de ajedrez entre escuelas",
    image: "https://www.kasandbox.org/programming-images/avatars/leaf-red.png",
    category: "Juegos",
    date: "Domingo, 22 may",
    hour: "10:00 AM",
    location: "Teatro Melico Salazar, San Jose",
    availableSpots: 50
  },
  {
    id: "15",
    name: "Curso de Fotografía",
    description: "Aprende fotografía profesional desde cero",
    image: "https://www.kasandbox.org/programming-images/avatars/leaf-purple.png",
    category: "Educación",
    date: "Martes, 01 jul",
    hour: "18:00 PM",
    location: "Centro Cultural, San Jose",
    availableSpots: 25
  },
  {
    id: "16",
    name: "Encuentro Cultural",
    description: "Rituales, danza y comida típica de Costa Rica",
    image: "https://www.kasandbox.org/programming-images/avatars/leaf-green.png",
    category: "Cultura",
    date: "Viernes, 17 abr",
    hour: "19:00 PM",
    location: "Teatro Nacional, San Jose",
    availableSpots: 80
  },
  {
    id: "17",
    name: "Conferencia de Blockchain",
    description: "Todo sobre el futuro de la tecnología blockchain",
    image: "https://www.kasandbox.org/programming-images/avatars/leaf-green.png",
    category: "Tecnología",
    date: "Martes, 28 may",
    hour: "10:00 AM",
    location: "Centro de Convenciones, San Jose",
    availableSpots: 50
  },
  {
    id: "18",
    name: "Fiesta de Año Nuevo",
    description: "Celebra el inicio del 2024 con amigos y familia",
    image: "https://www.kasandbox.org/programming-images/avatars/leaf-red.png",
    category: "Ocio",
    date: "Martes, 31 dic",
    hour: "10:00 PM",
    location: "Plaza de la Democracia, San Jose",
    availableSpots: 500
  },
  {
    id: "19",
    name: "Festival de Jazz",
    description: "Los mejores músicos de jazz del mundo",
    image: "https://www.kasandbox.org/programming-images/avatars/leaf-yellow.png",
    category: "Música",
    date: "Sábado, 22 jun",
    hour: "17:00 PM",
    location: "Teatro Nacional, San Jose",
    availableSpots: 60
  },
  {
    id: "20",
    name: "Ruta de Senderismo",
    description: "Explora los paisajes naturales de Costa Rica",
    image: "https://www.kasandbox.org/programming-images/avatars/leaf-orange.png",
    category: "Deportes",
    date: "Domingo, 12 may",
    hour: "07:00 AM",
    location: "Volcán Arenal, Guanacaste",
    availableSpots: 30
  },
  {
    id: "21",
    name: "Evento de Yoga",
    description: "Sesiones de yoga para todos los niveles",
    image: "https://www.kasandbox.org/programming-images/avatars/leaf-green.png",
    category: "Deportes",
    date: "Sábado, 19 abr",
    hour: "08:00 AM",
    location: "Parque La Sabana, San Jose",
    availableSpots: 40
  },
  {
    id: "22",
    name: "Clases de Salsa",
    description: "Aprende a bailar salsa con los mejores instructores",
    image: "https://www.kasandbox.org/programming-images/avatars/leaf-green.png",
    category: "Ocio",
    date: "Lunes, 22 abr",
    hour: "19:00 PM",
    location: "Teatro Melico Salazar, San Jose",
    availableSpots: 25
  },
  {
    id: "23",
    name: "Feria de Emprendedores",
    description: "Exposición de productos locales e innovadores",
    image: "https://www.kasandbox.org/programming-images/avatars/leaf-red.png",
    category: "Exhibición",
    date: "Domingo, 07 abr",
    hour: "10:00 AM",
    location: "Parque La Sabana, San Jose",
    availableSpots: 100
  },
  {
    id: "24",
    name: "Torneo de Basketball",
    description: "Competencia de basketball entre equipos locales",
    image: "https://www.kasandbox.org/programming-images/avatars/leaf-purple.png",
    category: "Deportes",
    date: "Sábado, 05 abr",
    hour: "14:00 PM",
    location: "Polideportivo, San Jose",
    availableSpots: 16
  },
  {
    id: "25",
    name: "Conferencia de Inteligencia Artificial",
    description: "El futuro de la inteligencia artificial y sus aplicaciones",
    image: "",
    category: "Tecnología",
    date: "Jueves, 13 jun",
    hour: "10:00 AM",
    location: "Centro Cultural, Heredia",
    availableSpots: 30
  }
];

export default allEvents