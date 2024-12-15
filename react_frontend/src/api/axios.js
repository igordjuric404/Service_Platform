import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api', 
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  withXSRFToken: true, 
});

axiosInstance.interceptors.request.use(
  (config) => {
    console.log('Axios Request Config:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      cookies: document.cookie, // Logs cookies sent to the backend
      data: config.data,
    });
    return config;
  },
  (error) => {
    console.error('Axios Request Error:', error);
    return Promise.reject(error);
  }
);

axiosInstance.defaults.xsrfCookieName = 'XSRF-TOKEN';
axiosInstance.defaults.xsrfHeaderName = 'X-XSRF-TOKEN';

export default axiosInstance;
