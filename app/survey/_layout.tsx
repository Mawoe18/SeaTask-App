import { Stack } from 'expo-router';

export default function SurveyLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="CCTVSurveyForm" options={{ headerShown: false }} />
      <Stack.Screen name="CybersecuritySurveyForm" options={{ headerShown: false }} />
      <Stack.Screen name="StructuredCablingSurveyForm" options={{ headerShown: false }} />
      <Stack.Screen name="TelephonySurveyForm" options={{ headerShown: false }} />
      <Stack.Screen name="VideoConferenceSurveyForm" options={{ headerShown: false }} />
    </Stack>
  );
}