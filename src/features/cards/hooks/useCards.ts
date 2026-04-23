import { useMemo } from 'react';
import { Card } from '../types/card.types';
import { mockCards } from '../data/cards.mock';

export const useCards = (): { cards: Card[] } => {
  const cards = useMemo(() => mockCards, []);
  return { cards };
};
