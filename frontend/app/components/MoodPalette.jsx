import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const MOODS = [
  { key: "energised", label: "Energised", color: "#D2F5E3", emoji: "⚡️" },
  { key: "sleepy", label: "Sleepy", color: "#E6EAF4", emoji: "😴" },
  { key: "focused", label: "Focused", color: "#D6E4F0", emoji: "🎯" },
  { key: "calm", label: "Calm", color: "#E6F4F1", emoji: "🌿" },
  { key: "anxious", label: "Anxious", color: "#F4E6E6", emoji: "😰" },
  { key: "happy", label: "Happy", color: "#FFF9D6", emoji: "😊" },
  { key: "sad", label: "Sad", color: "#F4E6F1", emoji: "😢" },
  { key: "irritable", label: "Irritable", color: "#F9E7D6", emoji: "😠" },
  { key: "satisfied", label: "Satisfied", color: "#E6F4E6", emoji: "😌" },
  { key: "sluggish", label: "Sluggish", color: "#F4F1E6", emoji: "🐌" },
];

const MoodPalette = ({ selectedMoods = [], onSelect }) => {
  const toggleMood = (key) => {
    if (selectedMoods.includes(key)) {
      onSelect(selectedMoods.filter((m) => m !== key));
    } else {
      onSelect([...selectedMoods, key]);
    }
  };

  return (
    <View style={styles.paletteContainer}>
      {MOODS.map((mood) => (
        <TouchableOpacity
          key={mood.key}
          style={[
            styles.moodButton,
            {
              backgroundColor: mood.color,
              borderColor: selectedMoods.includes(mood.key)
                ? "#3498db"
                : "transparent",
              opacity:
                selectedMoods.length > 0 && !selectedMoods.includes(mood.key)
                  ? 0.5
                  : 1,
            },
          ]}
          onPress={() => toggleMood(mood.key)}
          activeOpacity={0.8}
        >
          <Text style={styles.emoji}>{mood.emoji}</Text>
          <Text style={styles.label}>{mood.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  paletteContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  moodButton: {
    width: "30%",
    aspectRatio: 1.7,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  emoji: {
    fontSize: 22,
    marginBottom: 2,
  },
  label: {
    fontSize: 13,
    color: "#2c3e50",
    fontWeight: "600",
  },
});

export default MoodPalette;
