import { useCallback, useEffect } from 'react';
import { cardSecureService } from '../services/cardSecure.service';
import { useCardsStore } from '../store/cards.store';
import { useSecureToken } from './useSecureToken';

export const useCardSecure = () => {
  const cards = useCardsStore(state => state.cards);
  const { getSecureToken } = useSecureToken();

  useEffect(() => {
    const emitter = cardSecureService.createEventEmitter();
    const subs = [
      emitter.addListener('onSecureViewOpened', cardId =>
        console.log(`Vista segura abierta para: ${cardId}`),
      ),
      emitter.addListener('onCardDataShown', cardId =>
        console.log(`Datos mostrados para: ${cardId}`),
      ),
      emitter.addListener('onValidationError', ({ code, message }) =>
        console.error(`Error de validación [${code}]: ${message}`),
      ),
      emitter.addListener('onSecureViewClosed', ({ cardId, reason }) =>
        console.log(`Vista segura cerrada para ${cardId}. Razón: ${reason}`),
      ),
    ];
    return () => subs.forEach(sub => sub.remove());
  }, []);

  const openSecureView = useCallback(
    async (cardId: string) => {
      const card = cards.find(c => c.cardId === cardId);
      if (!card) return;
      try {
        const token = await getSecureToken(cardId);
        await cardSecureService.openSecureView(
          cardId,
          card.pan,
          card.cvv,
          card.expiry,
          card.holder,
          token,
        );
      } catch (error) {
        console.error('Error al abrir la vista segura:', error);
      }
    },
    [cards, getSecureToken],
  );

  return { openSecureView };
};
