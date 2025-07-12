import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import { router } from "expo-router";
import {
  LogFoodModal,
  TopBar,
  DayGroup,
  LogFoodButton,
  EmptyState,
  LoadingScreen,
} from "../components";
import { groupLogsByDay } from "../utils/dateUtils";
import { useAuth } from "../contexts/AuthContext";

const Dashboard = () => {
  const { isAuthenticated, loading } = useAuth();
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

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, loading]);

  // Show loading while checking auth
  if (loading) {
    return <LoadingScreen message="Loading dashboard..." />;
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const grouped = groupLogsByDay(
    [...logs].sort((a, b) => new Date(b.date) - new Date(a.date))
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
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <SafeAreaView
        style={{ flex: 1, backgroundColor: "#fff" }}
        edges={["top"]}
      >
        <TopBar showLogo={true} showProfile={true} />
        <ScrollView style={styles.content}>
          {reversedGroupedEntries.length === 0 ? (
            <EmptyState />
          ) : (
            reversedGroupedEntries.map(([day, dayLogs]) => (
              <DayGroup
                key={day}
                day={day}
                logs={dayLogs}
                onEditLog={(log) => {
                  setEditingLog(log);
                  setModalVisible(true);
                }}
              />
            ))
          )}
        </ScrollView>
      </SafeAreaView>
      <SafeAreaView style={{ backgroundColor: "#f8f9fa" }} edges={["bottom"]}>
        <LogFoodButton
          onPress={() => {
            setEditingLog(null);
            setModalVisible(true);
          }}
        />
      </SafeAreaView>
      <LogFoodModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingLog(null);
        }}
        onSave={handleSaveLog}
        initialLog={editingLog}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
});

export default Dashboard;
