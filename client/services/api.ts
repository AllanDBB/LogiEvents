import axios from 'axios';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://core-swart-six.vercel.app';

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

export const requestReservation = async (eventId, phoneNumber, quantity, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/event/${eventId}/reserve`,
      { phoneNumber, quantity },
      {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Error al solicitar la reserva';
  }
};

export const confirmReservation = async (eventId, data, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/event/${eventId}/confirm-reservation`,
      data,
      {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Error al confirmar la reserva';
  }
};

export const makeAdmin = async (godEmail, godPassword, newAdminEmail) => {
  try {
    const response = await api.post('/user/make-admin', { 
      godEmail, 
      godPassword, 
      newAdminEmail 
    });
    return response.data;
  } catch (error) {
    console.error('Error al hacer admin:', error);
    throw error;
  }
}


export default api;
