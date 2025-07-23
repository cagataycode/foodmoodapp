import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

const FormField = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  secureTextEntry = false,
  error = "",
  children,
  style,
  inputStyle,
  ...props
}) => (
  <View style={[styles.field, style]}>
    {label ? <Text style={styles.fieldLabel}>{label}</Text> : null}
    <View style={styles.inputRow}>
      <TextInput
        style={[styles.input, inputStyle]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        {...props}
      />
      {children ? <View style={styles.rightElement}>{children}</View> : null}
    </View>
    {error ? <Text style={styles.errorText}>{error}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  field: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#7f8c8d",
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#2c3e50",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#3498db",
  },
  rightElement: {
    marginLeft: 8,
  },
  errorText: {
    color: "#e74c3c",
    fontSize: 13,
    marginTop: 4,
  },
});

export default FormField;
