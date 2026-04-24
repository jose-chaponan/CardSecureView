import { logoutUseCase } from '../logout.use-case';
import { authService } from '../../../data/services/auth.service';

jest.mock('../../../data/services/auth.service', () => ({
  authService: {
    logout: jest.fn().mockResolvedValue(undefined),
  },
}));

describe('logoutUseCase', () => {
  beforeEach(() => jest.clearAllMocks());

  it('delegates to authService.logout', async () => {
    await logoutUseCase();
    expect(authService.logout).toHaveBeenCalled();
  });

  it('propagates errors from authService', async () => {
    (authService.logout as jest.Mock).mockRejectedValueOnce(
      new Error('logout failed'),
    );
    await expect(logoutUseCase()).rejects.toThrow('logout failed');
  });
});
