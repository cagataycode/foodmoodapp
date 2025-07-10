import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  FlatList,
  Image,
} from "react-native";
import LogFoodModal from "../components/LogFoodModal";
import { Ionicons } from "@expo/vector-icons";
import EditIcon from "../../assets/icons/edit-icon.svg";
import { router } from "expo-router";
import AppLogo from "../../assets/icons/app-logo.svg";
import UserIcon from "../../assets/icons/user-icon.svg";

// Mood color mapping (should match MoodPalette)
const MOOD_COLORS = {
  energised: "#D2F5E3",
  sleepy: "#E6EAF4",
  focused: "#D6E4F0",
  calm: "#E6F4F1",
  anxious: "#F4E6E6",
  happy: "#FFF9D6",
  sad: "#F4E6F1",
  irritable: "#F9E7D6",
  satisfied: "#E6F4E6",
  sluggish: "#F4F1E6",
};

function getDayLabel(dateString) {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString("en-US", { weekday: "long" });
}

function groupLogsByDay(logs) {
  const groups = {};
  logs.forEach((log) => {
    const label = getDayLabel(log.date);
    if (!groups[label]) groups[label] = [];
    groups[label].push(log);
  });
  return groups;
}

// Helper to get mood colors for an array of moods
function getMoodColors(moods) {
  if (!Array.isArray(moods)) return [];
  return moods.map((m) => MOOD_COLORS[m] || "#fff");
}

// Helper to format time
function formatTime(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const Dashboard = () => {
  const [logs, setLogs] = useState([
    // Example logs for UI preview
    {
      id: "1",
      food: "Protein Bar",
      mood: "energised",
      date: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: "2",
      food: "Döner",
      mood: "energised",
      date: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: "3",
      food: "Blueberries",
      mood: "focused",
      date: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "4",
      food: "Aloe Vera Juice",
      mood: "calm",
      date: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "5",
      food: "Energy Drink",
      mood: "anxious",
      date: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "6",
      food: "Mango",
      mood: "happy",
      date: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: "7",
      food: "Grape Jelly",
      mood: "sad",
      date: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: "8",
      food: "Doritos Whopper Flavour",
      mood: "irritable",
      date: new Date().toISOString(),
    },
    {
      id: "9",
      food: "Avocado Toast",
      mood: "satisfied",
      date: new Date().toISOString(),
    },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingLog, setEditingLog] = useState(null);

  const grouped = groupLogsByDay(
    logs.sort((a, b) => new Date(b.date) - new Date(a.date))
  );
  const groupedEntries = Object.entries(grouped);
  const reversedGroupedEntries = groupedEntries.reverse();

  const handleSaveLog = (log) => {
    if (editingLog) {
      setLogs((logs) => logs.map((l) => (l.id === log.id ? log : l)));
    } else {
      setLogs((logs) => [{ ...log, id: Date.now().toString() }, ...logs]);
    }
    setEditingLog(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/main/dashboard")}>
          <AppLogo width={40} height={40} />
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
        <TouchableOpacity onPress={() => router.push("/main/profile")}>
          <UserIcon width={36} height={36} />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.content}>
        {reversedGroupedEntries.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              Start logging to see your dashboard
            </Text>
          </View>
        ) : (
          reversedGroupedEntries.map(([day, dayLogs]) => (
            <View key={day} style={styles.dayGroup}>
              <Text style={styles.dayLabel}>{day}</Text>
              {dayLogs.map((log) => {
                const moodColors = getMoodColors(
                  log.moods || (log.mood ? [log.mood] : [])
                );
                return (
                  <View key={log.id} style={styles.logCardContainer}>
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
                                borderTopRightRadius:
                                  idx === moodColors.length - 1 ? 12 : 0,
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
                          onPress={() => {
                            setEditingLog(log);
                            setModalVisible(true);
                          }}
                          style={styles.logEditIcon}
                        >
                          <EditIcon width={22} height={22} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          ))
        )}
      </ScrollView>
      <View style={styles.logFoodBar}>
        <TouchableOpacity
          style={styles.logFoodButton}
          onPress={() => {
            setEditingLog(null);
            setModalVisible(true);
          }}
        >
          <Text style={styles.logFoodButtonText}>Log Food</Text>
          <Ionicons
            name="add"
            size={22}
            color="#3498db"
            style={{ marginLeft: 6 }}
          />
        </TouchableOpacity>
      </View>
      <LogFoodModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingLog(null);
        }}
        onSave={handleSaveLog}
        initialLog={editingLog}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e1e8ed",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  content: {
    flex: 1,
    padding: 20,
  },
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
  logCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  logCardContainer: {
    position: "relative",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 10,
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
  logCardOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    pointerEvents: "box-none",
  },
  logFood: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
    textAlign: "center",
  },
  logEditIcon: {
    position: "absolute",
    right: 16,
    top: "50%",
    transform: [{ translateY: -11 }], // half of icon height for vertical centering
    zIndex: 20,
  },
  logFoodBar: {
    backgroundColor: "#fff",
    padding: 16,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 8,
  },
  logFoodButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderWidth: 1.5,
    borderColor: "#e1e8ed",
  },
  logFoodButtonText: {
    color: "#3498db",
    fontSize: 17,
    fontWeight: "700",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
  },
  emptyText: {
    color: "#7f8c8d",
    fontSize: 16,
  },
  logCardImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 10,
  },
  logCardImageInside: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 10,
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
  logTime: {
    fontSize: 12,
    color: "#7f8c8d",
    marginTop: 4,
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
});

export default Dashboard;
