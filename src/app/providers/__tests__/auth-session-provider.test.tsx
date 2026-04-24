import React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import AuthSessionProvider from '../auth-session-provider';

const mockSetUser = jest.fn();
const mockSetInitialized = jest.fn();

jest.mock('../../../features/auth/presentation/store/auth.store', () => ({
  useAuthStore: jest.fn(),
}));

import { useAuthStore } from '../../../features/auth/presentation/store/auth.store';

const buildStoreState = (initialized: boolean) => ({
  initialized,
  setUser: mockSetUser,
  setInitialized: mockSetInitialized,
});

beforeEach(() => {
  jest.clearAllMocks();
  jest.mocked(useAuthStore).mockReturnValue(buildStoreState(false));
});

describe('AuthSessionProvider', () => {
  it('renders the loading screen when not initialized', () => {
    const { getByText } = render(
      <AuthSessionProvider>
        <Text>Children</Text>
      </AuthSessionProvider>,
    );
    expect(getByText('Cargando...')).toBeTruthy();
  });

  it('does not render children while loading', () => {
    const { queryByText } = render(
      <AuthSessionProvider>
        <Text>Children</Text>
      </AuthSessionProvider>,
    );
    expect(queryByText('Children')).toBeNull();
  });

  it('renders children when initialized', () => {
    jest.mocked(useAuthStore).mockReturnValue(buildStoreState(true));
    const { getByText } = render(
      <AuthSessionProvider>
        <Text>Children</Text>
      </AuthSessionProvider>,
    );
    expect(getByText('Children')).toBeTruthy();
  });

  it('subscribes to onAuthStateChanged on mount', () => {
    const auth = require('@react-native-firebase/auth').default;
    render(
      <AuthSessionProvider>
        <Text>Children</Text>
      </AuthSessionProvider>,
    );
    expect(auth().onAuthStateChanged).toHaveBeenCalled();
  });

  it('calls the unsubscribe function on unmount', () => {
    const mockUnsubscribe = jest.fn();
    const auth = require('@react-native-firebase/auth').default;
    auth().onAuthStateChanged.mockReturnValueOnce(mockUnsubscribe);

    const { unmount } = render(
      <AuthSessionProvider>
        <Text>Children</Text>
      </AuthSessionProvider>,
    );
    unmount();
    expect(mockUnsubscribe).toHaveBeenCalled();
  });

  it('passes the Firebase user to setUser when auth state changes', () => {
    const auth = require('@react-native-firebase/auth').default;
    const mockUser = { uid: 'abc' };
    auth().onAuthStateChanged.mockImplementationOnce((cb: any) => {
      cb(mockUser);
      return jest.fn();
    });
    render(
      <AuthSessionProvider>
        <Text>Children</Text>
      </AuthSessionProvider>,
    );
    expect(mockSetUser).toHaveBeenCalledWith(mockUser);
    expect(mockSetInitialized).toHaveBeenCalled();
  });
});
