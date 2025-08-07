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
  { key: "guilty", label: "Guilty", color: "#E6D3E6", emoji: "😳" },
  { key: "craving_more", label: "Craving More", color: "#E2DDE6", emoji: "🍟" },
];

const MoodPalette = ({ selectedMoods = [], onSelect }) => {
  const toggleMood = (key) => {
    if (selectedMoods.includes(key)) {
      // Remove the mood
      onSelect(selectedMoods.filter((m) => m !== key));
    } else {
      // Add the mood (up to 4)
      if (selectedMoods.length < 4) {
        onSelect([...selectedMoods, key]);
      }
    }
  };

  const getMoodOrder = (moodKey) => {
    const index = selectedMoods.indexOf(moodKey);
    return index >= 0 ? index + 1 : null;
  };

  const getOrderColor = (order) => {
    const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4"];
    return colors[order - 1] || "#FF6B6B";
  };

  return (
    <View style={styles.paletteContainer}>
      <Text style={styles.instructionText}>
        Select up to 4 moods (first = highest priority)
      </Text>
      {MOODS.map((mood) => {
        const isSelected = selectedMoods.includes(mood.key);
        const order = getMoodOrder(mood.key);

        return (
          <TouchableOpacity
            key={mood.key}
            style={[
              styles.moodButton,
              {
                backgroundColor: mood.color,
                borderColor: isSelected ? getOrderColor(order) : "transparent",
                borderWidth: isSelected ? 3 : 2,
                opacity: selectedMoods.length >= 4 && !isSelected ? 0.5 : 1,
              },
            ]}
            onPress={() => toggleMood(mood.key)}
            activeOpacity={0.8}
            disabled={selectedMoods.length >= 4 && !isSelected}
          >
            <Text style={styles.emoji}>{mood.emoji}</Text>
            <Text style={styles.label}>{mood.label}</Text>
            {isSelected && order && (
              <View
                style={[
                  styles.orderBadge,
                  { backgroundColor: getOrderColor(order) },
                ]}
              >
                <Text style={styles.orderText}>{order}</Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
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
  instructionText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginBottom: 8,
    fontStyle: "italic",
  },
  moodButton: {
    width: "30%",
    aspectRatio: 1.7,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
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
  orderBadge: {
    position: "absolute",
    top: -8,
    right: -8,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  orderText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default MoodPalette;
