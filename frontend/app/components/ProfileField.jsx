import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

const ProfileField = ({
  label,
  value,
  isEditing,
  onChangeText,
  placeholder,
  keyboardType = "default",
}) => {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {isEditing ? (
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          keyboardType={keyboardType}
        />
      ) : (
        <Text style={styles.fieldValue}>{value}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  field: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#7f8c8d",
    marginBottom: 8,
  },
  fieldValue: {
    fontSize: 16,
    color: "#2c3e50",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e1e8ed",
  },
  input: {
    fontSize: 16,
    color: "#2c3e50",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#3498db",
  },
});

export default ProfileField;
