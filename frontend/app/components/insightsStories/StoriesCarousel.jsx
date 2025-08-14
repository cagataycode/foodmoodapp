import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import StoryCard from "./StoryCard";

const StoriesCarousel = ({ pages = [] }) => (
  <View style={styles.container}>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {pages.map((p, idx) => (
        <StoryCard key={(p.title || "page") + idx} page={p} />
      ))}
    </ScrollView>
    <View style={styles.dots}>
      {pages.map((_, idx) => (
        <View key={idx} style={[styles.dot, idx === 0 && styles.dotActive]} />
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { marginTop: 12 },
  scrollContent: { paddingHorizontal: 12 },
  dots: { flexDirection: "row", justifyContent: "center", marginTop: 10 },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 3,
  },
  dotActive: { backgroundColor: "#9CA3AF" },
});

export default StoriesCarousel;
