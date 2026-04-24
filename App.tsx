import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AuthSessionProvider from './src/app/providers/auth-session-provider';
import RootNavigator from './src/app/navigation/root-navigator';

const App = () => (
  <GestureHandlerRootView>
    <SafeAreaProvider>
      <AuthSessionProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </AuthSessionProvider>
    </SafeAreaProvider>
  </GestureHandlerRootView>
);

export default App;
