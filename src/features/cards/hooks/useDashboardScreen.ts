import { useEffect } from 'react';
import { useAuthStore } from '../../auth/store/auth.store';
import { useCards } from './useCards';
import { useCardSecure } from './useCardSecure';

export const useDashboardScreen = () => {
  const { cards, isLoading, loadCards } = useCards();
  const { openSecureView } = useCardSecure();
  const logout = useAuthStore(state => state.logout);

  useEffect(() => {
    loadCards();
  }, [loadCards]);

  return {
    cards,
    isLoading,
    openSecureView,
    logout,
  };
};
