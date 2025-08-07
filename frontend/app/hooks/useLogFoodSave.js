import { useState } from "react";
import { Alert } from "react-native";
import apiService from "../services/apiService";

const useLogFoodSave = ({
  initialLog,
  food,
  image,
  selectedMoods,
  time,
  portion,
  notes,
  onSave,
  onClose,
  getImageBase64,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  // Convert selected moods to mood scores with proper weighting
  const convertMoodsToScores = (moods) => {
    return moods.map((mood, index) => ({
      mood,
      score: 4 - index, // First mood = 4, second = 3, third = 2, fourth = 1
    }));
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
        image_base64 = await getImageBase64();
      } else if (image) {
        image_base64 = image;
      }
      let meal_type = time.toLowerCase();
      if (!["breakfast", "lunch", "dinner", "snack"].includes(meal_type)) {
        meal_type = "snack";
      }

      // Convert moods to mood scores
      const mood_scores = convertMoodsToScores(selectedMoods);

      const foodLogData = {
        food_name: food,
        meal_type,
        image_base64,
        moods: selectedMoods, // Keep for backward compatibility
        mood_scores, // New field with scores
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

  return { handleSave, isLoading };
};

export default useLogFoodSave;
