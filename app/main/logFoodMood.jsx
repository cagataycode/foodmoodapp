import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Alert,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { router } from "expo-router";
import MoodPalette from "../components/MoodPalette";

const TIME_OPTIONS = ["Breakfast", "Lunch", "Dinner", "Snack", "Other"];

const LogFoodMood = () => {
  const [food, setFood] = useState("");
  const [foodResults, setFoodResults] = useState([]);
  const [showFoodResults, setShowFoodResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [selectedMood, setSelectedMood] = useState(null);
  const [time, setTime] = useState("");
  const [portion, setPortion] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Dummy logs for preview (replace with real storage later)
  const [logs, setLogs] = useState([]);

  const searchFood = async () => {
    if (!food.trim()) return;
    setIsSearching(true);
    setShowFoodResults(true);
    try {
      const res = await fetch(
        `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(
          food
        )}&search_simple=1&action=process&json=1&page_size=10`
      );
      const data = await res.json();
      setFoodResults(data.products || []);
    } catch (e) {
      setFoodResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectFood = (item) => {
    setSelectedFood(item);
    setFood(item.product_name || "");
    setShowFoodResults(false);
  };

  const handleSubmit = async () => {
    if (!food.trim()) {
      Alert.alert("Error", "Please enter or select what you ate");
      return;
    }
    if (!selectedMood) {
      Alert.alert("Error", "Please select your mood");
      return;
    }
    setIsLoading(true);
    try {
      // Save log locally (replace with persistent storage later)
      const newLog = {
        food: selectedFood ? selectedFood.product_name : food,
        mood: selectedMood,
        time,
        portion,
        notes,
        date: new Date().toISOString(),
      };
      setLogs([newLog, ...logs]);
      setFood("");
      setSelectedFood(null);
      setSelectedMood(null);
      setTime("");
      setPortion("");
      setNotes("");
      Alert.alert("Success", "Food and mood logged!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Log Food & Mood</Text>
        <View style={{ width: 50 }} />
      </View>
      <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
        {/* Food Input with OFF Search */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What did you eat?</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="e.g., Grilled chicken salad"
              value={food}
              onChangeText={(t) => {
                setFood(t);
                setSelectedFood(null);
              }}
              onFocus={() => setShowFoodResults(false)}
            />
            <TouchableOpacity
              style={styles.searchButton}
              onPress={searchFood}
              disabled={isSearching}
            >
              {isSearching ? (
                <ActivityIndicator size="small" color="#3498db" />
              ) : (
                <Text style={{ color: "#3498db", fontWeight: "bold" }}>
                  Search
                </Text>
              )}
            </TouchableOpacity>
          </View>
          {showFoodResults && foodResults.length > 0 && (
            <View style={styles.dropdown}>
              <FlatList
                data={foodResults}
                keyExtractor={(item) => item.id || item._id || item.code}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => handleSelectFood(item)}
                  >
                    <Text numberOfLines={1}>
                      {item.product_name || "Unnamed product"}
                    </Text>
                  </TouchableOpacity>
                )}
                style={{ maxHeight: 180 }}
                keyboardShouldPersistTaps="handled"
              />
            </View>
          )}
        </View>
        {/* Mood Palette */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How are you feeling?</Text>
          <MoodPalette selectedMood={selectedMood} onSelect={setSelectedMood} />
        </View>
        {/* Time of Meal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Time of Meal (optional)</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginVertical: 6 }}
          >
            {TIME_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt}
                style={[
                  styles.timeButton,
                  time === opt && styles.timeButtonSelected,
                ]}
                onPress={() => setTime(opt)}
              >
                <Text
                  style={[
                    styles.timeButtonText,
                    time === opt && { color: "#fff" },
                  ]}
                >
                  {opt}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        {/* Portion Size */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Portion Size (optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 1 bowl, 2 slices"
            value={portion}
            onChangeText={setPortion}
          />
        </View>
        {/* Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes (optional)</Text>
          <TextInput
            style={[styles.input, styles.notesInput]}
            placeholder="Any additional thoughts about your meal or mood..."
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
          />
        </View>
        {/* Save Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            isLoading && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text style={styles.submitButtonText}>
            {isLoading ? "Saving..." : "Save Entry"}
          </Text>
        </TouchableOpacity>
        {/* Recent Logs Preview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Logs</Text>
          {logs.length === 0 ? (
            <Text style={{ color: "#7f8c8d" }}>No logs yet.</Text>
          ) : (
            logs.slice(0, 3).map((log, idx) => (
              <View key={idx} style={styles.logItem}>
                <Text style={styles.logFood}>{log.food}</Text>
                <Text style={styles.logMood}>{log.mood}</Text>
                <Text style={styles.logTime}>{log.time}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
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
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e1e8ed",
  },
  backButton: {
    fontSize: 16,
    color: "#3498db",
    fontWeight: "600",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e1e8ed",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: "#2c3e50",
  },
  searchButton: {
    marginLeft: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#eaf3fa",
    borderRadius: 8,
  },
  dropdown: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e1e8ed",
    borderRadius: 8,
    marginTop: 4,
    zIndex: 10,
    position: "absolute",
    width: "100%",
    left: 0,
    top: 56,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f2f6",
  },
  timeButton: {
    backgroundColor: "#eaf3fa",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
  },
  timeButtonSelected: {
    backgroundColor: "#3498db",
  },
  timeButtonText: {
    fontSize: 15,
    color: "#3498db",
    fontWeight: "600",
  },
  notesInput: {
    height: 80,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#3498db",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  submitButtonDisabled: {
    backgroundColor: "#bdc3c7",
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
  logItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  logFood: {
    flex: 2,
    fontWeight: "600",
    color: "#2c3e50",
  },
  logMood: {
    flex: 1,
    textAlign: "center",
    color: "#3498db",
  },
  logTime: {
    flex: 1,
    textAlign: "right",
    color: "#7f8c8d",
  },
});

export default LogFoodMood;
