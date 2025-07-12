import React from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";

const LoadingScreen = ({ message = "Loading..." }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#3498db" />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    color: "#7f8c8d",
    textAlign: "center",
  },
});

export default LoadingScreen;
