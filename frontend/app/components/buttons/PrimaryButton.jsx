import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from "react-native";

const PrimaryButton = ({
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
        <ActivityIndicator color="#fff" />
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
    backgroundColor: "#3498db",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 120,
  },
  buttonDisabled: {
    backgroundColor: "#bdc3c7",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});

export default PrimaryButton;
