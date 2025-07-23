import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from "react-native";

const SecondaryButton = ({
  onPress,
  disabled,
  loading,
  children,
  style,
  textStyle,
  ...props
}) => {
  const isStringChild =
    typeof children === "string" || typeof children === "number";

  return (
    <TouchableOpacity
      style={[styles.button, disabled ? styles.buttonDisabled : null, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color="#3498db" />
      ) : isStringChild ? (
        <Text style={[styles.buttonText, textStyle]}>{children}</Text>
      ) : (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {children}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#3498db",
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 120,
  },
  buttonDisabled: {
    backgroundColor: "#f0f0f0",
    borderColor: "#bdc3c7",
  },
  buttonText: {
    color: "#3498db",
    fontSize: 18,
    fontWeight: "700",
  },
});

export default SecondaryButton;
