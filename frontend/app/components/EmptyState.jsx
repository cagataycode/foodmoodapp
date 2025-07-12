import React from "react";
import { View, Text, StyleSheet } from "react-native";

const EmptyState = ({ message = "Start logging to see your dashboard" }) => {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyText}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
  },
  emptyText: {
    color: "#7f8c8d",
    fontSize: 16,
  },
});

export default EmptyState;
