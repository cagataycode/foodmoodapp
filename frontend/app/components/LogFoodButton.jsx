import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const LogFoodButton = ({ onPress }) => {
  return (
    <View style={styles.logFoodBar}>
      <TouchableOpacity style={styles.logFoodButton} onPress={onPress}>
        <Text style={styles.logFoodButtonText}>Log Food</Text>
        <Ionicons
          name="add"
          size={22}
          color="#3498db"
          style={{ marginLeft: 6 }}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  logFoodBar: {
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 8,
  },
  logFoodButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderWidth: 1.5,
    borderColor: "#e1e8ed",
  },
  logFoodButtonText: {
    color: "#3498db",
    fontSize: 17,
    fontWeight: "700",
  },
});

export default LogFoodButton;
