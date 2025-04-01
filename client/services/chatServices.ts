import type { Event } from '@/models/event';
import allEvents from '@/mockups/allEvents';

export type MessageType = 'text' | 'eventSuggestion';

export interface EventSuggestion {
  id: string;
  title: string;
  datetime: string;
  imageUrl?: string;
  location?: string;
}

export interface Message {
  id: string;
  content: string;
  type: MessageType;
  isUser: boolean;
  timestamp: Date;
  eventSuggestion?: EventSuggestion;
}

export interface ChatSession {
  id: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
}

export interface QuickReplyOption {
  id: string;
  text: string;
}

const TYPING_DELAY = 1000;

const BOT_RESPONSES = {
  GREETING: [
    'Hola! ¿En qué puedo ayudarte hoy?',
    '¡Bienvenido! Soy Sammy, tu asistente personal.',
    '¡Hola! ¿Necesitas ayuda con algún evento?'
  ],
  NOT_UNDERSTOOD: [
    'Disculpa, no he entendido tu consulta. ¿Puedes reformularla?',
    'No estoy seguro de lo que necesitas. ¿Puedes ser más específico?',
    'Perdona, pero no he captado bien tu pregunta. ¿Me explicas de otra manera?'
  ],
  EVENT_INTRO: [
    'Claro, aquí tienes un evento que podría interesarte:',
    'He encontrado este evento para ti:',
    'Mira este evento, creo que te gustará:'
  ],
  HELP_OPTIONS: 'Puedo ayudarte a encontrar eventos, cambiar contraseña, comprar entradas, editar eventos o acceder a estadísticas. ¿Qué necesitas?',
  THANKS: 'De nada! ¿Hay algo más en lo que pueda ayudarte?',
  PASSWORD_CHANGE: 'Para cambiar tu contraseña, sigue estos pasos:\n\n1. Ve a tu perfil haciendo clic en el botón "Perfil" en la barra de navegación\n2. En la página de perfil, busca el botón "Cambiar Contraseña"\n3. Ingresa tu contraseña actual y la nueva contraseña\n4. Confirma la nueva contraseña\n5. Haz clic en "Guardar"',
  PROFILE_PHOTO: 'Para cambiar tu foto de perfil:\n\n1. Ve a la sección de "Perfil" en el menú principal\n2. Selecciona "Editar perfil"\n3. Haz clic en la imagen o el ícono\n4. Selecciona  "Subir imagen"\n5. Escoge una nueva imagen de tu dispositivo\n6. Guarda los cambios',
  BUY_TICKETS: 'Para comprar entradas a un evento:\n\n1. Encuentra el evento que te interesa en la página principal o mediante búsqueda\n2. Haz clic en el evento para ver los detalles\n3. Selecciona la cantidad de entradas que deseas\n4. Haz clic en "Comprar Entradas"\n5. Completa la información de pago\n6. Recibirás un correo electrónico con tu confirmación',
  TERMS_CONDITIONS: 'Para ver los términos y condiciones:\n\n1. Desplázate hasta la barra de navegacion en cualquier página\n2. Haz clic en "Políticas" o "Términos de uso"\n3. También puedes acceder directamente desde la URL: /policies\n4. Allí encontrarás toda la información legal sobre el uso de la plataforma',
  CREATE_EVENT: 'Para crear un nuevo evento (disponible para administradores):\n\n1. Ingresa a tu cuenta como administrador\n2. En la página principal, busca el botón "Crear evento"\n3. Completa todos los campos requeridos: título, descripción, fecha, etc.\n4. Añade una imagen promocional del evento\n5. Configura los detalles de disponibilidad y precios\n6. Haz clic en "Publicar Evento"',
  EDIT_EVENT: 'Para editar un evento (solo disponible para administradores):\n\n1. Ve a "Mis Eventos" en la barra de navegación\n2. Encuentra el evento que deseas modificar\n3. Haz clic en el evento para ver sus detalles\n4. Busca la opción "Editar" en la parte inferior\n5. Realiza los cambios necesarios y guarda',
  VIEW_STATS: 'Para ver las estadísticas de tus eventos (solo disponible para administradores):\n\n1. Ve a la página principal cuando estés logueado como administrador\n2. Busca y haz clic en el botón "Ver estadísticas"\n3. Allí podrás ver datos sobre asistencia, ventas y engagement de tus eventos',
  CONTACT: 'Si necesitas contactarnos directamente, puedes escribirnos a:\n\nlogieventsofficial@gmail.com\n\nNuestro horario de atención es de lunes a viernes de 8:00 AM a 5:00 PM (hora local de Costa Rica).'
};

