import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Switch,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { useAuth } from "../contexts/AuthContext";
import { LoadingScreen } from "../components";

const Settings = () => {
  const { isAuthenticated, loading, signOut, user } = useAuth();
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    reminders: true,
    dataSharing: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, loading]);

  // Show loading while checking auth
  if (loading) {
    return <LoadingScreen message="Loading settings..." />;
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const handleToggleSetting = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            // Here you would typically delete the account
            Alert.alert("Account Deleted", "Your account has been deleted.");
            router.replace("/");
          },
        },
      ]
    );
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: async () => {
          setIsLoading(true);
          try {
            const result = await signOut();
            if (result.success) {
              router.replace("/");
            } else {
              Alert.alert("Error", "Failed to logout. Please try again.");
            }
          } catch (error) {
            Alert.alert("Error", "An unexpected error occurred.");
          } finally {
            setIsLoading(false);
          }
        },
      },
    ]);
  };

  const renderSettingItem = (
    title,
    description,
    value,
    onToggle,
    type = "toggle"
  ) => (
    <View style={styles.settingItem}>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      {type === "toggle" ? (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: "#e1e8ed", true: "#3498db" }}
          thumbColor={value ? "#ffffff" : "#f4f3f4"}
        />
      ) : (
        <TouchableOpacity onPress={onToggle}>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Settings</Text>
          <View style={{ width: 50 }} />
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            {renderSettingItem(
              "Push Notifications",
              "Receive notifications about reminders and updates",
              settings.notifications,
              () => handleToggleSetting("notifications")
            )}
            {renderSettingItem(
              "Dark Mode",
              "Use dark theme for the app",
              settings.darkMode,
              () => handleToggleSetting("darkMode")
            )}
            {renderSettingItem(
              "Daily Reminders",
              "Get reminded to log your food and mood",
              settings.reminders,
              () => handleToggleSetting("reminders")
            )}
            {renderSettingItem(
              "Data Sharing",
              "Share anonymous data to improve the app",
              settings.dataSharing,
              () => handleToggleSetting("dataSharing")
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>
            {renderSettingItem(
              "Email",
              user?.email || "Loading...",
              null,
              null,
              "info"
            )}
            {renderSettingItem(
              "Change Password",
              "Update your account password",
              null,
              () =>
                Alert.alert(
                  "Coming Soon",
                  "Password change feature will be available soon."
                ),
              "link"
            )}
            {renderSettingItem(
              "Privacy Policy",
              "Read our privacy policy",
              null,
              () =>
                Alert.alert(
                  "Privacy Policy",
                  "Our privacy policy can be found on our website."
                ),
              "link"
            )}
            {renderSettingItem(
              "Terms of Service",
              "Read our terms of service",
              null,
              () =>
                Alert.alert(
                  "Terms of Service",
                  "Our terms of service can be found on our website."
                ),
              "link"
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Support</Text>
            {renderSettingItem(
              "Help & FAQ",
              "Get help and find answers to common questions",
              null,
              () =>
                Alert.alert(
                  "Help & FAQ",
                  "Help section will be available soon."
                ),
              "link"
            )}
            {renderSettingItem(
              "Contact Support",
              "Get in touch with our support team",
              null,
              () =>
                Alert.alert(
                  "Contact Support",
                  "You can reach us at support@foodmood.com"
                ),
              "link"
            )}
            {renderSettingItem(
              "App Version",
              "Version 1.0.0",
              null,
              null,
              "info"
            )}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.logoutButton]}
              onPress={handleLogout}
            >
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.deleteButton]}
              onPress={handleDeleteAccount}
            >
              <Text style={[styles.buttonText, styles.deleteButtonText]}>
                Delete Account
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e1e8ed",
  },
  backButton: {
    fontSize: 16,
    color: "#3498db",
    fontWeight: "600",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f2f6",
  },
  settingContent: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: "#7f8c8d",
  },
  arrow: {
    fontSize: 18,
    color: "#3498db",
    fontWeight: "bold",
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  logoutButton: {
    backgroundColor: "#3498db",
  },
  deleteButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#e74c3c",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
  },
  deleteButtonText: {
    color: "#e74c3c",
  },
});

export default Settings;
