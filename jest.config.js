module.exports = {
  preset: '@react-native/jest-preset',
  transformIgnorePatterns: [
    'node_modules/(?!(immer|react-redux|@reduxjs/toolkit|redux-persist|@react-navigation|react-native-css-interop|@react-native-async-storage|(jest-)?react-native|@react-native(-community)?)/)',
  ],
};