const KEYWORDS = {
  EVENTS: ['evento', 'eventos', 'actividad', 'actividades', 'fiesta', 'concierto', 'show', 'recomendar', 'sugerir', 'buscar'],
  GREETINGS: ['hola', 'hey', 'saludos', 'buenas', 'buenos días', 'buenas tardes', 'buenas noches'],
  THANKS: ['gracias', 'te lo agradezco', 'muchas gracias', 'thank', 'thanks'],
  HELP: ['ayuda','que haces','preguntas', 'ayudar', 'información', 'info', 'preguntas', 'pregunta', 'dudas', 'duda'],
  PASSWORD: ['contraseña', 'password', 'clave', 'cambiar contraseña', 'cambiar clave', 'cambiar password', 'olvidé', 'olvide', 'olvidar'],
  PROFILE_PHOTO: ['foto', 'perfil', 'imagen', 'cambiar foto', 'actualizar foto', 'subir foto', 'cambiar imagen', 'avatar'],
  TICKETS: ['entrada', 'entradas', 'ticket', 'tickets', 'comprar', 'reservar', 'adquirir', 'pago'],
  TERMS: ['términos', 'condiciones', 'políticas', 'privacidad', 'legal', 'normas', 'reglas'],
  CREATE: ['crear', 'nuevo', 'añadir', 'agregar', 'publicar', 'generar'],
  EDIT: ['editar', 'modificar', 'cambiar', 'actualizar', 'evento'],
  STATS: ['estadísticas', 'stats', 'estadística', 'métricas', 'datos', 'analytics', 'reportes', 'ventas'],
  CONTACT: ['contacto', 'correo', 'email', 'teléfono', 'llamar', 'mensaje', 'contactar', 'soporte', 'ayuda técnica']
};

function containsKeyword(message: string, keywordArray: string[]): boolean {
  const lowercaseMessage = message.toLowerCase();
  return keywordArray.some(keyword => lowercaseMessage.includes(keyword));
}

const getRandomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

const activeSessions: Record<string, ChatSession> = {};

