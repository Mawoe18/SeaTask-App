import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import * as FileSystem from 'expo-file-system';
import { useEffect } from 'react';

// Define PDF directory constant
export const PDF_DIRECTORY = `${FileSystem.documentDirectory}SeaTasksPDFs/`;

// Function to create/check PDF directory
export const createPdfDirectory = async () => {
  try {
    const dirInfo = await FileSystem.getInfoAsync(PDF_DIRECTORY);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(PDF_DIRECTORY, { intermediates: true });
      console.log('[App] Created PDF directory:', PDF_DIRECTORY);
    } else {
      console.log('[App] PDF directory already exists:', PDF_DIRECTORY);
    }
    return true;
  } catch (error) {
    console.error('[App] Error creating PDF directory:', error);
    return false;
  }
};

export default function HomeScreen() {
  const router = useRouter();

  // Create/check PDF directory on first load
  useEffect(() => {
    createPdfDirectory();
  }, []);

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-600 py-10 px-4 rounded-b-3xl shadow-sm">
        <Text className="text-white text-2xl font-bold text-center font-sans">Seatec</Text>
      </View>

      {/* Main Content */}
      <View className="flex-1 px-6 pt-8">
        {/* Work Order */}
        <TouchableOpacity
          className="bg-white rounded-xl shadow-sm p-4 flex-row items-center mb-4 border border-gray-100 active:bg-gray-50"
          onPress={() => router.push("/work-order")}
          activeOpacity={0.8}
        >
          <View className="bg-blue-100 p-3 rounded-lg mr-4">
            <MaterialIcons name="assignment" size={24} color="#1E40AF" />
          </View>
          <Text className="text-lg font-medium text-gray-800 flex-1 font-sans">Works Order</Text>
          <MaterialIcons name="chevron-right" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        {/* Maintenance */}
        <TouchableOpacity
          className="bg-white rounded-xl shadow-sm p-4 flex-row items-center mb-4 border border-gray-100 active:bg-gray-50"
          onPress={() => router.push("/maintenance")}
          activeOpacity={0.8}
        >
          <View className="bg-blue-100 p-3 rounded-lg mr-4">
            <FontAwesome5 name="tools" size={22} color="#1E40AF" />
          </View>
          <Text className="text-lg font-medium text-gray-800 flex-1 font-sans">Routine Maintenance</Text>
          <MaterialIcons name="chevron-right" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        {/* Survey */}
        <TouchableOpacity
          className="bg-white rounded-xl shadow-sm p-4 flex-row items-center mb-4 border border-gray-100 active:bg-gray-50"
          onPress={() => router.push("/survey")}
          activeOpacity={0.8}
        >
          <View className="bg-blue-100 p-3 rounded-lg mr-4">
            <MaterialIcons name="assessment" size={24} color="#1E40AF" />
          </View>
          <Text className="text-lg font-medium text-gray-800 flex-1 font-sans">Survey</Text>
          <MaterialIcons name="chevron-right" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {/* Footer - Reduced spacing with justify-around and px-8 */}
      <View className="flex-row justify-around bg-blue-600 px-8 py-4 rounded-t-3xl shadow-sm">
        <TouchableOpacity 
          className="items-center active:opacity-70" 
          onPress={() => router.push("./")}
          activeOpacity={0.8}
        >
          <MaterialIcons name="home" size={26} color="white" />
          <Text className="text-white text-xs mt-1 font-sans">Home</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className="items-center active:opacity-70" 
          onPress={() => router.push("/calendar")}
          activeOpacity={0.8}
        >
          <MaterialIcons name="calendar-today" size={26} color="white" />
          <Text className="text-white text-xs mt-1 font-sans">Calendar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}