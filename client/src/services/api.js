import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const instance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

const api = {
  get: (url) => instance.get(url).then(res => res.data),
  post: (url, data) => instance.post(url, data).then(res => res.data),
  put: (url, data) => instance.put(url, data).then(res => res.data),
  delete: (url) => instance.delete(url).then(res => res.data),
};

export default api;
