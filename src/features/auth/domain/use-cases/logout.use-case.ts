import { authService } from '../../data/services/auth.service';

export const logoutUseCase = async (): Promise<void> => {
  await authService.logout();
};
