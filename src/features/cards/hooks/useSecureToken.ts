import { useCallback } from 'react';

export const useSecureToken = () => {
  const getSecureToken = useCallback(async (cardId: string): Promise<string> => {
    return new Promise(resolve => {
      setTimeout(() => {
        const timestamp = Math.floor(Date.now() / 1000);
        resolve(`TOKEN-${timestamp}`);
      }, 500);
    });
  }, []);

  return { getSecureToken };
};
