import { AUTH_TEST_EMAIL, AUTH_TEST_PASSWORD } from '../index';

describe('auth constants', () => {
  it('reads TEST_EMAIL from react-native-config', () => {
    expect(AUTH_TEST_EMAIL).toBe('test@example.com');
  });

  it('reads TEST_PASSWORD from react-native-config', () => {
    expect(AUTH_TEST_PASSWORD).toBe('testpassword');
  });

  it('falls back to empty string when config is undefined', () => {
    jest.resetModules();
    jest.mock('react-native-config', () => ({}));
    const { AUTH_TEST_EMAIL: email, AUTH_TEST_PASSWORD: pass } =
      require('../index');
    expect(email).toBe('');
    expect(pass).toBe('');
  });
});
