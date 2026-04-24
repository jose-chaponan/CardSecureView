import 'react-native-gesture-handler/jestSetup';
import { NativeModules } from 'react-native';

NativeModules.CardSecureModule = {
  openSecureView: jest.fn().mockResolvedValue(undefined),
  addListener: jest.fn(),
  removeListeners: jest.fn(),
};

jest.mock('react-native-config', () => ({
  TEST_EMAIL: 'test@example.com',
  TEST_PASSWORD: 'testpassword',
}));

jest.mock('react-native-uuid', () => ({
  v4: jest.fn().mockReturnValue('mock-uuid-1234'),
}));

jest.mock('@react-native-firebase/auth', () => {
  const mockAuth = {
    signInWithEmailAndPassword: jest.fn().mockResolvedValue({}),
    signOut: jest.fn().mockResolvedValue(undefined),
    onAuthStateChanged: jest.fn().mockReturnValue(jest.fn()),
  };
  return { __esModule: true, default: () => mockAuth };
});

jest.mock('@shopify/flash-list', () => {
  const React = require('react');
  const { FlatList } = require('react-native');
  return {
    FlashList: (props: any) => React.createElement(FlatList, props),
    ListRenderItemInfo: {},
  };
});

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    SafeAreaView: ({ children, style }: any) =>
      React.createElement(View, { style }, children),
    SafeAreaProvider: ({ children }: any) => children,
    useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
  };
});

jest.mock('react-native-gesture-handler', () => {
  const React = require('react');
  const { Text, View } = require('react-native');
  return {
    GestureHandlerRootView: ({ children }: any) => children,
    Text,
    View,
  };
});

jest.mock('@react-navigation/stack', () => ({
  createStackNavigator: () => ({
    Navigator: ({ children }: any) => children,
    Screen: ({ component: Component }: any) => {
      const React = require('react');
      return React.createElement(Component, {});
    },
  }),
}));

jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }: any) => children,
  useNavigation: jest.fn(),
}));
