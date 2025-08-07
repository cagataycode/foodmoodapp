import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import EditIcon from "../../assets/icons/edit-icon.svg";
import { getMoodColorsWithFallback } from "../constants/moodColors";
import { formatTime } from "../utils/dateUtils";
import Card from "./card/Card";

const LogCard = ({ log, onEdit }) => {
  const moodColors = getMoodColorsWithFallback(log);

  return (
    <Card style={styles.logCardContainer}>
      <View
        style={[
          styles.logCardBg,
          {
            flexDirection: "row",
            alignItems: "center",
            position: "relative",
          },
        ]}
      >
        {/* Colored background segments as background */}
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            flexDirection: "row",
            zIndex: 0,
          }}
        >
          {moodColors.length > 1 ? (
            moodColors.map((color, idx) => (
              <View
                key={idx}
                style={{
                  flex: 1,
                  backgroundColor: color,
                  borderTopLeftRadius: idx === 0 ? 12 : 0,
                  borderBottomLeftRadius: idx === 0 ? 12 : 0,
                  borderTopRightRadius: idx === moodColors.length - 1 ? 12 : 0,
                  borderBottomRightRadius:
                    idx === moodColors.length - 1 ? 12 : 0,
                }}
              />
            ))
          ) : (
            <View
              style={{
                flex: 1,
                backgroundColor: moodColors[0] || "#fff",
                borderRadius: 12,
              }}
            />
          )}
        </View>

        {/* Row layout: image | text/time | edit icon */}
        <View style={styles.logCardRow}>
          {log.image && (
            <Image
              source={{ uri: log.image }}
              style={styles.logCardImageOverlay}
            />
          )}
          <View style={styles.logCardTextCol}>
            <Text style={styles.logFood}>{log.food || ""}</Text>
            <Text style={styles.logTime}>
              {formatTime(log.loggedAt || log.date)}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => onEdit(log)}
            style={styles.logEditIcon}
          >
            <EditIcon width={22} height={22} />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  logCardContainer: {
    position: "relative",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 4,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    minHeight: 56,
  },
  logCardBg: {
    flex: 1,
    minHeight: 56,
  },
  logCardRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  logCardTextCol: {
    flex: 1,
    alignItems: "center",
  },
  logFood: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
    textAlign: "center",
  },
  logTime: {
    fontSize: 12,
    color: "#7f8c8d",
    marginTop: 4,
  },
  logCardImageOverlay: {
    position: "absolute",
    left: 0,
    top: "50%",
    width: 56,
    height: 56,
    borderRadius: 12,
    transform: [{ translateY: -28 }],
    zIndex: 15,
  },
  logEditIcon: {
    position: "absolute",
    right: 16,
    top: "50%",
    transform: [{ translateY: -11 }], // half of icon height for vertical centering
    zIndex: 20,
  },
});

export default LogCard;
