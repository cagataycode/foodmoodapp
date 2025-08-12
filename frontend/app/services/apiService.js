import { getApiUrl } from "../config/api";
import * as SecureStore from "expo-secure-store";

const API_BASE_URL = getApiUrl();

// Debug configuration
// - set to __DEV__ for development
// - set to false for production
const DEBUG_MODE = __DEV__;

// Simple logger utility
const logger = {
  log: (...args) => {
    if (DEBUG_MODE) {
      console.log(...args);
    }
  },
  error: (...args) => {
    if (DEBUG_MODE) {
      console.error(...args);
    }
  },
  warn: (...args) => {
    if (DEBUG_MODE) {
      console.warn(...args);
    }
  },
};

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to make HTTP requests
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    // Debug logging
    logger.log("🌐 Making API request to:", url);
    logger.log("📱 API Base URL:", this.baseURL);

    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    // Add authorization header if token exists
    const token = await this.getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      // Create a safe copy of headers for logging (redact sensitive data)
      const safeHeaders = { ...config.headers };
      if (safeHeaders.Authorization) {
        safeHeaders.Authorization = "Bearer [REDACTED]";
      }

      logger.log("📤 Request config:", {
        method: config.method || "GET",
        headers: safeHeaders,
      });
      const response = await fetch(url, config);
      logger.log("📥 Response status:", response.status);

      const data = await response.json();
      logger.log("📥 Response data:", data);

      if (!response.ok) {
        throw new Error(data.error || "Request failed");
      }

      return data;
    } catch (error) {
      logger.error("❌ API Request Error:", error);
      logger.error("❌ Error details:", {
        message: error.message,
        url: url,
        baseURL: this.baseURL,
      });
      throw error;
    }
  }

  // Token storage methods
  async getStoredToken() {
    try {
      const token = await SecureStore.getItemAsync("authToken");
      return token || null;
    } catch (error) {
      logger.error("Error getting stored token:", error);
      return null;
    }
  }

  async setStoredToken(token) {
    try {
      if (token) {
        await SecureStore.setItemAsync("authToken", token);
      }
    } catch (error) {
      logger.error("Error setting stored token:", error);
    }
  }

  async removeStoredToken() {
    try {
      await SecureStore.deleteItemAsync("authToken");
    } catch (error) {
      logger.error("Error removing stored token:", error);
    }
  }

  // Authentication methods
  async register(email, password, username) {
    const response = await this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, username }),
    });

    if (response.success && response.data.access_token) {
      await this.setStoredToken(response.data.access_token);
    }

    return response;
  }

  async login(email, password) {
    const response = await this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.data.access_token) {
      await this.setStoredToken(response.data.access_token);
    }

    return response;
  }

  async logout() {
    try {
      await this.request("/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      logger.error("Logout error:", error);
    } finally {
      await this.removeStoredToken();
    }

    return { success: true };
  }

  async getCurrentUser() {
    try {
      const response = await this.request("/auth/me");
      return response;
    } catch (error) {
      // If token is invalid, remove it
      if (
        error.message.includes("Unauthorized") ||
        error.message.includes("Invalid token")
      ) {
        await this.removeStoredToken();
      }
      throw error;
    }
  }

  async updateProfile(updates) {
    const response = await this.request("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(updates),
    });

    return response;
  }

  async deleteAccount() {
    const response = await this.request("/auth/account", {
      method: "DELETE",
    });

    if (response.success) {
      await this.removeStoredToken();
    }

    return response;
  }

  // Food Logs methods
  async createFoodLog(foodLogData) {
    const response = await this.request("/food-logs", {
      method: "POST",
      body: JSON.stringify(foodLogData),
    });

    return response;
  }

  async getFoodLogs(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = queryParams ? `/food-logs?${queryParams}` : "/food-logs";
    const response = await this.request(endpoint);

    return response;
  }

  async getFoodLogById(id) {
    const response = await this.request(`/food-logs/${id}`);
    return response;
  }

  async updateFoodLog(id, updateData) {
    const response = await this.request(`/food-logs/${id}`, {
      method: "PUT",
      body: JSON.stringify(updateData),
    });

    return response;
  }

  async deleteFoodLog(id) {
    const response = await this.request(`/food-logs/${id}`, {
      method: "DELETE",
    });

    return response;
  }

  async getFoodLogStats(startDate, endDate) {
    const queryParams = new URLSearchParams({
      start_date: startDate,
      end_date: endDate,
    }).toString();
    const response = await this.request(`/food-logs/stats?${queryParams}`);
    return response;
  }

  // Insights methods
  async getInsights(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = queryParams ? `/insights?${queryParams}` : "/insights";
    const response = await this.request(endpoint);

    return response;
  }

  async getInsightById(id) {
    const response = await this.request(`/insights/${id}`);
    return response;
  }

  async markInsightAsRead(id) {
    const response = await this.request(`/insights/${id}/read`, {
      method: "PUT",
    });

    return response;
  }

  async generateWeeklyInsights() {
    const response = await this.request("/insights/generate/weekly", {
      method: "POST",
    });

    return response;
  }

  async generateMonthlyInsights() {
    const response = await this.request("/insights/generate/monthly", {
      method: "POST",
    });

    return response;
  }

  async generatePatternInsights() {
    const response = await this.request("/insights/generate/patterns", {
      method: "POST",
    });

    return response;
  }

  async deleteInsight(id) {
    const response = await this.request(`/insights/${id}`, {
      method: "DELETE",
    });

    return response;
  }

  // Health check
  async healthCheck() {
    try {
      logger.log("🏥 Testing health check...");
      const response = await fetch(
        `${this.baseURL.replace("/api", "")}/health`
      );
      logger.log("🏥 Health check response status:", response.status);
      const data = await response.json();
      logger.log("🏥 Health check data:", data);
      return data;
    } catch (error) {
      logger.error("🏥 Health check failed:", error);
      throw new Error("Backend server is not available");
    }
  }
}

export default new ApiService();
