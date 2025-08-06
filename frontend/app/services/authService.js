import { Alert } from "react-native";

// Validation functions
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  // Minimum 6 characters
  return password.length >= 6;
};

export const validateName = (name) => {
  return name.trim().length >= 2;
};

// Form validation
export const validateSignInForm = (email, password) => {
  if (!email || !password) {
    return { isValid: false, error: "Please fill in all fields" };
  }

  if (!validateEmail(email)) {
    return { isValid: false, error: "Please enter a valid email address" };
  }

  return { isValid: true };
};

export const validateSignUpForm = (name, email, password) => {
  if (!name || !email || !password) {
    return { isValid: false, error: "Please fill in all fields" };
  }

  if (!validateName(name)) {
    return { isValid: false, error: "Name must be at least 2 characters long" };
  }

  if (!validateEmail(email)) {
    return { isValid: false, error: "Please enter a valid email address" };
  }

  if (!validatePassword(password)) {
    return {
      isValid: false,
      error: "Password must be at least 6 characters long",
    };
  }

  return { isValid: true };
};

// Authentication handlers
export const handleSignIn = async (email, password, signIn, setIsLoading) => {
  const validation = validateSignInForm(email, password);
  if (!validation.isValid) {
    Alert.alert("Error", validation.error);
    return { success: false, error: validation.error };
  }

  setIsLoading(true);

  try {
    const result = await signIn(email, password);

    if (result.success) {
      Alert.alert("Success", "Welcome back!");
      return { success: true };
    } else {
      Alert.alert(
        "Error",
        result.error || "Invalid email or password. Please try again."
      );
      return { success: false, error: result.error };
    }
  } catch (error) {
    Alert.alert("Error", "An unexpected error occurred. Please try again.");
    return { success: false, error: "An unexpected error occurred" };
  } finally {
    setIsLoading(false);
  }
};

export const handleSignUp = async (
  name,
  email,
  password,
  signUp,
  setIsLoading
) => {
  const validation = validateSignUpForm(name, email, password);
  if (!validation.isValid) {
    Alert.alert("Error", validation.error);
    return { success: false, error: validation.error };
  }

  setIsLoading(true);

  try {
    const result = await signUp(email, password, name);

    if (result.success) {
      Alert.alert("Success", "Account created successfully!");
      return { success: true };
    } else {
      Alert.alert(
        "Error",
        result.error || "Failed to create account. Please try again."
      );
      return { success: false, error: result.error };
    }
  } catch (error) {
    Alert.alert("Error", "An unexpected error occurred. Please try again.");
    return { success: false, error: "An unexpected error occurred" };
  } finally {
    setIsLoading(false);
  }
};

// Google authentication handler
export const handleGoogleAuth = (isSignUp = false) => {
  const action = isSignUp ? "sign up" : "sign in";
  Alert.alert(
    "Not Implemented",
    `Google ${action} not implemented in this demo.`
  );
};
