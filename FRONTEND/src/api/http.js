// src/api/http.js
import axios from 'axios';

const http = axios.create({
    baseURL: 'http://localhost:8000/api', // Laravel API
    headers: {
        'Accept': 'application/json',
    },
});

// Attach token if present
http.interceptors.request.use(config => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default http;