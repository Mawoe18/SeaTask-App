import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import './global.css';

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#f9fafb' } // bg-gray-50
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="work-order" />
        <Stack.Screen name="maintenance" />
        <Stack.Screen name="survey" />
        <Stack.Screen name="calendar" />
      </Stack>
    </GestureHandlerRootView>
  );
}