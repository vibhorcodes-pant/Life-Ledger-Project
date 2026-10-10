import axios from 'axios';

// Java Spring Boot Backend Base URL
const JAVA_API_URL = import.meta.env.VITE_JAVA_API_URL || 'http://localhost:8080/api';

const client = axios.create({
  baseURL: JAVA_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

export const wellnessApi = {
  // GET /api/health
  checkHealth: async () => {
    try {
      const res = await client.get('/health');
      return res.data;
    } catch (err) {
      console.warn('Java backend health check failed:', err.message);
      return { success: false, message: 'Backend unreachable' };
    }
  },

  // GET /api/entries
  getAllEntries: async () => {
    const res = await client.get('/entries');
    return res.data;
  },

  // GET /api/entries/{date}
  getEntryByDate: async (dateStr) => {
    const res = await client.get(`/entries/${dateStr}`);
    return res.data;
  },

  // PUT /api/entries/{date}
  saveOrUpdateEntry: async (dateStr, data) => {
    const res = await client.put(`/entries/${dateStr}`, data);
    return res.data;
  },

  // DELETE /api/entries/{date}
  deleteEntry: async (dateStr) => {
    const res = await client.delete(`/entries/${dateStr}`);
    return res.data;
  },

  // GET /api/entries/summary
  getSummary: async () => {
    const res = await client.get('/entries/summary');
    return res.data;
  },

  // POST /api/entries/seed
  seedDemoData: async () => {
    const res = await client.post('/entries/seed');
    return res.data;
  }
};

export default wellnessApi;
