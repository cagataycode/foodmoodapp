import React from "react";
import { View, Text, StyleSheet } from "react-native";

const BarRow = ({ data, title }) => {
  if (!data?.length) return null;
  const maxValue = Math.max(...data.map((d) => d.value));
  return (
    <View style={styles.container}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {data.map((item) => {
        const widthPercent = `${(item.value / maxValue) * 100}%`;
        return (
          <View key={item.label} style={styles.row}>
            <Text style={styles.label} numberOfLines={1}>
              {item.label}
            </Text>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: widthPercent }]} />
            </View>
            <Text style={styles.value}>{item.value}</Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    width: "100%",
  },
  title: {
    fontSize: 13,
    fontWeight: "600",
    color: "#7f8c8d",
    marginBottom: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    flex: 1,
    fontSize: 13,
    color: "#2c3e50",
    marginRight: 8,
  },
  barTrack: {
    flex: 2,
    height: 8,
    backgroundColor: "#E6ECF2",
    borderRadius: 8,
    overflow: "hidden",
  },
  barFill: {
    height: 8,
    backgroundColor: "#95A5A6",
    borderRadius: 8,
  },
  value: {
    width: 30,
    textAlign: "right",
    fontSize: 13,
    color: "#7f8c8d",
    marginLeft: 8,
  },
});

export default BarRow;
