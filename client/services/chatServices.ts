import api from './api';
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
}

export interface QuickReplyOption {
  id: string;
  text: string;
}

const USE_MOCK = true;
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
  BUY_TICKETS: 'Para comprar entradas a un evento:\n\n1. Encuentra el evento que te interesa en la página principal o mediante búsqueda\n2. Haz clic en el evento para ver los detalles\n3. Selecciona la cantidad de entradas que deseas\n4. Haz clic en "Comprar Entradas"\n5. Completa la información de pago\n6. Recibirás un correo electrónico con tu confirmación',
  TERMS_CONDITIONS: 'Para ver los términos y condiciones:\n\n1. Desplázate hasta la barra de navegacion en cualquier página\n2. Haz clic en "Políticas" o "Términos de uso"\n3. Allí encontrarás toda la información legal sobre el uso de la plataforma',
  EDIT_EVENT: 'Para editar un evento (solo disponible para administradores):\n\n1. Ve a "Mis Eventos" en la barra de navegación\n2. Encuentra el evento que deseas modificar\n3. Haz clic en el evento para ver sus detalles\n4. Busca la opción "Editar" en la parte inferior\n5. Realiza los cambios necesarios y guarda',
  VIEW_STATS: 'Para ver las estadísticas de tus eventos (solo disponible para administradores):\n\n1. Ve a la página principal cuando estés logueado como administrador\n2. Busca y haz clic en el botón "Ver estadísticas"\n3. Allí podrás ver datos sobre asistencia, ventas y engagement de tus eventos'
};

const KEYWORDS = {
  EVENTS: ['evento', 'eventos', 'actividad', 'actividades', 'fiesta', 'concierto', 'show', 'recomendar'],
  GREETINGS: ['hola', 'hey', 'saludos', 'buenas', 'buenos días', 'buenas tardes', 'buenas noches'],
  THANKS: ['gracias', 'te lo agradezco', 'muchas gracias', 'thank', 'thanks'],
  HELP: ['ayuda', 'ayudar', 'información', 'info', 'preguntas', 'pregunta', 'dudas', 'duda'],
  PASSWORD: ['contraseña', 'password', 'clave', 'cambiar contraseña', 'cambiar clave', 'cambiar password', 'olvidé', 'olvide', 'olvidar'],
  TICKETS: ['entrada', 'entradas', 'ticket', 'tickets', 'comprar', 'reservar', 'adquirir', 'pago'],
  TERMS: ['términos', 'condiciones', 'políticas', 'privacidad', 'legal', 'normas', 'reglas'],
  EDIT: ['editar', 'modificar', 'cambiar', 'actualizar', 'evento'],
  STATS: ['estadísticas', 'stats', 'estadística', 'métricas', 'datos', 'analytics', 'reportes', 'ventas']
};

function containsKeyword(message: string, keywordArray: string[]): boolean {
  for (let i = 0; i < keywordArray.length; i++) {
    if (message.includes(keywordArray[i])) {
      return true;
    }
  }
  return false;
}

const getRandomElement = <T>(array: T[]): T => {
    return array[Math.floor(Math.random() * array.length)];
};

const chatService = {
  startSession: async function(): Promise<ChatSession> {
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
      updatedAt: new Date()
    };
    
    if (!USE_MOCK) {
      try {
        const response = await api.post('/chat/sessions', {
          sessionId,
          timestamp: newSession.createdAt
        });
        
        if (response.data && response.data.id) {
          return response.data;
        }
      } catch (error) {
        console.error('Error creating chat session:', error);
      }
    }
    
    return newSession;
  },
  
  sendMessage: async function(message: string, currentSession: ChatSession): Promise<{
    response: Message,
    typingDelay: number
  }> {
    if (!USE_MOCK) {
      try {
        const response = await api.post('/chat/message', {
          sessionId: currentSession.id,
          message,
          timestamp: new Date()
        });
        
        if (response.data && response.data.response) {
          return {
            response: response.data.response,
            typingDelay: response.data.typingDelay || TYPING_DELAY
          };
        }
      } catch (error) {
        console.error('Error sending message to chat API:', error);
      }
    }
    
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
    else if (containsKeyword(lowercaseMessage, KEYWORDS.TICKETS)) {
      responseContent = BOT_RESPONSES.BUY_TICKETS;
      typingDelay = 1500;
    }
    else if (containsKeyword(lowercaseMessage, KEYWORDS.TERMS)) {
      responseContent = BOT_RESPONSES.TERMS_CONDITIONS;
      typingDelay = 1200;
    }
    else if (containsKeyword(lowercaseMessage, KEYWORDS.EDIT)) {
      responseContent = BOT_RESPONSES.EDIT_EVENT;
      typingDelay = 1500;
    }
    else if (containsKeyword(lowercaseMessage, KEYWORDS.STATS)) {
      responseContent = BOT_RESPONSES.VIEW_STATS;
      typingDelay = 1200;
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
    
    for (let i = 0; i < words.length; i++) {
      const word = words[i].trim();
      if (word.length > 3) {
        keywords.push(word);
      }
    }
    
    if (USE_MOCK) {
      const matchingEvents: Event[] = [];
      
      for (let i = 0; i < allEvents.length; i++) {
        const event = allEvents[i];
        const eventText = (
          event.title.toLowerCase() + ' ' +
          event.description.toLowerCase() + ' ' +
          event.category.toLowerCase()
        );
        
        for (let j = 0; j < keywords.length; j++) {
          if (eventText.includes(keywords[j])) {
            matchingEvents.push(event);
            break;
          }
        }
      }
      
      if (matchingEvents.length > 0) {
        return matchingEvents[Math.floor(Math.random() * matchingEvents.length)];
      }
      
      return allEvents[Math.floor(Math.random() * allEvents.length)];
    }
    
    try {
      const response = await api.get(`/events/suggest?keywords=${keywords.join(',')}`);
      return response.data;
    } catch (error) {
      console.error('Error getting event suggestion:', error);
      return allEvents[Math.floor(Math.random() * allEvents.length)];
    }
  },
  
  getQuickReplies: async function(session: ChatSession): Promise<QuickReplyOption[]> {
    if (!USE_MOCK) {
      try {
        const response = await api.post('/chat/suggestions', {
          sessionId: session.id,
          lastMessages: session.messages.slice(-3)
        });
        
        if (response.data && Array.isArray(response.data)) {
          return response.data;
        }
      } catch (error) {
        console.error('Error getting quick reply suggestions:', error);
      }
    }
    
    return [
      { id: '1', text: 'Recomendar eventos' },
      { id: '2', text: '¿Cómo cambiar mi contraseña?' },
      { id: '3', text: '¿Cómo comprar entradas?' },
      { id: '4', text: '¿Dónde ver términos y condiciones?' },
      { id: '5', text: '¿Cómo editar un evento?' },
      { id: '6', text: '¿Cómo ver estadísticas?' }
    ];
  },
  
  saveSession: async function(session: ChatSession): Promise<boolean> {
    if (!USE_MOCK) {
      try {
        await api.put(`/chat/sessions/${session.id}`, {
          messages: session.messages,
          updatedAt: new Date()
        });
        return true;
      } catch (error) {
        console.error('Error saving chat session:', error);
        return false;
      }
    }
    
    return true;
  },

  loadSession: async function(sessionId: string): Promise<ChatSession | null> {
    if (!USE_MOCK) {
      try {
        const response = await api.get(`/chat/sessions/${sessionId}`);
        if (response.data && response.data.id) {
          return response.data;
        }
      } catch (error) {
        console.error('Error loading chat session:', error);
      }
    }
    
    return null;
  }
};

export default chatService;