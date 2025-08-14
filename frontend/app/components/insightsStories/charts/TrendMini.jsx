import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { scaleLinear } from "d3-scale";

const TrendMini = ({ data = [], groups = [] }) => {
  if (!data.length) return null;

  const dates = Array.from(new Set(data.map((d) => d.date))).sort();
  const byGroup = groups.map((g) => ({
    name: g.name,
    color: g.color,
    values: dates.map(
      (date) =>
        data.find((d) => d.group === g.name && d.date === date)?.value ?? null
    ),
  }));

  const yScale = scaleLinear().domain([0, 1]).range([8, 28]);

  return (
    <View style={styles.container}>
      {byGroup.map((g) => (
        <View key={g.name} style={styles.row}>
          <View style={styles.legend}>
            <View style={[styles.swatch, { backgroundColor: g.color }]} />
            <Text style={styles.legendText}>{g.name}</Text>
          </View>
          <View style={styles.series}>
            {g.values.map((v, idx) => (
              <View key={g.name + idx} style={styles.pointWrap}>
                <View
                  style={[
                    styles.point,
                    {
                      opacity: v == null ? 0.2 : 1,
                      backgroundColor: g.color,
                      height: yScale(v ?? 0),
                    },
                  ]}
                />
              </View>
            ))}
          </View>
        </View>
      ))}

      <View style={styles.xAxis}>
        {dates.map((d) => (
          <Text key={d} style={styles.tick}>
            {d.slice(5)}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  legend: { width: 140, flexDirection: "row", alignItems: "center" },
  swatch: { width: 12, height: 12, borderRadius: 2, marginRight: 6 },
  legendText: { fontSize: 12, color: "#374151" },
  series: { flex: 1, flexDirection: "row", alignItems: "flex-end" },
  pointWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    height: 32,
  },
  point: { width: 5, borderRadius: 3 },
  xAxis: { marginTop: 6, flexDirection: "row" },
  tick: { flex: 1, textAlign: "center", fontSize: 10, color: "#6B7280" },
});

export default TrendMini;
