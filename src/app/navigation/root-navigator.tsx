import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import { useAuthStore } from '../../features/auth/presentation/store/auth.store';
import DashboardScreen from '../../features/cards/presentation/screens/DashboardScreen';
import LoginScreen from '../../features/auth/presentation/screens/LoginScreen';

const Stack = createStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const user = useAuthStore(state => state.user);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
