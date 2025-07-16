import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
  ActionSheetIOS,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import MoodPalette from "./MoodPalette";
import GalleryIcon from "../../assets/icons/gallery-icon.svg";
import apiService from "../services/apiService";
import * as FileSystem from "expo-file-system";

const TIME_OPTIONS = ["Breakfast", "Lunch", "Dinner", "Snack", "Other"];

const LogFoodModal = ({ visible, onClose, onSave, initialLog }) => {
  const [food, setFood] = useState("");
  const [selectedMoods, setSelectedMoods] = useState([]);
  const [time, setTime] = useState("");
  const [portion, setPortion] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (initialLog) {
      setFood(initialLog.food || "");
      setSelectedMoods(
        initialLog.moods || (initialLog.mood ? [initialLog.mood] : [])
      );
      setTime(initialLog.time || "");
      setPortion(initialLog.portion || "");
      setNotes(initialLog.notes || "");
      setImage(initialLog.image || null);
    } else {
      setFood("");
      setSelectedMoods([]);
      setTime("");
      setPortion("");
      setNotes("");
      setImage(null);
    }
  }, [visible, initialLog]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const handleImageIconPress = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Cancel", "Select from gallery", "Take a picture"],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) pickImage();
          if (buttonIndex === 2) takePhoto();
        }
      );
    } else {
      Alert.alert("Add Photo", "", [
        { text: "Select from gallery", onPress: pickImage },
        { text: "Take a picture", onPress: takePhoto },
        { text: "Cancel", style: "cancel" },
      ]);
    }
  };

  // Helper to convert image URI to base64
  const getBase64Image = async (uri) => {
    if (!uri) return null;
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      // Guess mime type from extension (simple)
      const ext = uri.split(".").pop();
      const mime = ext === "jpg" || ext === "jpeg" ? "image/jpeg" : "image/png";
      return `data:${mime};base64,${base64}`;
    } catch (e) {
      return null;
    }
  };

  const handleSave = async () => {
    if (!food.trim() && !image) {
      Alert.alert("Please enter a food name or add a photo.");
      return;
    }
    if (!selectedMoods.length) {
      Alert.alert("Please select at least one mood");
      return;
    }
    setIsLoading(true);
    try {
      let image_base64 = null;
      if (image && !image.startsWith("data:")) {
        image_base64 = await getBase64Image(image);
      } else if (image) {
        image_base64 = image;
      }
      // Map time to meal_type (normalize)
      let meal_type = time.toLowerCase();
      if (!["breakfast", "lunch", "dinner", "snack"].includes(meal_type)) {
        meal_type = "snack";
      }
      const foodLogData = {
        food_name: food,
        meal_type,
        image_base64,
        moods: selectedMoods,
        meal_time: initialLog?.meal_time || new Date().toISOString(),
        portion_size: portion,
        notes,
      };
      let response;
      if (initialLog && initialLog.id) {
        response = await apiService.updateFoodLog(initialLog.id, foodLogData);
      } else {
        response = await apiService.createFoodLog(foodLogData);
      }
      if (response && response.success) {
        onSave(response.data);
        onClose();
      } else {
        Alert.alert("Error", response?.error || "Failed to save log.");
      }
    } catch (e) {
      Alert.alert("Error", e.message || "Failed to save log.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.modalContent}>
          <ScrollView keyboardShouldPersistTaps="handled">
            <Text style={styles.modalTitle}>
              {initialLog ? "Edit Log" : "Log Food + Mood"}
            </Text>
            {/* Food Input and Image Picker */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Food</Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="e.g., Grilled chicken salad"
                  value={food}
                  onChangeText={setFood}
                />
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={handleImageIconPress}
                >
                  <GalleryIcon width={28} height={28} />
                </TouchableOpacity>
              </View>
              {image && (
                <Image source={{ uri: image }} style={styles.foodImage} />
              )}
            </View>
            {/* Mood Palette */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Mood</Text>
              <MoodPalette
                selectedMoods={selectedMoods}
                onSelect={setSelectedMoods}
              />
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
            {/* Save/Cancel Buttons */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}
                disabled={isLoading}
              >
                <Text style={[styles.buttonText, styles.cancelButtonText]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.saveButton,
                  isLoading && styles.saveButtonDisabled,
                ]}
                onPress={handleSave}
                disabled={isLoading}
              >
                <Text style={styles.buttonText}>
                  {isLoading ? "Saving..." : "Save"}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "95%",
    maxWidth: 420,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    maxHeight: "90%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 16,
    textAlign: "center",
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#e1e8ed",
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: "#2c3e50",
  },

  foodImage: {
    width: 100,
    height: 75,
    borderRadius: 10,
    marginTop: 10,
    alignSelf: "flex-start",
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
    fontSize: 14,
    color: "#3498db",
    fontWeight: "600",
  },
  notesInput: {
    height: 70,
    textAlignVertical: "top",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    flex: 1,
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    marginHorizontal: 4,
  },
  saveButton: {
    backgroundColor: "#3498db",
  },
  saveButtonDisabled: {
    backgroundColor: "#bdc3c7",
  },
  cancelButton: {
    backgroundColor: "#f4f4f4",
    borderWidth: 1,
    borderColor: "#e1e8ed",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  cancelButtonText: {
    color: "#3498db",
  },
  iconButton: {
    marginLeft: 8,
    padding: 6,
    borderRadius: 8,
    backgroundColor: "#eaf3fa",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default LogFoodModal;
