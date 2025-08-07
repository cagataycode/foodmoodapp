import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import FoodInputWithImage from "./logFoodModal/FoodInputWithImage";
import MoodSelector from "./logFoodModal/MoodSelector";
import TimeSelector from "./logFoodModal/TimeSelector";
import PortionInput from "./logFoodModal/PortionInput";
import NotesInput from "./logFoodModal/NotesInput";
import ModalActionButtons from "./logFoodModal/ModalActionButtons";
import useLogFoodSave from "../hooks/useLogFoodSave";

const TIME_OPTIONS = ["Breakfast", "Lunch", "Dinner", "Snack", "Other"];

const LogFoodModal = ({ visible, onClose, onSave, initialLog }) => {
  const [selectedMoods, setSelectedMoods] = useState([]);
  const [time, setTime] = useState("");
  const [portion, setPortion] = useState("");
  const [notes, setNotes] = useState("");
  const [food, setFood] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (initialLog) {
      setFood(initialLog.food || "");
      setImage(initialLog.image || null);

      // Handle mood scores if available, otherwise fall back to legacy moods
      if (initialLog.mood_scores && initialLog.mood_scores.length > 0) {
        // Extract moods from mood_scores in order of selection (highest score first)
        const moodsFromScores = initialLog.mood_scores
          .sort((a, b) => b.score - a.score)
          .map((ms) => ms.mood);
        setSelectedMoods(moodsFromScores);
      } else {
        // Fallback to legacy moods array
        setSelectedMoods(
          initialLog.moods || (initialLog.mood ? [initialLog.mood] : [])
        );
      }

      setTime(initialLog.time || "");
      setPortion(initialLog.portion || "");
      setNotes(initialLog.notes || "");
    } else {
      setFood("");
      setImage(null);
      setSelectedMoods([]);
      setTime("");
      setPortion("");
      setNotes("");
    }
  }, [visible, initialLog]);

  const foodInputRef = useRef();
  const { handleSave, isLoading } = useLogFoodSave({
    initialLog,
    food,
    image,
    selectedMoods,
    time,
    portion,
    notes,
    onSave,
    onClose,
    getImageBase64: async () => foodInputRef.current?.getImageBase64(),
  });

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
            <FoodInputWithImage
              ref={foodInputRef}
              initialFood={food}
              initialImage={image}
              onChange={setFood}
              onImageChange={setImage}
            />
            <MoodSelector
              initialMoods={selectedMoods}
              onChange={setSelectedMoods}
            />
            <TimeSelector
              initialTime={time}
              onChange={setTime}
              options={TIME_OPTIONS}
            />
            <PortionInput initialPortion={portion} onChange={setPortion} />
            <NotesInput initialNotes={notes} onChange={setNotes} />
            <ModalActionButtons
              onSave={handleSave}
              onCancel={onClose}
              isLoading={isLoading}
            />
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
});

export default LogFoodModal;
