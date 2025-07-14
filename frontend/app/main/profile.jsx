import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { TopBar, Avatar } from "../components";
import { useAuth } from "../contexts/AuthContext";

const periodData = [
  { label: "This Week", days: 7, logs: 21, period: "this-week" },
  { label: "Last Week", days: 7, logs: 21, period: "last-week" },
  { label: "3 Weeks Ago", days: 7, logs: 21, period: "3-weeks-ago" },
  { label: "4 Weeks Ago", days: 7, logs: 21, period: "4-weeks-ago" },
  { label: "This Month", days: 30, logs: 84, period: "this-month" },
];

const Profile = () => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return <Text>Loading...</Text>;
  }
  if (!isAuthenticated) {
    router.replace("/auth/signin");
    return null;
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <TopBar showLogo={true} showSettings={true} />
        <ScrollView style={styles.content}>
          <View style={styles.profileHeader}>
            <Avatar name={user?.username} />
            <Text style={styles.profileName}>{user?.username}</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => router.push("/main/edit-profile")}
            >
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.periodsSection}>
            {periodData.map((period) => (
              <View key={period.period} style={styles.periodGroup}>
                <Text style={styles.periodLabel}>{period.label}</Text>
                <TouchableOpacity
                  style={styles.periodCard}
                  onPress={() =>
                    router.push(`/main/insights?period=${period.period}`)
                  }
                >
                  <Text style={styles.periodCardText}>
                    {period.days} days - {period.logs} logs
                  </Text>
                  <Text style={styles.periodCardArrow}>›</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
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
  profileHeader: {
    alignItems: "center",
    marginBottom: 30,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
    marginTop: 8,
    marginBottom: 8,
  },
  editButton: {
    backgroundColor: "#e67e22",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  periodsSection: {
    marginTop: 8,
  },
  periodGroup: {
    marginBottom: 12,
  },
  periodLabel: {
    fontSize: 15,
    color: "#7f8c8d",
    fontWeight: "600",
    marginBottom: 4,
    marginLeft: 2,
  },
  periodCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dbe4ee",
    paddingVertical: 14,
    paddingHorizontal: 16,
    justifyContent: "space-between",
  },
  periodCardText: {
    fontSize: 16,
    color: "#2c3e50",
    fontWeight: "500",
  },
  periodCardArrow: {
    fontSize: 22,
    color: "#7f8c8d",
    fontWeight: "bold",
    marginLeft: 8,
  },
});

export default Profile;
