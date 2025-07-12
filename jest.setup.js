// Mock React Native modules
jest.mock('react-native', () => ({
  View: 'View',
  Text: 'Text',
  TouchableOpacity: 'TouchableOpacity',
  TextInput: 'TextInput',
  StyleSheet: {
    create: jest.fn((style) => style),
  },
  SafeAreaView: 'SafeAreaView',
  StatusBar: 'StatusBar',
  Keyboard: {
    dismiss: jest.fn(),
  },
  Alert: {
    alert: jest.fn(),
  },
}));

// Mock Expo modules
jest.mock('expo-notifications', () => ({
  setNotificationHandler: jest.fn(),
  cancelAllScheduledNotificationsAsync: jest.fn(),
  scheduleNotificationAsync: jest.fn(),
  SchedulableTriggerInputTypes: {
    TIME_INTERVAL: 'timeInterval',
  },
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

// Mock console methods to avoid noise in tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};

global.alert = jest.fn();