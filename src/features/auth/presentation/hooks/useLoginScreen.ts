import { useState } from 'react';
import { AUTH_TEST_EMAIL, AUTH_TEST_PASSWORD } from '../../constants';
import { useAuthStore } from '../store/auth.store';

export const useLoginScreen = () => {
  const [email, setEmail] = useState(AUTH_TEST_EMAIL);
  const [password, setPassword] = useState(AUTH_TEST_PASSWORD);
  const [error, setError] = useState<string | null>(null);

  const { login, isLoading } = useAuthStore();

  const handleLogin = async () => {
    setError(null);
    if (!email.trim()) {
      setError('El email es requerido.');
      return;
    }
    if (!email.includes('@')) {
      setError('Por favor ingresa un email válido.');
      return;
    }
    if (!password) {
      setError('La contraseña es requerida.');
      return;
    }
    try {
      await login(email.trim(), password);
    } catch {
      setError('Credenciales inválidas. Verifica tu email y contraseña.');
    }
  };

  return {
    email,
    password,
    isLoading,
    error,
    setEmail,
    setPassword,
    handleLogin,
  };
};
