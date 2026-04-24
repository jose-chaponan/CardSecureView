import { renderHook } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { useDashboardScreen } from '../useDashboardScreen';
import { mockCards } from '../../../data/mocks/cards.mock';

const mockLoadCards = jest.fn();
const mockOpenSecureView = jest.fn();
const mockRetrySecureView = jest.fn();
const mockClearValidationError = jest.fn();
const mockLogout = jest.fn();

jest.mock('../useCards');
jest.mock('../useCardSecure');
jest.mock('../../../../auth/presentation/store/auth.store');

import { useCards } from '../useCards';
import { useCardSecure } from '../useCardSecure';
import { useAuthStore } from '../../../../auth/presentation/store/auth.store';

const buildCardSecureState = (
  validationError: { code: string; message: string } | null = null,
) => ({
  validationError,
  clearValidationError: mockClearValidationError,
  openSecureView: mockOpenSecureView,
  retrySecureView: mockRetrySecureView,
});

describe('useDashboardScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});

    (useCards as jest.Mock).mockReturnValue({
      cards: mockCards,
      isLoading: false,
      loadCards: mockLoadCards,
    });
    (useCardSecure as jest.Mock).mockReturnValue(buildCardSecureState());
    jest.mocked(useAuthStore).mockImplementation((selector: any) =>
      selector({ logout: mockLogout }),
    );
  });

  afterEach(() => jest.restoreAllMocks());

  it('calls loadCards on mount', () => {
    renderHook(() => useDashboardScreen());
    expect(mockLoadCards).toHaveBeenCalled();
  });

  it('exposes openSecureView from useCardSecure', () => {
    const { result } = renderHook(() => useDashboardScreen());
    expect(typeof result.current.openSecureView).toBe('function');
  });

  it('exposes logout from the auth store', () => {
    const { result } = renderHook(() => useDashboardScreen());
    expect(result.current.logout).toBe(mockLogout);
  });

  it('does not show alert when validationError is null', () => {
    renderHook(() => useDashboardScreen());
    expect(Alert.alert).not.toHaveBeenCalled();
  });

  it('shows "Token expirado" alert with Cerrar and Reintentar for TOKEN_EXPIRED', () => {
    (useCardSecure as jest.Mock).mockReturnValue(
      buildCardSecureState({ code: 'TOKEN_EXPIRED', message: 'El token expiró' }),
    );
    renderHook(() => useDashboardScreen());
    expect(Alert.alert).toHaveBeenCalledWith(
      'Token expirado',
      'El token expiró',
      expect.arrayContaining([
        expect.objectContaining({ text: 'Cerrar' }),
        expect.objectContaining({ text: 'Reintentar' }),
      ]),
    );
  });

  it('shows "Token inválido" alert with only Entendido for TOKEN_INVALID', () => {
    (useCardSecure as jest.Mock).mockReturnValue(
      buildCardSecureState({ code: 'TOKEN_INVALID', message: 'Token inválido' }),
    );
    renderHook(() => useDashboardScreen());
    expect(Alert.alert).toHaveBeenCalledWith(
      'Token inválido',
      'Token inválido',
      [expect.objectContaining({ text: 'Entendido' })],
    );
  });

  it('Cerrar button calls clearValidationError', () => {
    (useCardSecure as jest.Mock).mockReturnValue(
      buildCardSecureState({ code: 'TOKEN_EXPIRED', message: 'expired' }),
    );
    renderHook(() => useDashboardScreen());
    const buttons = (Alert.alert as jest.Mock).mock.calls[0][2];
    const cerrar = buttons.find((b: any) => b.text === 'Cerrar');
    cerrar.onPress();
    expect(mockClearValidationError).toHaveBeenCalled();
  });

  it('Reintentar button clears error and calls retrySecureView', () => {
    (useCardSecure as jest.Mock).mockReturnValue(
      buildCardSecureState({ code: 'TOKEN_EXPIRED', message: 'expired' }),
    );
    renderHook(() => useDashboardScreen());
    const buttons = (Alert.alert as jest.Mock).mock.calls[0][2];
    const reintentar = buttons.find((b: any) => b.text === 'Reintentar');
    reintentar.onPress();
    expect(mockClearValidationError).toHaveBeenCalled();
    expect(mockRetrySecureView).toHaveBeenCalled();
  });
});
