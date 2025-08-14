import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { TopBar, Avatar, StoriesCarousel, StoriesViewer } from "../components";
import { INSIGHTS_STORIES } from "../constants/insightsStoriesData";
import { useAuth } from "../contexts/AuthContext";

// Removed period list; replaced with single CTA for weekly insights

const Profile = () => {
  const { isAuthenticated, loading, user } = useAuth();
  const [showStories, setShowStories] = useState(false);

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
          <View style={styles.ctaWrap}>
            <TouchableOpacity
              style={styles.ctaCard}
              onPress={() => setShowStories(true)}
              activeOpacity={0.9}
            >
              <View style={styles.ctaBadge}>
                <Text style={styles.ctaBadgeText}>NEW</Text>
              </View>
              <Text style={styles.ctaTitle}>
                Your weekly insights are ready
              </Text>
              <Text style={styles.ctaSubtitle}>Tap to view stories →</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <StoriesViewer
          pages={INSIGHTS_STORIES}
          visible={showStories}
          onClose={() => setShowStories(false)}
        />
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
  ctaWrap: {
    marginTop: 8,
  },
  ctaCard: {
    backgroundColor: "#111827",
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
  ctaBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#22C55E",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 8,
  },
  ctaBadgeText: {
    color: "#052e16",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
  ctaTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 4,
  },
  ctaSubtitle: {
    color: "#9CA3AF",
    fontSize: 14,
    fontWeight: "600",
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
