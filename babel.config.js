module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind", jsxRuntime: 'automatic' }],
      "nativewind/babel",
    ],
     plugins: [
      // Expo Router must come AFTER NativeWind
      "expo-router/babel",
      'react-native-worklets-core/plugin',
      
      // Add this if using animations (optional)
      "react-native-reanimated/plugin"
     ]
  };
};