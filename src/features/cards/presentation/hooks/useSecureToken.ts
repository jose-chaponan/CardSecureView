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
    async (_cardId: string): Promise<string> => {
      const timestamp = Math.floor(Date.now() / 1000);
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(`TOKEN-${timestamp}`);
        }, 500);
      });
    },
    [],
  );

  return { getSecureToken };
};
