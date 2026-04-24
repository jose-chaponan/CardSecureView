import { useCardsStore } from '../store/cards.store';

export const useCards = () => {
  const cards = useCardsStore(state => state.cards);
  const isLoading = useCardsStore(state => state.isLoading);
  const loadCards = useCardsStore(state => state.loadCards);
  return { cards, isLoading, loadCards };
};
