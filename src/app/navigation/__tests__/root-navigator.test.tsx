import React from 'react';
import { render } from '@testing-library/react-native';
import RootNavigator from '../root-navigator';
import { useAuthStore } from '../../../features/auth/presentation/store/auth.store';

jest.mock('../../../features/auth/presentation/store/auth.store', () => ({
  useAuthStore: jest.fn(),
}));

jest.mock(
  '../../../features/cards/presentation/screens/DashboardScreen',
  () => {
    const { Text } = require('react-native');
    return () => <Text>DashboardScreen</Text>;
  },
);

jest.mock(
  '../../../features/auth/presentation/screens/LoginScreen',
  () => {
    const { Text } = require('react-native');
    return () => <Text>LoginScreen</Text>;
  },
);

describe('RootNavigator', () => {
  it('renders LoginScreen when user is null', () => {
    jest.mocked(useAuthStore).mockImplementation((selector: any) =>
      selector({ user: null }),
    );
    const { getByText } = render(<RootNavigator />);
    expect(getByText('LoginScreen')).toBeTruthy();
  });

  it('renders DashboardScreen when user is authenticated', () => {
    jest.mocked(useAuthStore).mockImplementation((selector: any) =>
      selector({ user: { uid: 'abc', email: 'a@b.com' } }),
    );
    const { getByText } = render(<RootNavigator />);
    expect(getByText('DashboardScreen')).toBeTruthy();
  });
});
