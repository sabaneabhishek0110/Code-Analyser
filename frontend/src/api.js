import axios from 'axios';

// This will use your backend link in production and 
// can fallback to your proxy or local link during dev
const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || '' 
});

export default API;