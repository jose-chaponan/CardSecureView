import React, { FC, ReactNode, useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { Text } from 'react-native';
import auth from '@react-native-firebase/auth';
import { useAuthStore } from '../../features/auth/presentation/store/auth.store';

interface AuthSessionProviderProps {
  children: ReactNode;
}

const AuthSessionProvider: FC<AuthSessionProviderProps> = ({ children }) => {
  const { initialized, setUser, setInitialized } = useAuthStore();

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

  return <>{children}</>;
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

export default AuthSessionProvider;
