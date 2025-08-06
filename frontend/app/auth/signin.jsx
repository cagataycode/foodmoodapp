import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { router } from "expo-router";
import { useAuth } from "../contexts/AuthContext";
import AuthLayout from "../components/auth/AuthLayout";
import FormField from "../components/form/FormField";
import PrimaryButton from "../components/buttons/PrimaryButton";
import { handleSignIn, handleGoogleAuth } from "../services/authService";
import { useSignInForm } from "../hooks/useAuthForm";

const SignIn = () => {
  const { signIn, isAuthenticated, loading } = useAuth();
  const { email, setEmail, password, setPassword, isLoading, setIsLoading } =
    useSignInForm();

  // Automatically redirect to dashboard after successful login
  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace("/main/dashboard");
    }
  }, [isAuthenticated, loading]);

  const onSignIn = async () => {
    const result = await handleSignIn(email, password, signIn, setIsLoading);
    if (result.success) {
      // Navigation is handled by useEffect above
    }
  };

  const onGoogleSignIn = () => {
    handleGoogleAuth(false);
  };

  const onSignUpPress = () => {
    router.push("/auth/signup");
  };

  return (
    <AuthLayout
      googleButtonText="Sign In with Google"
      footerText="Don't have an account?"
      footerLinkText="Sign Up"
      onGooglePress={onGoogleSignIn}
      onFooterLinkPress={onSignUpPress}
    >
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
        onPress={onSignIn}
        disabled={isLoading}
        loading={isLoading}
        style={styles.signInButton}
      >
        Sign In
      </PrimaryButton>
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  signInButton: {
    marginTop: 16,
  },
});

export default SignIn;
