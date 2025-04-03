export type EventCategory = 'Entretenimiento'|'Exhibición'|'Ocio'|'Juegos' |"Gastronomía"| 'Cultura'|'Música' | 'Deportes' | 'Tecnología'| 'Educación' | 'Mis eventos';

export type Event = {
  id: string;
  title: string;
  description: string;
  image: string;
  category: EventCategory;
  date?: string;        // Ej: "Domingo, 23 feb"
  time?: string;        // Ej: "08:00 AM"
  location?: string;    // Ej: "Liberia, Guanacaste"
  availableSpots?: number; // Espacios disponibles

  state?: string; // Estado del evento (Ej: "Activo", "Inactivo")
};