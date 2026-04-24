import { authService } from '../auth.service';
import auth from '@react-native-firebase/auth';

const mockAuthInstance = (auth as jest.MockedFunction<any>)();

describe('authService', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('login', () => {
    it('calls signInWithEmailAndPassword with the given credentials', async () => {
      await authService.login('user@test.com', 'pass123');
      expect(mockAuthInstance.signInWithEmailAndPassword).toHaveBeenCalledWith(
        'user@test.com',
        'pass123',
      );
    });

    it('propagates errors thrown by Firebase', async () => {
      mockAuthInstance.signInWithEmailAndPassword.mockRejectedValueOnce(
        new Error('auth/wrong-password'),
      );
      await expect(authService.login('user@test.com', 'bad')).rejects.toThrow(
        'auth/wrong-password',
      );
    });
  });

  describe('logout', () => {
    it('calls signOut', async () => {
      await authService.logout();
      expect(mockAuthInstance.signOut).toHaveBeenCalled();
    });

    it('propagates errors thrown by Firebase', async () => {
      mockAuthInstance.signOut.mockRejectedValueOnce(new Error('auth/error'));
      await expect(authService.logout()).rejects.toThrow('auth/error');
    });
  });
});
