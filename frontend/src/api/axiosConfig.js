import axios from 'axios';

// Configurar interceptores globales de Axios
axios.interceptors.request.use(
  config => {
    // Intentar obtener el token del localStorage
    const token = localStorage.getItem('token');
    
    // Si hay un token, añadirlo a los headers
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    
    console.log('Axios Request:', {
      url: config.url,
      method: config.method,
      hasToken: !!token
    });
    
    return config;
  },
  error => {
    console.error('Error en interceptor de solicitud Axios:', error);
    return Promise.reject(error);
  }
);

// Interceptor de respuesta para manejar errores globalmente
axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response) {
      // El servidor respondió con un código de error
      console.error('Error de respuesta Axios:', {
        status: error.response.status,
        data: error.response.data,
        url: error.config.url,
        method: error.config.method
      });
      
      // Si es error de autenticación, limpiar el token
      if (error.response.status === 401 || error.response.status === 403) {
        console.warn('Error de autenticación, token posiblemente expirado');
      }
    } else if (error.request) {
      // La solicitud fue hecha pero no se recibió respuesta
      console.error('No se recibió respuesta del servidor:', error.request);
    } else {
      // Error en la configuración de la solicitud
      console.error('Error al configurar la solicitud Axios:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default axios; 