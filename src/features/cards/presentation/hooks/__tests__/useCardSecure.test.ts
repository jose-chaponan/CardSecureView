import { act, renderHook } from '@testing-library/react-native';
import { useCardSecure } from '../useCardSecure';
import { useCardsStore } from '../../store/cards.store';
import { mockCards } from '../../../data/mocks/cards.mock';

jest.mock('../../../data/services/card-secure.service', () => ({
  cardSecureService: {
    openSecureView: jest.fn().mockResolvedValue(undefined),
    createEventEmitter: jest.fn(),
  },
}));

jest.mock('../../../domain/use-cases/open-secure-view.use-case', () => ({
  openSecureViewUseCase: jest.fn().mockResolvedValue(undefined),
}));

import { cardSecureService } from '../../../data/services/card-secure.service';
import { openSecureViewUseCase } from '../../../domain/use-cases/open-secure-view.use-case';

type Listener = (data: any) => void;
let capturedListeners: Record<string, Listener> = {};
const mockSub = { remove: jest.fn() };

beforeEach(() => {
  capturedListeners = {};
  mockSub.remove.mockClear();
  useCardsStore.setState({ cards: mockCards, isLoading: false });
  jest.clearAllMocks();
  jest.useFakeTimers();

  (cardSecureService.createEventEmitter as jest.Mock).mockReturnValue({
    addListener: jest.fn().mockImplementation((event: string, cb: Listener) => {
      capturedListeners[event] = cb;
      return mockSub;
    }),
  });
  (cardSecureService.openSecureView as jest.Mock).mockResolvedValue(undefined);
  (openSecureViewUseCase as jest.Mock).mockResolvedValue(undefined);
});

afterEach(() => {
  jest.useRealTimers();
});

const openCard = async (
  result: { current: ReturnType<typeof useCardSecure> },
  cardId: string,
) => {
  await act(async () => {
    const promise = result.current.openSecureView(cardId);
    jest.advanceTimersByTime(500);
    await promise;
  });
};

describe('useCardSecure', () => {
  it('initializes with no validation error', () => {
    const { result } = renderHook(() => useCardSecure());
    expect(result.current.validationError).toBeNull();
  });

  it('sets validationError when onValidationError event fires', () => {
    const { result } = renderHook(() => useCardSecure());
    act(() => {
      capturedListeners['onValidationError']?.({
        code: 'TOKEN_EXPIRED',
        message: 'expired',
      });
    });
    expect(result.current.validationError).toEqual({
      code: 'TOKEN_EXPIRED',
      message: 'expired',
    });
  });

  it('clearValidationError resets error to null', () => {
    const { result } = renderHook(() => useCardSecure());
    act(() => {
      capturedListeners['onValidationError']?.({
        code: 'TOKEN_INVALID',
        message: 'invalid',
      });
    });
    act(() => result.current.clearValidationError());
    expect(result.current.validationError).toBeNull();
  });

  it('openSecureView calls openSecureViewUseCase for a known card', async () => {
    const { result } = renderHook(() => useCardSecure());
    await openCard(result, mockCards[0].cardId);
    expect(openSecureViewUseCase).toHaveBeenCalledWith(
      mockCards[0],
      expect.stringMatching(/^TOKEN-\d+$/),
    );
  });

  it('openSecureView does nothing when cardId is not found', async () => {
    const { result } = renderHook(() => useCardSecure());
    await openCard(result, 'nonexistent_card');
    expect(openSecureViewUseCase).not.toHaveBeenCalled();
  });

  it('openSecureView clears previous validationError before opening', async () => {
    const { result } = renderHook(() => useCardSecure());
    act(() => {
      capturedListeners['onValidationError']?.({
        code: 'TOKEN_EXPIRED',
        message: 'old error',
      });
    });
    await openCard(result, mockCards[0].cardId);
    expect(result.current.validationError).toBeNull();
  });

  it('retrySecureView calls openSecureView with the last used cardId', async () => {
    const { result } = renderHook(() => useCardSecure());
    await openCard(result, mockCards[1].cardId);
    jest.clearAllMocks();
    (openSecureViewUseCase as jest.Mock).mockResolvedValue(undefined);

    await act(async () => {
      result.current.retrySecureView();
      jest.advanceTimersByTime(500);
    });

    expect(openSecureViewUseCase).toHaveBeenCalledWith(
      mockCards[1],
      expect.stringMatching(/^TOKEN-\d+$/),
    );
  });

  it('removes all 4 event listeners on unmount', () => {
    const { unmount } = renderHook(() => useCardSecure());
    unmount();
    expect(mockSub.remove).toHaveBeenCalledTimes(4);
  });

  it('registers listeners for all four native events', () => {
    renderHook(() => useCardSecure());
    expect(Object.keys(capturedListeners)).toEqual(
      expect.arrayContaining([
        'onSecureViewOpened',
        'onCardDataShown',
        'onValidationError',
        'onSecureViewClosed',
      ]),
    );
  });
});
