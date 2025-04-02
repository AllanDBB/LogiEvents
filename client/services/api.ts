import axios from 'axios';
import Constants from 'expo-constants';

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


export default api;
