import { loginUseCase } from '../login.use-case';
import { authService } from '../../../data/services/auth.service';

jest.mock('../../../data/services/auth.service', () => ({
  authService: {
    login: jest.fn().mockResolvedValue(undefined),
  },
}));

describe('loginUseCase', () => {
  beforeEach(() => jest.clearAllMocks());

  it('delegates to authService.login with the given credentials', async () => {
    await loginUseCase('user@test.com', 'pass123');
    expect(authService.login).toHaveBeenCalledWith('user@test.com', 'pass123');
  });

  it('propagates errors from authService', async () => {
    (authService.login as jest.Mock).mockRejectedValueOnce(
      new Error('login failed'),
    );
    await expect(loginUseCase('user@test.com', 'bad')).rejects.toThrow(
      'login failed',
    );
  });
});
