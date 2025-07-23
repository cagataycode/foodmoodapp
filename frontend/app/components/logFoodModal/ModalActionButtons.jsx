import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const ModalActionButtons = ({ onSave, onCancel, isLoading }) => (
  <View style={styles.buttonRow}>
    <TouchableOpacity
      style={[styles.button, styles.cancelButton]}
      onPress={onCancel}
      disabled={isLoading}
    >
      <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[
        styles.button,
        styles.saveButton,
        isLoading && styles.saveButtonDisabled,
      ]}
      onPress={onSave}
      disabled={isLoading}
    >
      <Text style={styles.buttonText}>{isLoading ? "Saving..." : "Save"}</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    flex: 1,
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    marginHorizontal: 4,
  },
  saveButton: {
    backgroundColor: "#3498db",
  },
  saveButtonDisabled: {
    backgroundColor: "#bdc3c7",
  },
  cancelButton: {
    backgroundColor: "#f4f4f4",
    borderWidth: 1,
    borderColor: "#e1e8ed",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  cancelButtonText: {
    color: "#3498db",
  },
});

export default ModalActionButtons;
