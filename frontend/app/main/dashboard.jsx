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
import apiService from "../services/apiService";

const Dashboard = () => {
  const { isAuthenticated, loading } = useAuth();
  const [logs, setLogs] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch logs from backend
  const fetchLogs = async () => {
    setRefreshing(true);
    try {
      const response = await apiService.getFoodLogs();
      if (response && response.success) {
        // Map backend fields to frontend-expected fields
        const mappedLogs = (
          Array.isArray(response.data) ? response.data : []
        ).map((log) => ({
          ...log,
          food: log.food_name,
          date:
            log.meal_time ||
            log.date ||
            log.created_at ||
            new Date().toISOString(),
          image: log.image_base64,
        }));
        setLogs(mappedLogs);
      }
    } catch (e) {
      console.error("Failed to fetch food logs:", e);
      Alert.alert(
        "Error",
        "Unable to fetch food logs. Please try again later.",
        [{ text: "OK" }]
      );
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && !loading) {
      fetchLogs();
    }
  }, [isAuthenticated, loading]);

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, loading]);

  // Show loading while checking auth
  if (loading || refreshing) {
    return <LoadingScreen message="Loading dashboard..." />;
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Prepare groups for GroupedList
  const grouped = groupLogsByDay(logs || []);
  const groupedEntries = Object.entries(grouped);
  const groups = groupedEntries.map(([day, dayLogs]) => ({
    title: day,
    data: dayLogs,
  }));

  const handleSaveLog = () => {
    fetchLogs();
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
          {groups.length === 0 ? (
            <EmptyState />
          ) : (
            <DayGroup
              groups={[...groups].reverse()}
              onEditLog={(log) => {
                setEditingLog(log);
                setModalVisible(true);
              }}
            />
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
