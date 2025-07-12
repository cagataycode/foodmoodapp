import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { TopBar, Avatar, ProfileField, LoadingScreen } from "../components";
import { useAuth } from "../contexts/AuthContext";
import apiService from "../services/apiService";

const Profile = () => {
  const { isAuthenticated, loading, user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState({
    username: user?.username || "",
    email: user?.email || "",
    age: user?.age || "",
    height: user?.height || "",
    weight: user?.weight || "",
    goal: user?.goal || "Maintain healthy eating habits",
  });

  const [tempProfile, setTempProfile] = useState({ ...profile });

  // Update profile when user data changes
  useEffect(() => {
    if (user) {
      const updatedProfile = {
        username: user.username || "",
        email: user.email || "",
        age: user.age || "",
        height: user.height || "",
        weight: user.weight || "",
        goal: user.goal || "Maintain healthy eating habits",
      };
      setProfile(updatedProfile);
      setTempProfile(updatedProfile);
    }
  }, [user]);

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, loading]);

  // Show loading while checking auth
  if (loading) {
    return <LoadingScreen message="Loading profile..." />;
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const handleSave = async () => {
    setIsLoading(true);

    try {
      const result = await updateProfile(tempProfile);

      if (result.success) {
        setProfile({ ...tempProfile });
        setIsEditing(false);
        Alert.alert("Success", "Profile updated successfully!");
      } else {
        Alert.alert(
          "Error",
          result.error || "Failed to update profile. Please try again."
        );
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setTempProfile({ ...profile });
    setIsEditing(false);
  };

  const renderField = (label, key, placeholder, keyboardType = "default") => (
    <ProfileField
      label={label}
      value={
        isEditing
          ? tempProfile[key]?.toString() || ""
          : profile[key]?.toString() || ""
      }
      isEditing={isEditing}
      onChangeText={(text) => setTempProfile({ ...tempProfile, [key]: text })}
      placeholder={placeholder}
      keyboardType={keyboardType}
    />
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <TopBar showLogo={true} showSettings={true} />

        <ScrollView style={styles.content}>
          <View style={styles.profileHeader}>
            <Avatar name={profile.username} />
            <Text style={styles.profileName}>{profile.username}</Text>
            {!isEditing && (
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setIsEditing(true)}
              >
                <Text style={styles.editButtonText}>Edit Profile</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            {renderField("Username", "username", "Enter your username")}
            {renderField("Email", "email", "Enter your email", "email-address")}
            {renderField("Age", "age", "Enter your age", "numeric")}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Physical Information</Text>
            {renderField(
              "Height (cm)",
              "height",
              "Enter your height",
              "numeric"
            )}
            {renderField(
              "Weight (kg)",
              "weight",
              "Enter your weight",
              "numeric"
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Goals</Text>
            {renderField("Goal", "goal", "Enter your health goal")}
          </View>

          {isEditing && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSave}
                disabled={isLoading}
              >
                <Text style={styles.buttonText}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleCancel}
                disabled={isLoading}
              >
                <Text style={[styles.buttonText, styles.cancelButtonText]}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          )}
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
  content: {
    flex: 1,
    padding: 20,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 30,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  editButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#3498db",
    borderRadius: 8,
  },
  editButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
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
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: "#3498db",
  },
  cancelButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#e74c3c",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
  },
  cancelButtonText: {
    color: "#e74c3c",
  },
});

export default Profile;
