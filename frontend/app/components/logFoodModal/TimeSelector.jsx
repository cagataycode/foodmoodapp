import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const TimeSelector = ({ initialTime = "", onChange, options }) => {
  const [time, setTime] = useState(initialTime);

  useEffect(() => {
    setTime(initialTime);
  }, [initialTime]);

  const handleSelect = (opt) => {
    setTime(opt);
    if (onChange) onChange(opt);
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Time of Meal (optional)</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginVertical: 6 }}
      >
        {options.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[
              styles.timeButton,
              time === opt && styles.timeButtonSelected,
            ]}
            onPress={() => handleSelect(opt)}
          >
            <Text
              style={[styles.timeButtonText, time === opt && { color: "#fff" }]}
            >
              {opt}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
  timeButton: {
    backgroundColor: "#eaf3fa",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
  },
  timeButtonSelected: {
    backgroundColor: "#3498db",
  },
  timeButtonText: {
    fontSize: 14,
    color: "#3498db",
    fontWeight: "600",
  },
});

export default TimeSelector;
