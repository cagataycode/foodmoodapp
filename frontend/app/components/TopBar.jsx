import React from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { router, usePathname } from "expo-router";
import AppLogo from "../../assets/icons/app-logo.svg";
import UserIcon from "../../assets/icons/user-icon.svg";
import SettingsLogo from "../../assets/icons/settings-logo.svg";

const TopBar = ({
  showLogo = true,
  showProfile = false,
  showSettings = false,
  onLogoPress,
  onProfilePress,
  onSettingsPress,
  customLeftIcon,
  customRightIcon,
  showBack = false,
  onBackPress,
}) => {
  const pathname = usePathname();

  const handleLogoPress = () => {
    if (onLogoPress) {
      onLogoPress();
    } else {
      // If on profile page, go back
      if (pathname === "/main/profile") {
        router.back();
      } else if (pathname !== "/main/dashboard") {
        router.replace("/main/dashboard");
      }
    }
  };

  const handleProfilePress = () => {
    if (onProfilePress) {
      onProfilePress();
    } else {
      if (pathname !== "/main/profile") {
        router.push("/main/profile");
      }
    }
  };

  const handleSettingsPress = () => {
    if (onSettingsPress) {
      onSettingsPress();
    } else {
      if (pathname !== "/main/settings") {
        router.push("/main/settings");
      }
    }
  };

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.header}>
      {showBack ? (
        <TouchableOpacity 
          onPress={handleBackPress} 
          style={styles.backButton} 
          accessible={true} 
          accessibilityLabel="Go back"
        >
          <View style={styles.backArrowBox}>
            <Text style={styles.backArrow}>←</Text>
          </View>
        </TouchableOpacity>
      ) : customLeftIcon ? (
        customLeftIcon
      ) : showLogo ? (
        <TouchableOpacity onPress={handleLogoPress}>
          <AppLogo width={40} height={40} />
        </TouchableOpacity>
      ) : (
        <View />
      )}
      <View style={{ flex: 1 }} />
      {customRightIcon ? (
        customRightIcon
      ) : showProfile ? (
        <TouchableOpacity onPress={handleProfilePress}>
          <UserIcon width={36} height={36} />
        </TouchableOpacity>
      ) : null}
      {showSettings ? (
        <TouchableOpacity onPress={handleSettingsPress}>
          <SettingsLogo width={36} height={36} />
        </TouchableOpacity>
      ) : null}
      {!showProfile && !showSettings && !customRightIcon ? <View /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e1e8ed",
  },
  backButton: {
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  backArrowBox: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  backArrow: {
    fontSize: 24,
    color: "#3498db",
    fontWeight: "bold",
  },
});

export default TopBar;
