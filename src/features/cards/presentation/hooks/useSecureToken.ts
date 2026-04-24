import { useCallback } from 'react';

const TOKEN_TTL_SECONDS = 30;

export const isTokenExpired = (token: string): boolean => {
  const parts = token.split('-');
  const timestamp = Number(parts.at(-1));
  if (Number.isNaN(timestamp)) return true;
  return Math.floor(Date.now() / 1000) - timestamp > TOKEN_TTL_SECONDS;
};

export const useSecureToken = () => {
  const getSecureToken = useCallback(
    async (cardId: string): Promise<string> => {
      return new Promise(resolve => {
        setTimeout(() => {
          const timestamp = Math.floor(Date.now() / 1000);
          resolve(`TOKEN-${cardId}-${timestamp}`);
        }, 500);
      });
    },
    [],
  );

  return { getSecureToken };
};
