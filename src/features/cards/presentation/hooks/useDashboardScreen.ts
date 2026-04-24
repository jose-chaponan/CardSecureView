import { useEffect } from 'react';
import { useAuthStore } from '../../../auth/presentation/store/auth.store';
import { useCards } from './useCards';
import { useCardSecure } from './useCardSecure';
import { Alert } from 'react-native';

export const useDashboardScreen = () => {
  const { cards, isLoading, loadCards } = useCards();
  const {
    validationError,
    clearValidationError,
    openSecureView,
    retrySecureView,
  } = useCardSecure();
  const logout = useAuthStore(state => state.logout);

  useEffect(() => {
    loadCards();
  }, [loadCards]);

  useEffect(() => {
    if (!validationError) return;

    const isExpired = validationError.code === 'TOKEN_EXPIRED';

    Alert.alert(
      isExpired ? 'Token expirado' : 'Token inválido',
      validationError.message,
      isExpired
        ? [
            { text: 'Cerrar', style: 'cancel', onPress: clearValidationError },
            {
              text: 'Reintentar',
              onPress: () => {
                clearValidationError();
                retrySecureView();
              },
            },
          ]
        : [{ text: 'Entendido', onPress: clearValidationError }],
    );
  }, [validationError, clearValidationError, retrySecureView]);

  return {
    cards,
    isLoading,

    openSecureView,
    logout,
  };
};
