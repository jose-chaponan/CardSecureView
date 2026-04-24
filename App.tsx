import React, { useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView, Text } from 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';
import DashboardScreen from './src/features/cards/screens/DashboardScreen';
import LoginScreen from './src/features/auth/screens/LoginScreen';
import { useAuthStore } from './src/features/auth/store/auth.store';
import { RootStackParamList } from './src/navigation/types';

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  const { user, initialized, setUser, setInitialized } = useAuthStore();

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(firebaseUser => {
      setUser(firebaseUser);
      setInitialized();
    });
    return unsubscribe;
  }, [setUser, setInitialized]);

  if (!initialized) {
    return (
      <View style={styles.loading}>
        <Text style={styles.textLoading}>Cargando...</Text>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {user ? (
              <Stack.Screen name="Dashboard" component={DashboardScreen} />
            ) : (
              <Stack.Screen name="Login" component={LoginScreen} />
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1A2E',
  },
  textLoading: {
    color: '#FFFFFF',
    marginBottom: 20,
  },
});

export default App;
