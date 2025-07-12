import { Stack } from "expo-router";

export default function MainLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        // Prevent going back to auth screens
        gestureEnabled: false,
      }}
    >
      <Stack.Screen
        name="dashboard"
        options={{
          // Prevent multiple instances of dashboard
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          // Allow going back to dashboard
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          // Allow going back to dashboard
          gestureEnabled: true,
        }}
      />
    </Stack>
  );
}
