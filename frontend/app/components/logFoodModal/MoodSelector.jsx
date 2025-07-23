import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import MoodPalette from "../MoodPalette";

const MoodSelector = ({ initialMoods = [], onChange }) => {
  const [selectedMoods, setSelectedMoods] = useState(initialMoods);

  useEffect(() => {
    setSelectedMoods(initialMoods);
  }, [initialMoods]);

  const handleSelect = (moods) => {
    setSelectedMoods(moods);
    if (onChange) onChange(moods);
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Mood</Text>
      <MoodPalette selectedMoods={selectedMoods} onSelect={handleSelect} />
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
});

export default MoodSelector;
