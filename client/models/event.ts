export type EventCategory = 'Entretenimiento'|'Exhibición'|'Ocio'|'Juegos' |"Gastronomía"| 'Cultura'|'Música' | 'Deportes' | 'Tecnología'| 'Educación' | 'Mis eventos';

export type Event = {
  id: string;
  name: string;
  description: string;
  image: string;
  category: EventCategory;
  date?: string;        // Ej: "Domingo, 23 feb"
  hour?: string;        // Ej: "08:00 AM"
  location?: string;    // Ej: "Liberia, Guanacaste"
  availableSpots?: number; // Espacios disponibles
  status?: string; // Estado del evento (Ej: "Activo", "Inactivo")
};
