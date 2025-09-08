// lib/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://ia-backend-itvaley.azurewebsites.net/',
  headers: {
    Accept: 'application/json',
  },
  // timeout: 30000, // opcional
});

export default api;
