import axios from 'axios';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.request.use(
  async (config) => {
    try {
      const token = await getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error al agregar token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const getAuthToken = async () => {
  //TODO:implement auth token logic
  return null;
};

// Register function
export const register = async (data) => {
  try {
    const response = await api.post('/auth/register', data);
    return response;
  } catch (error) {
    console.error('Error en el registro:', error);
    throw error;
  }
};

export const verifyAuthCode = async (data) => {

  try {
    const response = await api.post('/auth/verify-code/', data);
    return response;
  } catch (error) {
    console.error('Error verificando el código', error)
    throw error;
  }
}

export const login = async (data) => {
  try {
    const response = await api.post('/auth/login', data);

    if (response.data.token) {
      await AsyncStorage.setItem('token', response.data.token);
    }

    if (response.data.user) {
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response;
  } catch (error) {
    console.error('Error en el inicio de sesión:', error);
    throw error;
  }
}

export const updateUser  = async (id, data, token) => {
  try {

    const response = await api.patch(`/user/${id}`, data, {
      headers: {
        Authorization: `${token}`, 
      },
    });

    if (response.data) {
      await AsyncStorage.setItem('user', JSON.stringify(response.data));
    }


    return response.data;
  } catch (error) {
    console.error('Error actualizando el usuario:', error);
    throw error;
  }
}


export const recoverPassword = async (data) => {
  try {
    const response = await api.post('/auth/forgot-password', data);
    return response;
  } catch (error) {
    console.error('Error en la recuperación de contraseña:', error);
    throw error;
  }
}

export const resetPassword = async (data) => {
  try {
    const response = await api.post('/auth/reset-password/', data);
    return response;
  } catch (error) {
    console.error('Error en el restablecimiento de contraseña:', error);
    throw error;
  }
}

export const createEvent = async (data, token) => {
  try {

      const response = await api.post('/event', data, {
          headers: {
              Authorization: `${token}`
          },
      });
      return response.data;
  } catch (error) {
      console.error('Error al crear el evento:', error);
      throw error;
  }
};

export const getEventById = async (id, token) => {
  try {
      const response = await api.get(`/event/${id}`, {
          headers: {
              Authorization: `${token}`
          },
      });
      return response.data;
  } catch (error) {
      console.error('Error al obtener el evento:', error);
      throw error;
  }
}

export const updateEvent = async (id, data, token) => {
  try {
      const response = await api.put(`/event/${id}`, data, {
          headers: {
              Authorization: `${token}`
          },
      });
      return response.data;
  } catch (error) {
      console.error('Error al actualizar el evento:', error);
      throw error;
  }
}

export const requestEventDeletion = async (id, token) => {
  try {
    const response = await api.delete(`/event/${id}`, {
      headers: {
        Authorization: `${token}`
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al solicitar la eliminación del evento:', error);
    throw error;
  }
};

export const confirmEventDeletion = async (id, code, token) => {
  try {
    const response = await api.post(`/event/${id}/confirm-delete`, 
      { code },
      {
        headers: {
          Authorization: `${token}`
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error al confirmar la eliminación del evento:', error);
    throw error;
  }
};

export default api;
