// Shim used ONLY until the owner installs @react-native-firebase.
// Metro maps '@react-native-firebase/messaging' to this file (see
// metro.config.js). When the owner runs
//   yarn add @react-native-firebase/app @react-native-firebase/messaging
// and adds android/app/google-services.json, delete metro.config.js's
// extraNodeModules mapping and the real FCM code in src/notifications.ts
// takes over with no other change.
const messaging = () => ({
  requestPermission: async () => 0,
  getToken: async () => null,
  onMessage: () => () => undefined,
});
messaging.AuthorizationStatus = { AUTHORIZED: 1, PROVISIONAL: 2, DENIED: 0, NOT_DETERMINED: -1 };
module.exports = messaging;
module.exports.default = messaging;
