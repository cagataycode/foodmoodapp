import React, { useState, useImperativeHandle, forwardRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  Alert,
  ActionSheetIOS,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import GalleryIcon from "../../../assets/icons/gallery-icon.svg";

const FoodInputWithImage = forwardRef(
  ({ initialFood = "", initialImage = null, onChange, onImageChange }, ref) => {
    const [food, setFood] = useState(initialFood);
    const [image, setImage] = useState(initialImage);

    const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
        if (onImageChange) onImageChange(result.assets[0].uri);
      }
    };

    const takePhoto = async () => {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
        if (onImageChange) onImageChange(result.assets[0].uri);
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
    const getBase64Image = async () => {
      if (!image) return null;
      if (image.startsWith("data:")) return image;
      try {
        const base64 = await FileSystem.readAsStringAsync(image, {
          encoding: FileSystem.EncodingType.Base64,
        });
        // Guess mime type from extension (simple)
        const ext = image.split(".").pop();
        const mime =
          ext === "jpg" || ext === "jpeg" ? "image/jpeg" : "image/png";
        return `data:${mime};base64,${base64}`;
      } catch (e) {
        return null;
      }
    };

    useImperativeHandle(ref, () => ({
      getImageBase64: getBase64Image,
      getFood: () => food,
      getImage: () => image,
    }));

    const handleFoodChange = (text) => {
      setFood(text);
      if (onChange) onChange(text);
    };

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Food</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="e.g., Grilled chicken salad"
            value={food}
            onChangeText={handleFoodChange}
          />
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleImageIconPress}
          >
            <GalleryIcon width={28} height={28} />
          </TouchableOpacity>
        </View>
        {image ? (
          <Image source={{ uri: image }} style={styles.foodImage} />
        ) : null}
      </View>
    );
  }
);

const styles = StyleSheet.create({
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
  iconButton: {
    marginLeft: 8,
    padding: 6,
    borderRadius: 8,
    backgroundColor: "#eaf3fa",
    alignItems: "center",
    justifyContent: "center",
  },
  foodImage: {
    width: 100,
    height: 75,
    borderRadius: 10,
    marginTop: 10,
    alignSelf: "flex-start",
  },
});

export default FoodInputWithImage;
