import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Avatar = ({ name, size = 80, fontSize = 24 }) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <View style={[styles.avatar, { width: size, height: size }]}>
      <Text style={[styles.avatarText, { fontSize }]}>{initials}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 40,
    backgroundColor: "#3498db",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarText: {
    fontWeight: "bold",
    color: "#ffffff",
  },
});

export default Avatar;
