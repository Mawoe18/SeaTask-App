import { Stack } from 'expo-router';

export default function MaintenanceLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="UCCForm" options={{ headerShown: false }} />
    </Stack>
  );
}