import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const TextButton = ({
  onPress,
  disabled,
  children,
  style,
  textStyle,
  ...props
}) => (
  <TouchableOpacity
    style={[styles.button, style]}
    onPress={onPress}
    disabled={disabled}
    activeOpacity={0.6}
    {...props}
  >
    <Text
      style={[styles.buttonText, disabled && styles.disabledText, textStyle]}
    >
      {children}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: "transparent",
    paddingVertical: 6,
    paddingHorizontal: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#3498db",
    fontSize: 16,
    fontWeight: "600",
  },
  disabledText: {
    color: "#bdc3c7",
  },
});

export default TextButton;
