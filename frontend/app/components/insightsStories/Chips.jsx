import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Chips = ({ items }) => {
  if (!items?.length) return null;

  return (
    <View style={styles.wrap}>
      {items.map((chip, idx) => (
        <View key={(chip.label || "chip") + idx} style={styles.chip}>
          <Text style={styles.chipLabel}>{chip.label}</Text>
          {chip.sublabel && <Text style={styles.chipSub}>{chip.sublabel}</Text>}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
    paddingHorizontal: 2,
  },
  chip: {
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
    maxWidth: 180,
  },
  chipLabel: { fontSize: 13, fontWeight: "600", color: "#111827" },
  chipSub: { fontSize: 12, color: "#6B7280" },
});

export default Chips;
