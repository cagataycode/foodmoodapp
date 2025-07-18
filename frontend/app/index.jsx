import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { router } from "expo-router";
import AppLogo from "../assets/icons/app-logo.svg";

export default function Index() {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <AppLogo width={96} height={96} />
      </View>
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => router.push("/auth/signin")}
      >
        <Text style={styles.primaryButtonText}>Sign In</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => router.push("/auth/signup")}
      >
        <Text style={styles.secondaryButtonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f8",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  logoContainer: {
    marginBottom: 64,
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: "#3498db",
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 60,
    marginBottom: 18,
    width: 260,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  secondaryButton: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#3498db",
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 60,
    width: 260,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#3498db",
    fontSize: 20,
    fontWeight: "700",
  },
});
