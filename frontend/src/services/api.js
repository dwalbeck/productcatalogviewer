import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    if (error.response) {
      // Server responded with error status
      console.error('Error data:', error.response.data);
      console.error('Error status:', error.response.status);
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response received:', error.request);
    } else {
      // Something else happened
      console.error('Error message:', error.message);
    }
    return Promise.reject(error);
  }
);

const productApi = {
  // Get all products
  getAllProducts: () => api.get('/products'),

  // Get product by ID
  getProductById: (productKey) => api.get(`/products/${productKey}`),

  // Create new product
  createProduct: (product) => api.post('/products', product),

  // Update existing product
  updateProduct: (product) => api.put('/products', product),

  // Delete product
  deleteProduct: (productKey) => api.delete(`/products/${productKey}`),

  // Get brand summary
  getBrandSummary: () => api.get('/products/brand-summary'),

  // Search products
  searchProducts: (params) => api.get('/products/search', { params }),

  // Get product count
  getProductCount: () => api.get('/products/count'),
};

export default productApi;