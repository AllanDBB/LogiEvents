import api from './api';
import type { User, UserUpdateData } from '@/models/user';
import users from '@/mockups/users';

const USE_MOCK = true;

const userService = {
  getCurrentUser: async (): Promise<User | null> => {
    if (USE_MOCK) {
      return Promise.resolve(users[2]);
    }
    
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
    
    try {
      const response = await api.put('/users/me', userData);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      return null;
    }
  },
  
  uploadProfileImage: async (imageUri: string, userId: string): Promise<string | null> => {
    if (USE_MOCK) {
      console.log('Modo de prueba: La imagen se subiría a api/uploads');
      return Promise.resolve(imageUri);
    }
    
    try {
      const formData = new FormData();
      
      const uriParts = imageUri.split('/');
      const fileName = uriParts[uriParts.length - 1];
      
      formData.append('file', {
        uri: imageUri,
        name: fileName,
        type: 'image/jpeg',
      } as any);
      
      formData.append('userId', userId);
      
      const response = await api.post('/api/uploads', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data && response.data.imageUrl) {
        return response.data.imageUrl;
      }
      
      return null;
    } catch (error) {
      console.error('Error uploading profile image:', error);
      return null;
    }
  },

  changePassword: async (oldPassword: string, newPassword: string): Promise<boolean> => {
    if (USE_MOCK) {
      return Promise.resolve(true);
    }
    
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