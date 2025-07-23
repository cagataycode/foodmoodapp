import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

const PortionInput = ({ initialPortion = "", onChange }) => {
  const [portion, setPortion] = useState(initialPortion);

  useEffect(() => {
    setPortion(initialPortion);
  }, [initialPortion]);

  const handleChange = (text) => {
    setPortion(text);
    if (onChange) onChange(text);
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Portion Size (optional)</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., 1 bowl, 2 slices"
        value={portion}
        onChangeText={handleChange}
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
});

export default PortionInput;
