import axios from 'axios';
import API_BASE_URL from '../constants/apiConfig';

// Create an axios instance with the base URL
const instance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add response interceptor to handle errors globally
instance.interceptors.response.use(
  response => response,
  error => {
    // Log the error for debugging
    console.error('API Error:', error);
    
    // Check if error response exists
    if (error.response) {
      // If we're getting HTML when expecting JSON, log it
      if (error.response.headers['content-type']?.includes('text/html')) {
        console.error('Received HTML instead of JSON. This might indicate a server configuration issue.');
      }
    }
    
    return Promise.reject(error);
  }
);

export default instance;