const chatService = {
  startSession: async function(userId?: string): Promise<ChatSession> {
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      content: 'Hola! Soy Sammy 👋 Tu asistente personal. ¿Cómo puedo ayudarte?',
      type: 'text',
      isUser: false,
      timestamp: new Date()
    };
    
    const sessionId = 'session-' + Date.now().toString();
    const newSession: ChatSession = {
      id: sessionId,
      messages: [welcomeMessage],
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: userId
    };
    
    activeSessions[sessionId] = newSession;
    
    return newSession;
  },
  
  sendMessage: async function(message: string, currentSession: ChatSession): Promise<{
    response: Message,
    typingDelay: number
  }> {
    currentSession.updatedAt = new Date();
    
    return this.generateResponse(message, currentSession);
  },
  
  generateResponse: async function(message: string, session: ChatSession): Promise<{
    response: Message,
    typingDelay: number
  }> {
    const lowercaseMessage = message.toLowerCase();
    let responseContent = '';
    let responseType: MessageType = 'text';
    let typingDelay = TYPING_DELAY;
    let eventSuggestion: EventSuggestion | undefined;
    
    if (containsKeyword(lowercaseMessage, KEYWORDS.GREETINGS)) {
      responseContent = getRandomElement(BOT_RESPONSES.GREETING);
    }
    else if (containsKeyword(lowercaseMessage, KEYWORDS.EVENTS)) {
      responseContent = getRandomElement(BOT_RESPONSES.EVENT_INTRO);
      responseType = 'eventSuggestion';
      
      const suggestedEvent = await this.getSuggestedEvent(lowercaseMessage);
      eventSuggestion = {
        id: suggestedEvent.id,
        title: suggestedEvent.title,
        datetime: `${suggestedEvent.date || ''} - ${suggestedEvent.time || ''}`,
        imageUrl: suggestedEvent.image,
        location: suggestedEvent.location
      };
      
      typingDelay = 1500;
    }
    else if (containsKeyword(lowercaseMessage, KEYWORDS.PASSWORD)) {
      responseContent = BOT_RESPONSES.PASSWORD_CHANGE;
      typingDelay = 1500;
    }
    else if (containsKeyword(lowercaseMessage, KEYWORDS.PROFILE_PHOTO)) {
      responseContent = BOT_RESPONSES.PROFILE_PHOTO;
      typingDelay = 1500;
    }
    else if (containsKeyword(lowercaseMessage, KEYWORDS.TICKETS)) {
      responseContent = BOT_RESPONSES.BUY_TICKETS;
      typingDelay = 1500;
    }
    else if (containsKeyword(lowercaseMessage, KEYWORDS.TERMS)) {
      responseContent = BOT_RESPONSES.TERMS_CONDITIONS;
      typingDelay = 1200;
    }
    else if (containsKeyword(lowercaseMessage, KEYWORDS.CREATE) && containsKeyword(lowercaseMessage, KEYWORDS.EVENTS)) {
      responseContent = BOT_RESPONSES.CREATE_EVENT;
      typingDelay = 1500;
    }
    else if (containsKeyword(lowercaseMessage, KEYWORDS.EDIT)) {
      responseContent = BOT_RESPONSES.EDIT_EVENT;
      typingDelay = 1500;
    }
    else if (containsKeyword(lowercaseMessage, KEYWORDS.STATS)) {
      responseContent = BOT_RESPONSES.VIEW_STATS;
      typingDelay = 1200;
    }
    else if (containsKeyword(lowercaseMessage, KEYWORDS.CONTACT)) {
      responseContent = BOT_RESPONSES.CONTACT;
      typingDelay = 1000;
    }
    else if (containsKeyword(lowercaseMessage, KEYWORDS.HELP)) {
      responseContent = BOT_RESPONSES.HELP_OPTIONS;
    }
    else if (containsKeyword(lowercaseMessage, KEYWORDS.THANKS)) {
      responseContent = BOT_RESPONSES.THANKS;
    }
    else {
      responseContent = getRandomElement(BOT_RESPONSES.NOT_UNDERSTOOD);
    }
    
    // Create response message
    const response: Message = {
      id: Date.now().toString(),
      content: responseContent,
      type: responseType,
      isUser: false,
      timestamp: new Date(),
      eventSuggestion
    };
    
    return { response, typingDelay };
  },
  
  getSuggestedEvent: async function(message: string): Promise<Event> {
    const keywords: string[] = [];
    const words = message.toLowerCase().split(' ');
    
    for (let word of words) {
      word = word.trim();
      if (word.length > 3) {
        keywords.push(word);
      }
    }
    
    const matchingEvents: Event[] = [];
    
    for (let event of allEvents) {
      const eventText = (
        event.title.toLowerCase() + ' ' +
        event.description.toLowerCase() + ' ' +
        event.category.toLowerCase()
      );
      
      for (let keyword of keywords) {
        if (eventText.includes(keyword)) {
          matchingEvents.push(event);
          break;
        }
      }
    }
    
    if (matchingEvents.length > 0) {
      return matchingEvents[Math.floor(Math.random() * matchingEvents.length)];
    }
    
    return allEvents[Math.floor(Math.random() * allEvents.length)];
  },
  
  getQuickReplies: async function(session: ChatSession): Promise<QuickReplyOption[]> {
    const standardReplies = [
      { id: '1', text: '¿Eventos recomendados?' },
      { id: '2', text: '¿Cómo cambiar mi contraseña?' },
      { id: '3', text: '¿Cómo cambiar mi foto de perfil?' },
      { id: '4', text: '¿Cómo comprar entradas?' },
      { id: '5', text: '¿Dónde ver términos y condiciones?' },
      { id: '6', text: '¿Cómo crear un evento?' },
      { id: '7', text: '¿Cómo editar un evento?' },
      { id: '8', text: '¿Cómo ver estadísticas?' },
      { id: '9', text: 'Contacto de soporte' }
    ];
    
    const shuffledReplies = [...standardReplies].sort(() => 0.5 - Math.random());
    return shuffledReplies.slice(0, 4);
  },
  
  saveSession: async function(session: ChatSession): Promise<boolean> {
    activeSessions[session.id] = session;
    return true;
  },

  loadSession: async function(sessionId: string): Promise<ChatSession | null> {
    return activeSessions[sessionId] || null;
  },
  
  clearAllSessions: async function(): Promise<boolean> {
    for (const key in activeSessions) {
      delete activeSessions[key];
    }
    return true;
  }
};

export default chatService;