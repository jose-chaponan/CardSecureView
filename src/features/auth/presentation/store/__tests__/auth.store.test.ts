import { act, renderHook } from '@testing-library/react-native';
import { useAuthStore } from '../auth.store';

jest.mock('../../../domain/use-cases/login.use-case', () => ({
  loginUseCase: jest.fn().mockResolvedValue(undefined),
}));
jest.mock('../../../domain/use-cases/logout.use-case', () => ({
  logoutUseCase: jest.fn().mockResolvedValue(undefined),
}));

import { loginUseCase } from '../../../domain/use-cases/login.use-case';
import { logoutUseCase } from '../../../domain/use-cases/logout.use-case';

const resetStore = () =>
  useAuthStore.setState({ user: null, isLoading: false, initialized: false });

describe('useAuthStore', () => {
  beforeEach(() => {
    resetStore();
    jest.clearAllMocks();
  });

  it('has correct initial state', () => {
    const { result } = renderHook(() => useAuthStore());
    expect(result.current.user).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.initialized).toBe(false);
  });

  it('setUser updates the user in state', () => {
    const { result } = renderHook(() => useAuthStore());
    const mockUser = { uid: 'abc123', email: 'a@b.com' } as any;
    act(() => result.current.setUser(mockUser));
    expect(result.current.user).toEqual(mockUser);
  });

  it('setUser accepts null to clear the session', () => {
    const { result } = renderHook(() => useAuthStore());
    act(() => result.current.setUser({ uid: 'x' } as any));
    act(() => result.current.setUser(null));
    expect(result.current.user).toBeNull();
  });

  it('setInitialized marks store as ready', () => {
    const { result } = renderHook(() => useAuthStore());
    act(() => result.current.setInitialized());
    expect(result.current.initialized).toBe(true);
  });

  it('login calls loginUseCase with credentials', async () => {
    const { result } = renderHook(() => useAuthStore());
    await act(async () => {
      await result.current.login('user@test.com', 'pass');
    });
    expect(loginUseCase).toHaveBeenCalledWith('user@test.com', 'pass');
  });

  it('login resets isLoading to false after success', async () => {
    const { result } = renderHook(() => useAuthStore());
    await act(async () => {
      await result.current.login('user@test.com', 'pass');
    });
    expect(result.current.isLoading).toBe(false);
  });

  it('login resets isLoading to false even when loginUseCase throws', async () => {
    (loginUseCase as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    const { result } = renderHook(() => useAuthStore());
    await act(async () => {
      await result.current.login('user@test.com', 'bad').catch(() => {});
    });
    expect(result.current.isLoading).toBe(false);
  });

  it('logout calls logoutUseCase', async () => {
    const { result } = renderHook(() => useAuthStore());
    await act(async () => {
      await result.current.logout();
    });
    expect(logoutUseCase).toHaveBeenCalled();
  });
});
