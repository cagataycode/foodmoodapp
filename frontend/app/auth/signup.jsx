import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useAuth } from "../contexts/AuthContext";
import AuthLayout from "../components/auth/AuthLayout";
import FormField from "../components/form/FormField";
import { Ionicons } from "@expo/vector-icons";
import { handleSignUp, handleGoogleAuth } from "../services/authService";
import { useSignUpForm } from "../hooks/useAuthForm";

const SignUp = () => {
  const { signUp } = useAuth();
  const {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    setIsLoading,
  } = useSignUpForm();

  const onSignUp = async () => {
    const result = await handleSignUp(
      name,
      email,
      password,
      signUp,
      setIsLoading
    );
    if (result.success) {
      router.replace("/main/dashboard");
    }
  };

  const onGoogleSignUp = () => {
    handleGoogleAuth(true);
  };

  const onSignInPress = () => {
    router.push("/auth/signin");
  };

  return (
    <AuthLayout
      googleButtonText="Sign Up with Google"
      footerText="Already have an account?"
      footerLinkText="Sign In"
      onGooglePress={onGoogleSignUp}
      onFooterLinkPress={onSignInPress}
    >
      <FormField
        label="Name"
        value={name}
        onChangeText={setName}
        placeholder="Enter your name"
        keyboardType="default"
        autoCapitalize="words"
        autoCorrect={false}
        style={{ marginBottom: 18 }}
      />
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
      <TouchableOpacity
        style={styles.arrowButton}
        onPress={onSignUp}
        disabled={isLoading}
      >
        <Ionicons name="arrow-forward" size={24} color="#fff" />
      </TouchableOpacity>
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
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
});

export default SignUp;
