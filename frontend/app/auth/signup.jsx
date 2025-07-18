import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from "react-native";
import { router } from "expo-router";
import { useAuth } from "../contexts/AuthContext";
import GoogleIcon from "../../assets/icons/google-icon.svg";
import AppLogo from "../../assets/icons/app-logo.svg";
import { Ionicons } from "@expo/vector-icons";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();

  const handleSignUp = async () => {
    if (!name || !email || !password) {
      alert("Please fill in all fields");
      return;
    }
    setIsLoading(true);
    try {
      const result = await signUp(email, password);
      if (result.success) {
        router.replace("/main/dashboard");
      } else {
        alert(result.error || "Failed to create account. Please try again.");
      }
    } catch (error) {
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    alert("Google sign up not implemented in this demo.");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.logoContainer}>
          <AppLogo width={96} height={96} />
        </View>
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              value={name}
              onChangeText={setName}
              keyboardType="default"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>
          <TouchableOpacity
            style={styles.arrowButton}
            onPress={handleSignUp}
            disabled={isLoading}
          >
            <Ionicons name="arrow-forward" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Text style={styles.orText}>Or</Text>
          <View style={styles.divider} />
        </View>
        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleGoogleSignUp}
        >
          <GoogleIcon width={22} height={22} style={{ marginRight: 8 }} />
          <Text style={styles.googleButtonText}>Sign Up with Google</Text>
        </TouchableOpacity>
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/auth/signin")}>
            <Text style={styles.linkText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 32,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  form: {
    width: "90%",
    maxWidth: 400,
    alignSelf: "center",
    marginBottom: 32,
  },
  label: {
    fontSize: 15,
    color: "#2c3e50",
    marginBottom: 6,
    marginLeft: 2,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: "#2c3e50",
    marginBottom: 18,
  },
  arrowButton: {
    backgroundColor: "#232b36",
    borderRadius: 10,
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 8,
    marginBottom: 8,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
    alignSelf: "center",
    marginVertical: 18,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#e1e8ed",
  },
  orText: {
    marginHorizontal: 12,
    color: "#7f8c8d",
    fontSize: 15,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e1e8ed",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 18,
    width: "80%",
    alignSelf: "center",
    marginBottom: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  googleButtonText: {
    fontSize: 16,
    color: "#2c3e50",
    fontWeight: "500",
    marginLeft: 8,
  },
  footer: {
    flexDirection: "row",
    marginTop: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  footerText: {
    fontSize: 15,
    color: "#7f8c8d",
  },
  linkText: {
    fontSize: 15,
    color: "#3498db",
    fontWeight: "600",
  },
});

export default SignUp;
