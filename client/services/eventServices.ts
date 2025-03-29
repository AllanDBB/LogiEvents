
/*** services/eventsService.ts ***/
import api from './api';
import type { Event, EventCategory } from '@/models/event';
import allEvents from '@/mockups/allEvents'; 
import myEvents from '@/mockups/adminEvents'; 
import  userService  from '@/services/userServices';

const USE_MOCK = true;

const eventsService = {
  
  getAllEvents: async (): Promise<Event[]> => {
    if (USE_MOCK) {
      return Promise.resolve(allEvents);
    }
    
    const response = await api.get('/events');
    return response.data;
  },

  getEventsByCategory: async (category: EventCategory): Promise<Event[]> => {
    if (USE_MOCK) {
      return Promise.resolve(
        allEvents.filter(event => event.category === category)
      );
    }
    
    const response = await api.get(`/events?category=${category}`);
    return response.data;
  },

  getUserEvents: async (): Promise<Event[]> => {
    if (USE_MOCK) {
      return Promise.resolve(myEvents);
    }
    
    const user = await userService.getCurrentUser();
    if (!user) {  
      return [];
    }
    const response = await api.get(`/events/user/${user.id}`);
    return response.data;
  },

  getEventById: async (id: string): Promise<Event | null> => {
    if (USE_MOCK) {
      const event = allEvents.find(event => event.id === id);
      return Promise.resolve(event || null);
    }
    
    const response = await api.get(`/events/${id}`);
    return response.data;
  },


  createEvent: async (eventData: Omit<Event, 'id'>): Promise<Event> => {
    if (USE_MOCK) {
      const newEvent: Event = {
        id: `mock-${Date.now()}`,
        ...eventData
      };
      return Promise.resolve(newEvent);
    }
    const response = await api.post('/events', eventData);
    return response.data;
  },

  updateEvent: async (id: string, eventData: Partial<Event>): Promise<Event> => {
    if (USE_MOCK) {
      const eventIndex = allEvents.findIndex(event => event.id === id);
      if (eventIndex === -1) {
        throw new Error('Evento no encontrado');
      }
      
      const updatedEvent: Event = {
        ...allEvents[eventIndex],
        ...eventData
      };
      
      return Promise.resolve(updatedEvent);
    }
    
    const response = await api.put(`/events/${id}`, eventData);
    return response.data;
  },

  deleteEvent: async (id: string): Promise<boolean> => {
    if (USE_MOCK) {
      return Promise.resolve(true);
    }
    
    await api.delete(`/events/${id}`);
    return true;
  },

  searchEvents: async (query: string): Promise<Event[]> => {
    if (USE_MOCK) {
      return Promise.resolve(
        allEvents.filter(event => 
          event.title.toLowerCase().includes(query.toLowerCase()) ||
          event.description.toLowerCase().includes(query.toLowerCase())
        )
      );
    }
    const response = await api.get(`/events/search?q=${query}`);
    return response.data;
  }
};

export default eventsService;