module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind", jsxRuntime: 'automatic' }],
      "nativewind/babel",
    ],
     plugins: [
      // Add worklets plugin BEFORE reanimated
      'react-native-worklets/plugin',
      // Expo Router must come AFTER NativeWind
      "expo-router/babel",
      
    'react-native-reanimated/plugin',
     
     ]
  };
};