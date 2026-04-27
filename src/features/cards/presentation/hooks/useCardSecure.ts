import { useCallback, useEffect, useRef, useState } from 'react';
import { cardSecureService } from '../../data/services/card-secure.service';
import { openSecureViewUseCase } from '../../domain/use-cases/open-secure-view.use-case';
import { useCardsStore } from '../store/cards.store';
import { isTokenExpired, useSecureToken } from './useSecureToken';

export interface ValidationError {
  code: string;
  message: string;
}

export const useCardSecure = () => {
  const cards = useCardsStore(state => state.cards);
  const { getSecureToken } = useSecureToken();
  const [validationError, setValidationError] =
    useState<ValidationError | null>(null);
  const lastCardIdRef = useRef<string | null>(null);

  useEffect(() => {
    const emitter = cardSecureService.createEventEmitter();
    const subs = [
      emitter.addListener('onSecureViewOpened', (cardId: string) =>
        console.log(`Vista segura abierta para: ${cardId}`),
      ),
      emitter.addListener('onCardDataShown', (cardId: string) =>
        console.log(`Datos mostrados para: ${cardId}`),
      ),
      emitter.addListener(
        'onValidationError',
        ({ code, message }: ValidationError) =>
          setValidationError({ code, message }),
      ),
      emitter.addListener(
        'onSecureViewClosed',
        ({ cardId, reason }: { cardId: string; reason: string }) =>
          console.log(`Vista segura cerrada para ${cardId}. Razón: ${reason}`),
      ),
    ];
    return () => subs.forEach(sub => sub.remove());
  }, []);

  const clearValidationError = useCallback(() => setValidationError(null), []);

  const openSecureView = useCallback(
    async (cardId: string) => {
      lastCardIdRef.current = cardId;
      setValidationError(null);
      const card = cards.find(c => c.cardId === cardId);
      if (!card) return;
      try {
        const token = await getSecureToken(cardId);
        if (isTokenExpired(token)) {
          setValidationError({
            code: 'TOKEN_EXPIRED',
            message: 'El token de seguridad ha expirado. Intenta nuevamente.',
          });
          return;
        }
        await openSecureViewUseCase(card, token);
      } catch (error) {
        console.error('Error al abrir la vista segura:', error);
      }
    },
    [cards, getSecureToken],
  );

  const retrySecureView = useCallback(() => {
    if (lastCardIdRef.current) {
      openSecureView(lastCardIdRef.current);
    }
  }, [openSecureView]);

  return {
    openSecureView,
    retrySecureView,
    validationError,
    clearValidationError,
  };
};
