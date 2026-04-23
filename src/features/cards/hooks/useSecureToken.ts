import { useCallback } from 'react';

export const useSecureToken = () => {
  const getSecureToken = useCallback(async (cardId: string): Promise<string> => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(`${cardId}_${Date.now()}_${Math.random().toString(36).substring(2)}`);
      }, 1000);
    });
  }, []);

  return { getSecureToken };
};
