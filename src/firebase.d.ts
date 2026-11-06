// Type declarations for the optional Firebase Messaging package.
// The real package is installed by the owner (see README + metro shim);
// until then Metro maps the import to src/firebase-shim/messaging.js.
declare module '@react-native-firebase/messaging' {
  const messaging: any;
  export default messaging;
}
