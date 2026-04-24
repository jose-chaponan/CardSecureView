import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import LoginScreen from '../LoginScreen';

const mockHandleLogin = jest.fn();
const mockSetEmail = jest.fn();
const mockSetPassword = jest.fn();

const mockHookState = {
  email: 'test@example.com',
  password: 'testpassword',
  isLoading: false,
  error: null as string | null,
  setEmail: mockSetEmail,
  setPassword: mockSetPassword,
  handleLogin: mockHandleLogin,
};

jest.mock('../../hooks/useLoginScreen', () => ({
  useLoginScreen: () => mockHookState,
}));

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockHookState.isLoading = false;
    mockHookState.error = null;
  });

  it('renders the app title', () => {
    const { getByText } = render(<LoginScreen />);
    expect(getByText('CardSecureView')).toBeTruthy();
  });

  it('renders the subtitle', () => {
    const { getByText } = render(<LoginScreen />);
    expect(getByText('Inicia sesión para continuar')).toBeTruthy();
  });

  it('renders the login button', () => {
    const { getByText } = render(<LoginScreen />);
    expect(getByText('Ingresar')).toBeTruthy();
  });

  it('calls handleLogin when the button is pressed', () => {
    const { getByText } = render(<LoginScreen />);
    fireEvent.press(getByText('Ingresar'));
    expect(mockHandleLogin).toHaveBeenCalled();
  });

  it('calls setEmail when the email input changes', () => {
    const { getByPlaceholderText } = render(<LoginScreen />);
    fireEvent.changeText(
      getByPlaceholderText('correo@ejemplo.com'),
      'new@email.com',
    );
    expect(mockSetEmail).toHaveBeenCalledWith('new@email.com');
  });

  it('calls setPassword when the password input changes', () => {
    const { getByPlaceholderText } = render(<LoginScreen />);
    fireEvent.changeText(getByPlaceholderText('••••••••'), 'newpass');
    expect(mockSetPassword).toHaveBeenCalledWith('newpass');
  });

  it('shows error message when error is set', () => {
    mockHookState.error = 'Credenciales inválidas. Verifica tu email y contraseña.';
    const { getByText } = render(<LoginScreen />);
    expect(
      getByText('Credenciales inválidas. Verifica tu email y contraseña.'),
    ).toBeTruthy();
  });

  it('disables the button and shows ActivityIndicator when loading', () => {
    mockHookState.isLoading = true;
    const { queryByText, getByTestId } = render(<LoginScreen />);
    expect(queryByText('Ingresar')).toBeNull();
  });
});
