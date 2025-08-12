// API Configuration for different environments
const API_CONFIG = {
  development: {
    baseURL: "http://192.168.15.86:3001/api", // Using Expo web for development
  },
  production: {
    baseURL:
      process.env.EXPO_PUBLIC_API_URL || "https://your-production-api.com/api",
  },
};

// Get current environment
const getEnvironment = () => {
  if (__DEV__) {
    return "development";
  }
  return "production";
};

// Export the appropriate config
export const apiConfig = API_CONFIG[getEnvironment()];
export const API_BASE_URL = apiConfig.baseURL;
export const getApiUrl = () => API_BASE_URL;

export default API_CONFIG;
