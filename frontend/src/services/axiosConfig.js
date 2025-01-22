// src/services/axiosConfig.js
import axios from 'axios';

const axiosConfig = axios.create({
  baseURL: 'http://localhost:5000/api', // Configura la URL base aquí
  timeout: 1000,
});

export default axiosConfig;
