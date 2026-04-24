import { act, renderHook } from '@testing-library/react-native';
import { useCardsStore } from '../cards.store';
import { mockCards } from '../../../data/mocks/cards.mock';

describe('useCardsStore', () => {
  beforeEach(() => {
    useCardsStore.setState({ cards: [], isLoading: false });
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('has correct initial state', () => {
    const { result } = renderHook(() => useCardsStore());
    expect(result.current.cards).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it('loadCards sets isLoading to true immediately', () => {
    const { result } = renderHook(() => useCardsStore());
    act(() => result.current.loadCards());
    expect(result.current.isLoading).toBe(true);
  });

  it('loadCards populates cards with mock data after 1500ms', () => {
    const { result } = renderHook(() => useCardsStore());
    act(() => result.current.loadCards());
    act(() => jest.advanceTimersByTime(1500));
    expect(result.current.cards).toEqual(mockCards);
    expect(result.current.isLoading).toBe(false);
  });

  it('cards remain empty before the 1500ms delay elapses', () => {
    const { result } = renderHook(() => useCardsStore());
    act(() => result.current.loadCards());
    act(() => jest.advanceTimersByTime(999));
    expect(result.current.cards).toEqual([]);
  });
});
