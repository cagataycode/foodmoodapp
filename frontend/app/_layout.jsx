import { Stack } from "expo-router";
import { AuthProvider } from "./contexts/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="auth/signin"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="auth/signup"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="main"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </AuthProvider>
  );
}
