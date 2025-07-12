import React from "react";
import { View, Text, StyleSheet } from "react-native";
import LogCard from "./LogCard";

const DayGroup = ({ day, logs, onEditLog }) => {
  return (
    <View style={styles.dayGroup}>
      <Text style={styles.dayLabel}>{day}</Text>
      {logs.map((log) => (
        <LogCard key={log.id} log={log} onEdit={onEditLog} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  dayGroup: {
    marginBottom: 24,
  },
  dayLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#7f8c8d",
    marginBottom: 10,
    marginTop: 8,
  },
});

export default DayGroup;
