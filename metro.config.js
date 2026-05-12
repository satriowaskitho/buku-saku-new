const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Allow .wasm files to be treated as static assets (fixes expo-sqlite web build)
config.resolver.assetExts.push('wasm');

module.exports = withNativeWind(config, { input: './global.css' });
