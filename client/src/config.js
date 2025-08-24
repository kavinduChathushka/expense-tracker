// API Configuration
const config = {
  // API base URL - use environment variable or fallback to localhost for development
  API_BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  
  // Check if we're in production
  isProduction: process.env.NODE_ENV === 'production',
  
  // Default timeout for API calls
  API_TIMEOUT: 10000,
};

export default config;
