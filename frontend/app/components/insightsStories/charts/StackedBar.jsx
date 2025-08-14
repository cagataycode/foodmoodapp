import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { scaleLinear } from "d3-scale";

const StackedBar = ({ categories = [], series = [] }) => {
  if (!categories.length || !series.length) return null;

  const totals = categories.map((_, idx) =>
    series.reduce((sum, s) => sum + (s.data[idx] || 0), 0)
  );
  const maxTotal = Math.max(...totals, 1);
  const heightScale = scaleLinear().domain([0, maxTotal]).range([0, 100]);

  return (
    <View style={styles.container}>
      <View style={styles.barsWrap}>
        {categories.map((cat, catIdx) => {
          const total = totals[catIdx] || 1;
          return (
            <View key={cat} style={styles.barCol}>
              <View
                style={[
                  styles.barStackTrack,
                  { height: heightScale(total) + 40 },
                ]}
              >
                {series.map((s) => {
                  const value = s.data[catIdx] || 0;
                  return (
                    <View
                      key={`${s.name}-${cat}`}
                      style={[
                        styles.segment,
                        {
                          width: `${(value / total) * 100}%`,
                          backgroundColor: s.color || "#bbb",
                        },
                      ]}
                    />
                  );
                })}
              </View>
              <Text style={styles.catLabel}>{cat}</Text>
            </View>
          );
        })}
      </View>

      <View style={styles.legendWrap}>
        {series.map((s) => (
          <View key={s.name} style={styles.legendItem}>
            <View
              style={[
                styles.legendSwatch,
                { backgroundColor: s.color || "#bbb" },
              ]}
            />
            <Text style={styles.legendText}>{s.name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 12 },
  barsWrap: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    paddingHorizontal: 8,
  },
  barCol: { alignItems: "center", flex: 1 },
  barStackTrack: {
    height: 100,
    width: "100%",
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    overflow: "hidden",
    flexDirection: "row",
  },
  segment: { height: "100%" },
  catLabel: { marginTop: 6, fontSize: 12, color: "#6B7280" },
  legendWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
    marginBottom: 6,
  },
  legendSwatch: { width: 12, height: 12, borderRadius: 2, marginRight: 6 },
  legendText: { fontSize: 12, color: "#374151" },
});

export default StackedBar;
