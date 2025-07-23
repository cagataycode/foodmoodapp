import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { TopBar, Avatar } from "../components";
import { useAuth } from "../contexts/AuthContext";
import PrimaryButton from "../components/buttons/PrimaryButton";
import SecondaryButton from "../components/buttons/SecondaryButton";
import FormField from "../components/form/FormField";

const EditProfile = () => {
  const { isAuthenticated, loading, user, updateProfile } = useAuth();
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

  if (loading) {
    return <Text>Loading...</Text>;
  }
  if (!isAuthenticated) {
    router.replace("/auth/signin");
    return null;
  }

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const result = await updateProfile(tempProfile);
      if (result.success) {
        setProfile({ ...tempProfile });
        Alert.alert("Success", "Profile updated successfully!");
        router.back();
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
    router.back();
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <TopBar showLogo={true} showSettings={true} />
        <ScrollView style={styles.content}>
          <View style={styles.profileHeader}>
            <Avatar name={profile.username} />
            <Text style={styles.profileName}>{profile.username}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <FormField
              label="Username"
              value={tempProfile.username}
              onChangeText={(text) =>
                setTempProfile({ ...tempProfile, username: text })
              }
              placeholder="Enter your username"
              style={{ marginBottom: 18 }}
            />
            <FormField
              label="Email"
              value={tempProfile.email}
              onChangeText={(text) =>
                setTempProfile({ ...tempProfile, email: text })
              }
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              style={{ marginBottom: 18 }}
            />
            <FormField
              label="Age"
              value={tempProfile.age}
              onChangeText={(text) =>
                setTempProfile({ ...tempProfile, age: text })
              }
              placeholder="Enter your age"
              keyboardType="numeric"
              style={{ marginBottom: 18 }}
            />
            <FormField
              label="Height"
              value={tempProfile.height}
              onChangeText={(text) =>
                setTempProfile({ ...tempProfile, height: text })
              }
              placeholder="Enter your height (cm)"
              keyboardType="numeric"
              style={{ marginBottom: 18 }}
            />
            <FormField
              label="Weight"
              value={tempProfile.weight}
              onChangeText={(text) =>
                setTempProfile({ ...tempProfile, weight: text })
              }
              placeholder="Enter your weight (kg)"
              keyboardType="numeric"
              style={{ marginBottom: 18 }}
            />
            <FormField
              label="Goal"
              value={tempProfile.goal}
              onChangeText={(text) =>
                setTempProfile({ ...tempProfile, goal: text })
              }
              placeholder="Enter your goal"
              style={{ marginBottom: 18 }}
            />
          </View>
          <View style={styles.buttonContainer}>
            <PrimaryButton
              onPress={handleSave}
              disabled={isLoading}
              loading={isLoading}
              style={{ marginBottom: 12 }}
            >
              Save Changes
            </PrimaryButton>
            <SecondaryButton onPress={handleCancel} disabled={isLoading}>
              Cancel
            </SecondaryButton>
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
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
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
    color: "#fff",
  },
  cancelButtonText: {
    color: "#e74c3c",
  },
});

export default EditProfile;
