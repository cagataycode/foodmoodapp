import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Pressable,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import StoryCard from "./StoryCard";

const { width, height } = Dimensions.get("window");

const AUTO_ADVANCE_MS = 4500;

const StoriesViewer = ({ pages = [], visible, onClose }) => {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);
  const insets = useSafeAreaInsets();
  const [isPaused, setIsPaused] = useState(false);
  const pausedProgressRef = useRef(0);

  useEffect(() => {
    if (!visible) return;
    setIndex(0);
    setProgress(0);
    pausedProgressRef.current = 0;
    setIsPaused(false);
  }, [visible]);

  useEffect(() => {
    clearInterval(timerRef.current);
    if (!visible || isPaused) return;
    const startedAt = Date.now() - pausedProgressRef.current * AUTO_ADVANCE_MS;
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const p = Math.min(1, elapsed / AUTO_ADVANCE_MS);
      setProgress(p);
      if (p >= 1) {
        handleNext();
      }
    }, 100);
    return () => clearInterval(timerRef.current);
  }, [index, visible, isPaused]);

  const handleNext = () => {
    if (index < pages.length - 1) {
      setIndex(index + 1);
      setProgress(0);
      pausedProgressRef.current = 0;
      setIsPaused(false);
    } else {
      onClose?.();
    }
  };

  const handlePrev = () => {
    if (index > 0) {
      setIndex(index - 1);
      setProgress(0);
      pausedProgressRef.current = 0;
      setIsPaused(false);
    } else {
      onClose?.();
    }
  };

  const handleHoldStart = () => {
    pausedProgressRef.current = progress;
    setIsPaused(true);
  };

  const handleHoldEnd = () => {
    setIsPaused(false);
  };

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <StatusBar
        style="dark"
        hidden={false}
        translucent
        backgroundColor="transparent"
      />
      <View
        style={[
          styles.progressRow,
          { top: Math.max(6, (insets?.top || 0) + 6) },
        ]}
        pointerEvents="none"
      >
        {pages.map((_, i) => (
          <View key={i} style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width:
                    i < index
                      ? "100%"
                      : i === index
                      ? `${Math.round(progress * 100)}%`
                      : 0,
                },
              ]}
            />
          </View>
        ))}
      </View>

      <View style={styles.cardWrap}>
        <StoryCard page={pages[index]} fullscreen />
      </View>

      <View style={styles.tappableZones}>
        <TouchableOpacity
          style={styles.leftZone}
          activeOpacity={0.5}
          onPress={handlePrev}
        />
        <Pressable
          style={styles.centerHoldZone}
          onPressIn={handleHoldStart}
          onPressOut={handleHoldEnd}
        />
        <TouchableOpacity
          style={styles.rightZone}
          activeOpacity={0.5}
          onPress={handleNext}
        />
      </View>

      <TouchableOpacity
        accessibilityRole="button"
        onPress={onClose}
        style={[
          styles.closeButton,
          { top: Math.max(8, (insets?.top || 0) + 2) },
        ]}
      >
        <Text style={styles.closeText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  progressRow: {
    position: "absolute",
    top: 8,
    left: 16,
    right: 16,
    flexDirection: "row",
    gap: 6,
    zIndex: 3,
  },
  progressTrack: {
    flex: 1,
    height: 4,
    backgroundColor: "rgba(255,255,255,0.35)",
    borderRadius: 3,
    overflow: "hidden",
    borderWidth: 0.5,
    borderColor: "rgba(0,0,0,0.25)",
  },
  progressFill: {
    height: 4,
    backgroundColor: "#fff",
    borderRightWidth: 0.5,
    borderColor: "rgba(0,0,0,0.25)",
  },
  cardWrap: {
    width: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tappableZones: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
  },
  leftZone: { flex: 1 },
  centerHoldZone: { flex: 2 },
  rightZone: { flex: 1 },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 12,
    padding: 10,
    zIndex: 4,
  },
  closeText: {
    color: "#fff",
    fontSize: 18,
  },
});

export default StoriesViewer;
