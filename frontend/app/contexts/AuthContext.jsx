import React, { createContext, useContext, useEffect, useState } from "react";
import apiService from "../services/apiService";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Check for existing token and validate it
    const checkAuthStatus = async () => {
      try {
        const token = await apiService.getStoredToken();
        if (token) {
          const response = await apiService.getCurrentUser();
          if (mounted && response.success) {
            setUser(response.data);
          } else if (mounted) {
            // Token is invalid, remove it
            await apiService.removeStoredToken();
            setUser(null);
          }
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        if (mounted) {
          await apiService.removeStoredToken();
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    checkAuthStatus();

    return () => {
      mounted = false;
    };
  }, []);

  const signIn = async (email, password) => {
    try {
      const response = await apiService.login(email, password);
      if (response.success) {
        setUser(response.data.user);
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.error || "Login failed" };
      }
    } catch (error) {
      return { success: false, error: error.message || "Login failed" };
    }
  };

  const signUp = async (email, password, username) => {
    try {
      const response = await apiService.register(email, password, username);
      if (response.success) {
        setUser(response.data.user);
        return { success: true, data: response.data };
      } else {
        return {
          success: false,
          error: response.error || "Registration failed",
        };
      }
    } catch (error) {
      return { success: false, error: error.message || "Registration failed" };
    }
  };

  const signOut = async () => {
    try {
      await apiService.logout();
      setUser(null);
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      // Even if logout fails, clear local state
      setUser(null);
      return { success: true };
    }
  };

  const updateProfile = async (updates) => {
    try {
      const response = await apiService.updateProfile(updates);
      if (response.success) {
        setUser(response.data);
        return { success: true, data: response.data };
      } else {
        return {
          success: false,
          error: response.error || "Profile update failed",
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || "Profile update failed",
      };
    }
  };

  const deleteAccount = async () => {
    try {
      const response = await apiService.deleteAccount();
      if (response.success) {
        setUser(null);
        return { success: true };
      } else {
        return {
          success: false,
          error: response.error || "Account deletion failed",
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || "Account deletion failed",
      };
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    deleteAccount,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Default export for Expo Router compatibility
export default AuthProvider;
