import React from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import AppLogo from "../../../assets/icons/app-logo.svg";
import GoogleIcon from "../../../assets/icons/google-icon.svg";
import SecondaryButton from "../buttons/SecondaryButton";
import TextButton from "../buttons/TextButton";

const AuthLayout = ({
  children,
  googleButtonText,
  footerText,
  footerLinkText,
  onGooglePress,
  onFooterLinkPress,
}) => {
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.logoContainer}>
          <AppLogo width={96} height={96} />
        </View>

        <View style={styles.form}>{children}</View>

        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Text style={styles.orText}>Or</Text>
          <View style={styles.divider} />
        </View>

        <SecondaryButton onPress={onGooglePress} style={styles.googleButton}>
          <GoogleIcon width={22} height={22} style={{ marginRight: 8 }} />
          <Text style={styles.googleButtonText}>{googleButtonText}</Text>
        </SecondaryButton>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{footerText} </Text>
          <TextButton onPress={onFooterLinkPress}>{footerLinkText}</TextButton>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 32,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 72,
  },
  form: {
    width: "90%",
    maxWidth: 400,
    alignSelf: "center",
    marginBottom: 32,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
    alignSelf: "center",
    marginVertical: 18,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#e1e8ed",
  },
  orText: {
    marginHorizontal: 12,
    color: "#7f8c8d",
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  googleButtonText: {
    color: "#3498db",
    fontSize: 18,
    fontWeight: "700",
  },
  footer: {
    flexDirection: "row",
    marginTop: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  footerText: {
    fontSize: 15,
    color: "#7f8c8d",
  },
});

export default AuthLayout;
