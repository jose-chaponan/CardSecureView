import { act, renderHook } from '@testing-library/react-native';
import { useLoginScreen } from '../useLoginScreen';

const mockLogin = jest.fn();

jest.mock('../../store/auth.store', () => ({
  useAuthStore: () => ({ login: mockLogin, isLoading: false }),
}));

describe('useLoginScreen', () => {
  beforeEach(() => {
    mockLogin.mockReset().mockResolvedValue(undefined);
  });

  it('initializes with pre-filled credentials from config', () => {
    const { result } = renderHook(() => useLoginScreen());
    expect(result.current.email).toBe('test@example.com');
    expect(result.current.password).toBe('testpassword');
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('setEmail updates the email value', () => {
    const { result } = renderHook(() => useLoginScreen());
    act(() => result.current.setEmail('new@email.com'));
    expect(result.current.email).toBe('new@email.com');
  });

  it('setPassword updates the password value', () => {
    const { result } = renderHook(() => useLoginScreen());
    act(() => result.current.setPassword('newpass'));
    expect(result.current.password).toBe('newpass');
  });

  it('handleLogin calls login with trimmed email and current password', async () => {
    const { result } = renderHook(() => useLoginScreen());
    act(() => result.current.setEmail('  user@test.com  '));
    await act(async () => {
      await result.current.handleLogin();
    });
    expect(mockLogin).toHaveBeenCalledWith('user@test.com', 'testpassword');
  });

  it('handleLogin clears previous error before attempting login', async () => {
    mockLogin.mockRejectedValueOnce(new Error('first failure'));
    const { result } = renderHook(() => useLoginScreen());
    await act(async () => {
      await result.current.handleLogin();
    });
    mockLogin.mockResolvedValueOnce(undefined);
    await act(async () => {
      await result.current.handleLogin();
    });
    expect(result.current.error).toBeNull();
  });

  it('handleLogin sets error message when login throws', async () => {
    mockLogin.mockRejectedValueOnce(new Error('invalid'));
    const { result } = renderHook(() => useLoginScreen());
    await act(async () => {
      await result.current.handleLogin();
    });
    expect(result.current.error).toBe(
      'Credenciales inválidas. Verifica tu email y contraseña.',
    );
  });

  it('handleLogin sets error and skips login when email is empty', async () => {
    const { result } = renderHook(() => useLoginScreen());
    act(() => result.current.setEmail(''));
    await act(async () => { await result.current.handleLogin(); });
    expect(result.current.error).toBe('El email es requerido.');
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('handleLogin sets error and skips login when email has no @', async () => {
    const { result } = renderHook(() => useLoginScreen());
    act(() => result.current.setEmail('invalidemail'));
    await act(async () => { await result.current.handleLogin(); });
    expect(result.current.error).toBe('Por favor ingresa un email válido.');
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('handleLogin sets error and skips login when password is empty', async () => {
    const { result } = renderHook(() => useLoginScreen());
    act(() => result.current.setPassword(''));
    await act(async () => { await result.current.handleLogin(); });
    expect(result.current.error).toBe('La contraseña es requerida.');
    expect(mockLogin).not.toHaveBeenCalled();
  });
});
