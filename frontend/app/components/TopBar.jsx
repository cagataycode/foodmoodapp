import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
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
}) => {
  const pathname = usePathname();

  const handleLogoPress = () => {
    if (onLogoPress) {
      onLogoPress();
    } else {
      // Only navigate if we're not already on the dashboard
      if (pathname !== "/main/dashboard") {
        // If we're on profile or settings, go back to dashboard
        // If we're on any other page, replace to dashboard
        if (pathname === "/main/profile" || pathname === "/main/settings") {
          router.back();
        } else {
          router.replace("/main/dashboard");
        }
      }
    }
  };

  const handleProfilePress = () => {
    if (onProfilePress) {
      onProfilePress();
    } else {
      // Only navigate if we're not already on the profile page
      if (pathname !== "/main/profile") {
        router.push("/main/profile");
      }
    }
  };

  const handleSettingsPress = () => {
    if (onSettingsPress) {
      onSettingsPress();
    } else {
      // Only navigate if we're not already on the settings page
      if (pathname !== "/main/settings") {
        router.push("/main/settings");
      }
    }
  };

  return (
    <View style={styles.header}>
      {customLeftIcon ? (
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
      ) : showSettings ? (
        <TouchableOpacity onPress={handleSettingsPress}>
          <SettingsLogo width={36} height={36} />
        </TouchableOpacity>
      ) : (
        <View />
      )}
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
});

export default TopBar;
