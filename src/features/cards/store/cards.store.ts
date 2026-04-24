import { create } from 'zustand';
import { Card } from '../types/card.types';
import { mockCards } from '../data/cards.mock';

interface CardsState {
  cards: Card[];
  isLoading: boolean;
  loadCards: () => void;
}

export const useCardsStore = create<CardsState>(set => ({
  cards: [],
  isLoading: false,
  loadCards: () => {
    set({ isLoading: true });
    setTimeout(() => {
      set({ cards: mockCards, isLoading: false });
    }, 1500);
  },
}));
