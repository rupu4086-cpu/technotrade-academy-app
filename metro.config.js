const { getDefaultConfig } = require('@react-native/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);
// Until Firebase is installed, map the FCM import to the local shim so
// the app bundles and builds. See src/firebase-shim/messaging.js.
config.resolver.extraNodeModules = {
  '@react-native-firebase/messaging': path.resolve(__dirname, 'src/firebase-shim/messaging.js'),
};
module.exports = config;
