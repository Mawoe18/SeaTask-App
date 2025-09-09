const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');
 
const config = getDefaultConfig(__dirname);

// Add buffer alias for PDF generation
config.resolver.alias = {
  ...config.resolver.alias,
  buffer: require.resolve('buffer'),
};
 
module.exports = withNativeWind(config, { input: './app/global.css' });