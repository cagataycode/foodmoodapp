import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { useAuth } from "../contexts/AuthContext";
import GoogleIcon from "../../assets/icons/google-icon.svg";
import AppLogo from "../../assets/icons/app-logo.svg";
import PrimaryButton from "../components/buttons/PrimaryButton";
import SecondaryButton from "../components/buttons/SecondaryButton";
import TextButton from "../components/buttons/TextButton";
import FormField from "../components/form/FormField";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, isAuthenticated, loading } = useAuth();

  // Automatically redirect to dashboard after successful login
  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace("/main/dashboard");
    }
  }, [isAuthenticated, loading]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn(email, password);

      if (result.success) {
        Alert.alert("Success", "Welcome back!");
      } else {
        Alert.alert(
          "Error",
          result.error || "Invalid email or password. Please try again."
        );
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
          <FormField
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            style={{ marginBottom: 18 }}
          />
          <FormField
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry
            autoCapitalize="none"
            style={{ marginBottom: 18 }}
          />
          <PrimaryButton
            onPress={handleSignIn}
            disabled={isLoading}
            loading={isLoading}
            style={{ marginTop: 16 }}
          >
            Sign In
          </PrimaryButton>
        </View>
        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Text style={styles.orText}>Or</Text>
          <View style={styles.divider} />
        </View>
        <SecondaryButton
          onPress={() => alert("Google sign in not implemented in this demo.")}
          style={{ flexDirection: "row", alignItems: "center", marginTop: 16 }}
        >
          <GoogleIcon width={22} height={22} style={{ marginRight: 8 }} />
          <Text style={{ color: "#3498db", fontSize: 18, fontWeight: "700" }}>
            Sign In with Google
          </Text>
        </SecondaryButton>
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TextButton onPress={() => router.push("/auth/signup")}>
            Sign Up
          </TextButton>
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
    marginBottom: 72,
  },
  form: {
    width: "90%",
    maxWidth: 400,
    alignSelf: "center",
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 18,
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

export default SignIn;
