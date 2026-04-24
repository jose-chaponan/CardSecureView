import { renderHook } from '@testing-library/react-native';
import { useCards } from '../useCards';
import { useCardsStore } from '../../store/cards.store';
import { mockCards } from '../../../data/mocks/cards.mock';

describe('useCards', () => {
  beforeEach(() => {
    useCardsStore.setState({ cards: [], isLoading: false });
  });

  it('exposes cards from the store', () => {
    useCardsStore.setState({ cards: mockCards, isLoading: false });
    const { result } = renderHook(() => useCards());
    expect(result.current.cards).toEqual(mockCards);
  });

  it('exposes isLoading from the store', () => {
    useCardsStore.setState({ cards: [], isLoading: true });
    const { result } = renderHook(() => useCards());
    expect(result.current.isLoading).toBe(true);
  });

  it('exposes loadCards as a function', () => {
    const { result } = renderHook(() => useCards());
    expect(typeof result.current.loadCards).toBe('function');
  });

  it('returns empty cards when store is not loaded yet', () => {
    const { result } = renderHook(() => useCards());
    expect(result.current.cards).toHaveLength(0);
  });
});
