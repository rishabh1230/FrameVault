// src/api/axios.ts
import axios from "axios";


const api = axios.create({
  baseURL: "http://localhost:8000/api", // your backend URL
  withCredentials: true, // send cookies/JWTs across domains
});

// FIX: Add a request interceptor to attach the Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken"); 
    if (token && token !== 'undefined') { 
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;