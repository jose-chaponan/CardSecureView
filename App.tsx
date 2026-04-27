import React, { Component, ReactNode } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AuthSessionProvider from './src/app/providers/auth-session-provider';
import RootNavigator from './src/app/navigation/root-navigator';

class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text>Algo salió mal. Por favor reinicia la aplicación.</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

const App = () => (
  <ErrorBoundary>
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <AuthSessionProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </AuthSessionProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  </ErrorBoundary>
);

export default App;

// styles

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
