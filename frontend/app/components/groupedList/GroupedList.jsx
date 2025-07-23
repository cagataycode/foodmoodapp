import React from "react";
import { View, Text, StyleSheet } from "react-native";

const GroupedList = ({ groups, renderItem, renderSectionHeader, style }) => (
  <View style={style}>
    {groups.map((group, idx) => (
      <View key={group.title || idx} style={styles.groupSection}>
        {renderSectionHeader ? (
          renderSectionHeader(group.title, group)
        ) : (
          <Text style={styles.groupTitle}>{group.title}</Text>
        )}
        {group.data.map((item, itemIdx) => (
          <View key={item.id || itemIdx} style={styles.itemRow}>
            {renderItem(item, group, itemIdx)}
          </View>
        ))}
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  groupSection: {
    marginBottom: 12,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#7f8c8d",
    marginBottom: 10,
    marginTop: 8,
  },
  itemRow: {
    marginBottom: 0,
  },
});

export default GroupedList;
