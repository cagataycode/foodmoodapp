import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

const NotesInput = ({ initialNotes = "", onChange }) => {
  const [notes, setNotes] = useState(initialNotes);

  useEffect(() => {
    setNotes(initialNotes);
  }, [initialNotes]);

  const handleChange = (text) => {
    setNotes(text);
    if (onChange) onChange(text);
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Notes (optional)</Text>
      <TextInput
        style={[styles.input, styles.notesInput]}
        placeholder="Any additional thoughts about your meal or mood..."
        value={notes}
        onChangeText={handleChange}
        multiline
        numberOfLines={4}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#e1e8ed",
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: "#2c3e50",
  },
  notesInput: {
    height: 70,
    textAlignVertical: "top",
  },
});

export default NotesInput;
