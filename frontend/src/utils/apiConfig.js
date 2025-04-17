// API configurations for the frontend
const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://41.226.63.196:5000' 
  : '';

export default API_BASE_URL;