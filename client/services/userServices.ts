import api from './api';
import type { User, UserUpdateData } from '@/models/user';
import users from '@/mockups/users';

const USE_MOCK = true;

const userService = {
  getCurrentUser: async (): Promise<User | null> => {
    if (USE_MOCK) {
      return Promise.resolve(users[2]);
    }
    
    // TODO: Implement real API call
    try {
      const response = await api.get('/users/me');
      return response.data;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  getUserById: async (id: string): Promise<User | null> => {
    if (USE_MOCK) {
      const user = users.find(user => user.id === id);
      return Promise.resolve(user || null);
    }
    
    // TODO: Implement real API call
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error getting user with ID ${id}:`, error);
      return null;
    }
  },

  updateUserProfile: async (userData: UserUpdateData): Promise<User | null> => {
    if (USE_MOCK) {
      const updatedUser: User = {
        ...users[0],
        ...userData,
        updatedAt: new Date().toString()
      };
      return Promise.resolve(updatedUser);
    }
    
    // TODO: Implement real API call
    try {
      const response = await api.put('/users/me', userData);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      return null;
    }
  },

  changePassword: async (oldPassword: string, newPassword: string): Promise<boolean> => {
    if (USE_MOCK) {
      return Promise.resolve(true);
    }
    
    // TODO: Implement real API call
    try {
      await api.post('/users/change-password', {
        oldPassword,
        newPassword
      });
      return true;
    } catch (error) {
      console.error('Error changing password:', error);
      return false;
    }
  },

  logout: async (): Promise<boolean> => {
    if (USE_MOCK) {
      return Promise.resolve(true);
    }
    
    // TODO: Implement real API call
    try {
      await api.post('/auth/logout');
      return true;
    } catch (error) {
      console.error('Error logging out:', error);
      return false;
    }
  }
};

export default userService;